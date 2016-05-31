
var keystone = require('keystone');
var User = keystone.list('User');

/**
Login the user straight away in dev mode
*/
exports = module.exports = function(req, res, next) {

  if(keystone.get('env') == 'development' && !req.user){
    User.model.findOne()
      .where('canAccessKeystone', true)
      .exec(function(err, user){
        keystone.session.signinWithUser(user, req, res, function(){
          next();
        });
      });
  }else{
    next();
  }

};

