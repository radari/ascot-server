var cheerio = require('cheerio');
var request = require('request');
var Sleep = require('sleep');
var fs = require('fs');
var httpGet = require('http-get');
var url = require('url');

fs.readFile('./routes/tools/linkshare1.html', function(error, data) {
  var s = data.toString();
  var $ = cheerio.load(s);
  //console.log($('td.td_merchant').html());
  $('td.td_merchant').each(function(i, e) {
    $(this).children('a').each(function(j, a) {
      var mid = $(this).attr('onmouseover').match(/Advertiser ID: \d{3,7}/)[0].substr("Advertiser ID: ".length);
      var brand = $(this).text().trim();
      var oid = $(this).attr('href').match(/oid=\d+/i)[0].substr('oid='.length);
      console.log(i);
      Sleep.sleep(1);
      console.log('y');
      httpGet.get('http://www.bing.com/search?q=' + encodeURIComponent(brand), function(error, response) {
        //console.log(response.buffer);
        //console.log(response.buffer.toString().indexOf('hurley.com'));
        var $ = cheerio.load(response.buffer.toString());
        var u = url.parse($('div#results h3 a').first().attr('href'));
        var host = u.host;
        var host2 = "";
        if (host.indexOf('www.') == 0) {
          host2 = host.substr('www.'.length);
        } else {
          host2 = 'www.' + host;
        }
        console.log(brand + ', ' + mid + ', ' + host);
        console.log(brand + ', ' + mid + ', ' + host2);
      });
    });
  });
});