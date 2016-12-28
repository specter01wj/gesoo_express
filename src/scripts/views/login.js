var $        = require('jquery');
var _        = require('underscore');
var Backbone = require('backbone');
var Session  = require('../services/session');
var Account  = require('../services/account');

var swal   = require('sweetalert');

var template = require('../templates/login.hbs');

Backbone.$ = $;

var loginView = Backbone.View.extend({
    el :  '#main-view',

    events: {
        "submit #form-login":  "onSubmit"
    },
    onSubmit:function(e){
        e.preventDefault();
        var username = document.loginForm.username.value;
        var password = document.loginForm.password.value;
        Account.login(username,password);
        console.log('submit');
    },
    initialize: function(){
        this.listenTo(Account,'success',this.onLogined);
        this.listenTo(Account,'failed',this.onFailed);
    },
    onFailed: function(){
        sweetAlert("登录失败", "请检查您的用户名和密码是否正确", "error");
    },
    onLogined: function (){
        Backbone.history.navigate('',{trigger:true});
    },
    render: function(){
        var output = template();
        this.el.innerHTML = output;
        return this;
    }

});

window.$ = $;
module.exports = loginView;
