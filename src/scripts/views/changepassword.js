var $        = require('jquery');
var _        = require('underscore');
var Backbone = require('backbone');
var Session  = require('../services/session');
var Account  = require('../services/account');

var swal   = require('sweetalert');

var template = require('../templates/changepassword.hbs');

Backbone.$ = $;

var changepasswordView = Backbone.View.extend({
    el :  '#main-view',

    events: {
        "click #order-btn-submit":  "onSubmit",
        "click #order-btn-cancel":  "onCancel"
    },
    onSubmit:function(e){
        e.preventDefault();
        var form = document.changepasswordForm;
        var username = $('#user-name').val();
        var password = $('#inputPassword').val();
        var newpassword = $('#repeatPassword').val();

        Account.changepassword(username,password, newpassword);

        

        console.log('change password submit');
    },
    onCancel:function(e){
        Backbone.history.navigate('',{trigger:true});
    },
    initialize: function(){
        var user = Session.get('user');
        var output = template({user: user});
        this.el.innerHTML = output;

        this.listenTo(this.model,'error',function(){
            swal("失败!", "您的订单保存失败", "error");
        });
        this.listenTo(this.model,'sync',function(){
            swal("成功!", "您的订单已经成功保存", "success");
            window.setTimeout(function(){
                $('.full-modal').addClass('hidden');
            }, 1500);
        });
    },
    onFailed: function(){
        sweetAlert("登录失败", "请检查您的用户名和密码是否正确", "error");
    },
    onLogined: function (){
        Backbone.history.navigate('',{trigger:true});
    },
    render: function(){
        /*var user = Session.get('user');
        var output = template({user: user});
        this.el.innerHTML = output;
        return this;*/
    }

});

window.$ = $;
module.exports = changepasswordView;
