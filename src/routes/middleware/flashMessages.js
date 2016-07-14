
var _ = require('lodash');

/**
Fetches and clears the flashMessages before a view is rendered
*/
exports = module.exports = function(req, res, next) {

	if(req.url.indexOf('/keystone') === 0)
    return next();

  var flashMessages = {
    info: req.flash('info'),
    success: req.flash('success'),
    warning: req.flash('warning'),
    error: req.flash('error')
  };

  // get old req.body and then flash the current req.body for next request
  var oldInput = req.flash('oldInput');
  req.flash('oldInput', req.body);


  res.locals.messages = _.some(flashMessages, function(msgs) {
    return msgs.length;
  }) ? flashMessages : false;

  res.locals.oldInput = oldInput && oldInput.length ? oldInput[0] : {};

  next();

};
