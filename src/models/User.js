
var keystone = require('keystone');
var Types = keystone.Field.Types;

var User = new keystone.List('User', {});

User.add({
  name: { type: Types.Name, required: true, index: true },
  email: { type: Types.Email, initial: true, required: true, index: true },
  password: { type: Types.Password, initial: true, required: false },
  profileImage: { type: Types.CloudinaryImage, autoCleanup: true },
}, 'Permissions', {
  canAccessKeystone: { type: Boolean, initial: true, default: false },
});

User.schema.methods.wasActive = function () {
  this.lastActiveOn = new Date();
  return this;
};

User.schema.pre('save', function(next) {
  if(this._id && this._req_user && this._id.equals(this._req_user._id)){
    this.set('canAccessKeystone', true);
  }
  next();
});

User.track = true;
User.defaultColumns = 'name, email';
User.register();
