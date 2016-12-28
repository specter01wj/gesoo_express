var Account  = require('./services/account');
var LoginView = require('./views/login');
var IndexView = require('./views/index');
var ChangePassword = require('./views/changepassword');

Marionette = require('backbone.marionette');

var Router = Marionette.AppRouter.extend({
  execute: function(callback,args,name){
    if(Account.check() || name==='login'){
      if(callback) callback.apply(this,args);
    }else{
      this.navigate('login',{trigger:true});
    }
  },
  routes:{
      ''    : 'index',
    'login' : 'login',
    'logout' : 'logout',
    'changepassword' : 'changepassword'
  },
  index: function(){
    var indexView = new IndexView();
    indexView.render();
  },
  changepassword: function(){
    var changePassword = new ChangePassword();
    changePassword.render();
  },
  logout: function(){
      Account.logout();      
      this.navigate('login',{trigger:true});
  },
  login: function(){
    var loginView = new LoginView();
    loginView.render();
  }

});

module.exports = Router;
