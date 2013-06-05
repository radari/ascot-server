/**
 * Helper for list looks
 */
exports.looksList = function( Look,
                              view,
                              params,
                              title,
                              page,
                              sortBy,
                              clickthroughRoute,
                              res) {
  var MAX_PER_PAGE = 20;
  
  var sortParams = {};
  switch (sortBy) {
   case 'newest' :
    sortParams = { _id : -1 };
    break;
   case 'viewed' :
    sortParams = { numViews : -1 };
    break;
   case 'favorited' :
    sortParams = { numUpVotes : -1 };
    break;
   default :
    sortParams = { _id : -1 };
    break;
  }

  Look.find(params).count(function(error, count) {
    Look.
      find(params).
      sort(sortParams).
      limit(MAX_PER_PAGE).
      skip(page * MAX_PER_PAGE).
      exec(function(error, looks) {
        if (error || !looks) {
          res.format({
              'html' :
                  function() {
                    res.render('error',
                        { error : 'Error ' + JSON.stringify(error),
                          title : 'Ascot :: Error'
                        });
                  },
              'json' :
                  function() {
                    res.json({ error : error });
                  }
          });
        } else {
          res.format({
              'html' :
                  function() {
                    res.render(view,
                        { looks : looks,
                          listTitle : title,
                          title : 'Ascot :: ' + title,
                          page : page,
                          numPages : Math.ceil(count / MAX_PER_PAGE),
                          route : clickthroughRoute
                        });
                    },
                'json' :
                    function() {
                      res.json({ looks : looks });
                    }
              });
        }
      });
  });
};
