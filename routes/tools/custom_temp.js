exports.Temp = function() {
  this.counter = 0;
  this.baseDirectory = './public/images/uploads/';

  this.open = function(prefix, callback) {
    callback(null, { path : this.baseDirectory + prefix + (++this.counter) });
  };
};