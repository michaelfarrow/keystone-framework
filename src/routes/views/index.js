
var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  User.model.find()
    .exec(function(err, users) {
      locals.users = users;
      view.render('index');
    });

};
