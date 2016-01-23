
var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);

  User.model.find()
    .exec(function(err, users) {
      view.render('index', {
        users: users,
      });
    });

};
