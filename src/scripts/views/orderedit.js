var _        = require('underscore');
var Backbone = require('backbone');
var Session  = require('../services/session');
var StatesHash = require('./states_hash.json');

window.jQuery = $;
var Datepicker = require('jquery-datetimepicker');
//var Schema = require('schema');
var validate = require('jquery-validation');

var template = require('../templates/orderedit.hbs');
var swal   = require('sweetalert');

require('../services/jquery.formatter');

var orderEdit = Backbone.View.extend({
    el :  '#orderedit-view',

    events: {
        "click #order-btn-submit":  "onSubmit",
        "click #order-btn-cancel":  "onCancel"
    },
    onSubmit:function(e){
        e.preventDefault();
        var order = this.model;
        var form = document.editForm;
        
        if(self.$('#register_form').valid() ){
            if(this.model.isNew()){
                for(var i = 0; i < form.order_type.length; i++){
                    if(form.order_type[i].checked){
                        order.set('orderType',parseInt(form.order_type[i].value));
                        break;
                    }
                }
            }
            order.set('customerName',form.name.value);
            order.set('orderId',form.orderid.value);
            order.set('address',form.street.value);
            /*if (form.date_pickup.value === '' || form.date_delivery.value === ''){
            } else { 
                order.set('pickupTime' , new Date(form.date_pickup.value)); 
                order.set('deliveryTime' , new Date(form.delivery_time.value));
            }*/
            order.set('city',form.city.value);
            order.set('state',form.state.value);
            order.set('zipcode',form.zip.value);
            order.set('customerPhone',form.tel.value);
            //order.set('signatureRequired', form.sign.checked);
            order.set('signatureRequired', false);
            order.save();
        }
    },
    onCancel:function(e){
        $('.full-modal').addClass('hidden');
    },
    initialize: function(){
        var output = template({order: this.model.toJSON(), states:StatesHash });
        this.el.innerHTML = output;
        this.listenTo(this.model,'error',function(){
            swal("失败!", "您的订单保存失败", "error");
        });
        this.listenTo(this.model,'sync',function(){
            swal("成功!", "您的订单已经成功保存", "success");
            window.setTimeout(function(){
                $('.full-modal').addClass('hidden');
                window.location.reload(true);
            }, 1500);
        });
    },

    onLogined: function (){
        Backbone.history.navigate('',{});
    },
    render: function(){

        $('#phone').formatter({
            'pattern' : '({{999}}){{999}}-{{9999}}',
            'persistent': true
        });

        this.$el.removeClass('hidden');
        $('#delivery_time').datetimepicker({
            format: 'Y/m/d h:s:i'
        });
        this.$('#pickup_time').datetimepicker();
        this.$('#register_form').validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                street: {
                    required: true,
                    minlength: 5
                },
                date_pickup: {
                    required: false,
                    date: true
                },
                date_delivery: {
                    required: false,
                    date: true
                },
                city: {
                    required: true,
                    minlength: 4
                },
                state: {
                    required: true
                },
                zip: {
                    required: true,
                    digits: true,
                    minlength: 5,
                    maxlength: 5
                },
                tel:{
                    required: true,
                    minlength: 10
                }
            },
            errorPlacement: function(error, element) {
                if (element.attr("id") == "name" )
                    error.insertAfter(".label");
                else if  (element.attr("id") == "street" )
                    error.insertAfter(".label");
                else if  (element.attr("id") == "date_pickup" )
                    error.insertAfter(".label");
                else if  (element.attr("id") == "date_delivery" )
                    error.insertAfter(".label");
                else if  (element.attr("id") == "city" )
                    error.insertAfter(".label");
                else if  (element.attr("id") == "state" )
                    error.insertAfter(".label");
                else if  (element.attr("id") == "zip" )
                    error.insertAfter(".label");
                else if  (element.attr("id") == "tel" )
                    error.insertAfter(".label");
                else if  (element.attr("id") == "orderid" )
                    error.insertAfter(".label");
                else
                    error.insertAfter(element);
            },
            messages: {
                name: {
                    required: "Please enter your name",
                    minlength: "Your username must consist of at least 2 characters"
                },
                street: {
                    required: "Please provide an address",
                    minlength: "Your address must be at least 5 characters long"
                },
                date_pickup: {
                    required: "Please provide a pickup date",
                    date: "Your pickup date must be a valid date"
                },
                date_delivery: {
                    required: "Please provide a delivery date",
                    date: "Your delivery date must be a valid dage"
                },
                city: {
                    required: "Please provide a city",
                    minlength: "Your city name must be at least 4 characters long"
                },
                state: {
                    required: "Please provide a state"
                },
                zip: {
                    required: "Please provide a zipcode",
                    minlength: "Your zipcode must be exactly 5 characters long"
                },
                tel: {
                    required: "Please provide a telephone number",
                    minlength: "Your telephone number must be exactly 10 digits long"
                }
            }
        });
        return this;
    }

});

window.$ = $;
module.exports = orderEdit;
