var template = require('../templates/index.hbs');
var OrderList = require('../views/order-list');
var Models = require('../models/orders');
var EditView = require('../views/orderedit');
var Session  = require('../services/session');

var indexView = Marionette.ItemView.extend({
    el : '#main-view',
    template: template,
    initialize: function(){
        this.page = 0;
        this.pageEnd = 0;
    },
    ui:{
        'add':'.add-btn'
    },
    events:{
        "click @ui.add" : "addNewOrder",
        "click .prev-driver":  "onPrev",
        "click .next-driver":  "onNext"
    },
    addNewOrder: function(){
        var editView = new EditView({model: new Models.Order()}); 
        editView.render();
    },
    onPrev: function(e){
        if(this.page>0) this.page --;
        this.render();
    },
    onNext: function(e){
        if(!this.pageEnd) this.page ++;
        this.render();
    },
    /*render: function(){
      var user = Session.get('user');
      this.el.innerHTML = template({user: user});
      var childView = (new OrderList());
        childView.render();
        this.$('#order-list').html(
          childView.el
        );
    },*/
    onRender: function(){
        var self = this;
        var user = Session.get('user');
        this.el.innerHTML = template({user: user, page: this.page+1});
        var childView = (new OrderList({collection: new OrderCollection(), page: this.page}));
        childView.render();
        this.$('#order-list').html(
          childView.el
        );

        var orders = new Models.OrderCollection();
        orders.fetch({page: this.page});
        this.collection = orders;
        this.listenTo(this.collection,'sync',this.onSync);
        
        if (self.page == 0)
            $('.pagination .prev-driver').addClass('disabled')
                .css('visibility', 'hidden');
        else 
            $('.pagination .prev-driver').removeClass('disabled')
                .css('visibility', 'visible');


    },
    onSync: function(){
        if (this.collection.length < 50 ) {
            this.pageEnd = 1;
            $('.pagination .next-driver').addClass('disabled')
                .css('visibility', 'hidden');
        }
        else {
            this.pageEnd = 0;
            $('.pagination .next-driver').removeClass('disabled')
                .css('visibility', 'visible');
        }
            
        
    }


});


module.exports = indexView;
