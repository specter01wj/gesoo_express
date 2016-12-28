var _        = require('underscore');
var Backbone = require('backbone');
var Session  = require('../services/session');
var Parse    = require('parse');
var moment   = require('moment-timezone');

Backbone.$ = $;

var Order = Backbone.Model.extend({
    idAttribute: 'objectId',
    sync: function(method,model,options){
        var self = this;
        var apiName;   //insertOrder updateOrder deleteOrder
        options = options || {};
        var data = options.data || {};
        var user = Session.get('user'); 
        _.extend(data,user);

        switch(method){
            case 'delete':
                apiName  = 'deleteOrder';
                var ids  = {objectIds: [model.id]};
                _.extend(data,ids);
                break;
            case 'create':   //insertOrder 
                if (model.isEmpty()) return;
                apiName = 'insertOrder';
                _.extend(data,model.toJSON());
                break;
            case 'update':   //updateOrder
                apiName = 'updateOrder'; 
                _.extend(data,model.toJSON());
                break;
        }

        if(data.pickupTime) data.pickupTime = new Date(data.pickupTime);
        if(data.deliveryTime) data.deliveryTime = new Date(data.deliveryTime);

        Parse.Cloud.run(apiName,data,{
            success: function(result){
                options.success.call(model,result);
            }, error: function(result){
                options.error.call(model,result);
            }
        });
    },
});

var OrderCollection = Backbone.Collection.extend({
    cache: [],
    model: Order,
    initialize: function(){
        this.bind('add',this.onModelAdded,this);
        this.bind('remove',this.onModelRemoved,this);
    },
    onModelRemoved: function(model,collection,options){
        console.log('onremove');
    },
    onModelAdded: function(model,collection,options){
    },
    checkCache: function(page){
        if(page < 0) throw new Error('fatal error: page is less than 0');
        if(this.cache.length===0) return false; //cached empty
        if (this.cache[page] && this.cache[page].length>0) 
            return this.cache[page];
        else
            return false;
    },
    rebuidCache: function(){
        var temp = _.compact(_.flatten(this.cache));
        this.cache = [];
        while(temp.length>0){
            this.cache.push(temp.splice(0,50));
        }
        this.trigger('rest');
    },
    sync: function(method,collection,options){
        var user = Session.get('user');
        switch(method){
            case 'read':
                options = options || {};
                options.data = options.data || {};
                _.extend(options.data,user);
                var self = collection;
                _.extend(options.data, {status: [], page: options.page});
                //var page = options.data && options.data.page || 0;
                var page = options.data && options.page || 0;

                Parse.Cloud.run('getAllOrder',options.data,{
                    success: function(result){
                        collection.cache[page] = result;
                        options.success.call(collection,result);
                    },
                    error: function(result){
                        options.error.call(collection,result);
                    }
                });
                break;
        }
    },
    parse: function(parseObjects){
        return _.map(parseObjects,function(v){
            var temp = v.toJSON();
            var result = _.pick(temp,'objectId','orderId', 'customerPhone', 'customerName', 'orderType','status','signatureRequired');
            result.createdAt = moment(temp.createdAt).format('MM/DD/YY h:mm A');
            if(temp.pickupTime)  result.pickupTime = moment(temp.pickupTime.iso).format('MM/d/YY h:mm A');
            if(temp.deliveryTime) result.deliveryTime = new Date(temp.deliveryTime.iso);
            if(result.orderType){
                result.address = temp.pickupAddress.split(',')[0];
                result.city    = temp.pickupCity;
                result.state   = temp.pickupState;
                result.zipcode = temp.pickupZipcode;

            }else{
                result.address = temp.deliveryAddress.split(',')[0];
                result.city    = temp.deliveryCity;
                result.state   = temp.deliveryState;
                result.zipcode = temp.deliveryZipcode;
            }
            return result;
        });
    }

});

window.Order = Order;
window.OrderCollection = OrderCollection;
module.exports = {
    Order: Order,
    OrderCollection: OrderCollection
} ;
