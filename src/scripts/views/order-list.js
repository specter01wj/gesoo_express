var EditView = require('../views/orderedit');
var itemTempalte = require('../templates/order-list.hbs');
var Models = require('../models/orders');
var swal   = require('sweetalert');


Backbone.$ = $;
var ItemView = Marionette.ItemView.extend({
    tagName: 'tr',
    className: 'list',
    template: itemTempalte,
    ui:{
        edit: '.edit',
        delete: '.delete'
    },
    events:{
        "click @ui.delete" : "onDelete",
        "click @ui.edit"   : "onEdit"
    },
    initialize: function(){
        this.listenTo(this.model,'sync',this.onSync);
    },
    onSync: function(){
        this.render();
    },
    onEdit: function(event){
        var editView = new EditView({model:this.model});    
        editView.render();
    },
    onDelete: function(event){
        event.preventDefault();
        var self = this;
        swal({ 
            title: "确定删除?",  
            text: "删除的订单无法还原",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定删除",
            closeOnConfirm: false 
            }, function(){   
                self.model.destroy({
                    wait:true,
                    success: function(model,response,options){
                        self.destroy();
                        swal("成功!", "您的订单已经成功删除", "success");
                    },
                    error: function(model,response,options){
                        swal("错误!", "订单未能删除", "error");
                    }
                }); 
            });
    },


});


var ListView = Marionette.CollectionView.extend({
    el: '#order-list',
    childView: ItemView,
    
    initialize: function(obj){
        //this.page = 0;
        var orders = new Models.OrderCollection();
        orders.fetch({page: obj.page});
        this.collection = orders;
    }

});

/*var listView = new ListView();


listView.on("render", function(){
  console.log("the collection view was rendered!");
});

listView.render();*/

module.exports = ListView;
