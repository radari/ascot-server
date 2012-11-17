
/*
 * GET tags
 */

exports.get = function(req, res){
  var testLook = {
    title: "test",
    url: "ascotproject.com/test.jpg",
    tags: [{
      position: {x: 32, y: 32}, 
      index: 1,
      product: {
        name: "Big Bang Gold Leopard", 
        brand: "Hublot",
        type: "watch",
        price: 1000000,
        id: 1,
        buy_link: "http://www.hublot.com/watch/big-bang/98/gold-leopard"
      }
    },{

    }]
  };


  res.jsonp(JSON.stringify(testLook));
};
