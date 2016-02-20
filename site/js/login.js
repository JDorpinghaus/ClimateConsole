$(document).ready(function() {
    console.log( "Starting scripts" );
    listFields();
});

function login() {
  var redirectUrl = encodeURIComponent(window.location.href.substring(0, window.location.href.lastIndexOf("/")+1)) + 'fields.html';
  window.location.href = 'https://www.climate.com/static/app-login/?redirect_uri=' + redirectUrl;
}

function createAccount(){
  window.location.href = 'https://www.climate.com/farm-data-with-fieldview-prime/registration/';
}