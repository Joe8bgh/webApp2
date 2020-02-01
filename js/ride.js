/*global WildRydes _config*/

var WildRydes = window.WildRydes || {};
WildRydes.map = WildRydes.map || {};

(function rideScopeWrapper($) {
  var authToken;
  WildRydes.authToken.then(function setAuthToken(token) {
    if (token) {
      authToken = token;
    } else {
      window.location.href = '/signin.html';
    }
  }).catch(function handleTokenError(error) {
    alert(error);
    window.location.href = '/signin.html';
  });

  function requestUnicorn() {
    $.ajax({
      method: 'POST',
      url: _config.api.invokeUrl + '/ride',
      headers: {
        Authorization: authToken
      },
      contentType: 'application/json',
      success: completeRequest,
      error: function ajaxError(jqXHR, textStatus, errorThrown) {
        console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
        console.error('Response: ', jqXHR.responseText);
        alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
      }
    });
  }

  function completeRequest(result) {
    var unicorn;
    var pronoun;
    console.log('Response received from API: ', result);
    unicorn = result.Unicorn;
    pronoun = unicorn.Gender === 'Male' ? 'his' : 'her';
    displayUpdate(unicorn.Name + ', your ' + unicorn.Color + ' unicorn, is on ' + pronoun + ' way.');
    displayUpdate(unicorn.Name + ' has arrived. Giddy up!');
  }

  function handleRequestClick(event) {
      event.preventDefault();
      requestUnicorn();
      WildRydes.authToken.then(function updateAuthMessage(token) {
        if (token) {
          displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
          $('.authToken').text(token);
        }
      });
      if (!_config.api.invokeUrl) {
        $('#noApiMessage').show();
      }
  }


  function displayUpdate(text) {
    $('#updates').append($('<li>' + text + '</li>'));
  }
}(jQuery));
