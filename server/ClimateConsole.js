var openid = require('openid');
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var relyingParty = new openid.RelyingParty(
    'http://example.com/verify', // Verification URL (yours)
    null, // Realm (optional, specifies realm for OpenID authentication)
    false, // Use stateless verification
    false, // Strict mode
    []); // Optional list of extensions to enable and include

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (req, res) {
  var parsedUrl = url.parse(req.url);
  if(parsedUrl.pathname == '/authenticate')
  { 
    // User supplied identifier
    var query = querystring.parse(parsedUrl.query);
    var identifier = query.openid_identifier;

    // Resolve identifier, associate, and build authentication URL
    relyingParty.authenticate(identifier, false, function(error, authUrl)
        {
          if (error)
          {
            res.writeHead(200);
            res.end('Authentication failed: ' + error.message);
          }
          else if (!authUrl)
          {
            res.writeHead(200);
            res.end('Authentication failed');
          }
          else
          {
            res.writeHead(302, { Location: authUrl });
            res.end();
          }
        });
  }
  else if(parsedUrl.pathname == '/verify')
  {
      // Verify identity assertion
      // NOTE: Passing just the URL is also possible
      relyingParty.verifyAssertion(req, function(error, result)
      {
        res.writeHead(200);
        res.end(!error && result.authenticated 
            ? 'Success :)'
            : 'Failure :(');
      });
  }
  else
  {
      // Deliver an OpenID form on all other URLs
      res.writeHead(200);
      res.end('<!DOCTYPE html><html><body>'
          + '<form method="get" action="/authenticate">'
          + '<p>Login using OpenID</p>'
          + '<input name="openid_identifier" />'
          + '<input type="submit" value="Login" />'
          + '</form></body></html>');
  }
});
server.listen(process.env.PORT, process.env.IP);

console.log("Server running at http://" + process.env.IP + ':' + process.env.PORT);