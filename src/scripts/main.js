$        = require('twbs');
window.$ = window.jQuery = $;
Backbone = require('backbone');
Backbone.$ = $;
Marionette = require('backbone.marionette');

var Router   = require('./router');
var Account  = require('./services/account');
var Session  = require('./services/session');


var Handlebars = require('hbsfy/runtime');
Handlebars.registerHelper('equal', function(v1, v2, options) {

  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

var App =  Marionette.Application.extend({
    session: Session,
    account: Account,
    onStart: function(){
        Backbone.history.start();
    }
});


var app = new App();
app.router = new Router();
window.App = app;
app.start();

