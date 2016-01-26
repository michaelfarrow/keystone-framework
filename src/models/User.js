
var keystone = require('keystone');
var Types = keystone.Field.Types;

var User = new keystone.List('User', {});

User.add({
  name: { type: Types.Name, required: true, index: true },
  email: { type: Types.Email, initial: true, required: true, index: true },
  password: { type: Types.Password, initial: true, required: false },
  profileImage: { type: Types.CloudinaryImage, autoCleanup: true }
}, 'Permissions', {
  // canAccessKeystoneOld: { type: Boolean, noedit: true, hidden: true },
  canAccessKeystone: { type: Boolean, initial: true, default: false },
});

User.schema.methods.wasActive = function () {
  this.lastActiveOn = new Date();
  return this;
};
//
// User.schema.path('canAccessKeystoneOld').get(function(value) {
//   if(value === undefined)
//     return this.get('canAccessKeystone');
//
//   return value;
// });
//
// User.schema.path('canAccessKeystoneOld').set(function(value) {
//   return value;
// });
//
// User.schema.path('canAccessKeystone').set(function(value) {
//   this.set('canAccessKeystoneOld', this.get('canAccessKeystone'));
//   return value;
// });
//
// User.schema.pre('save', function(next, done) {
//   if(this._id && this._req_user && this._id.equals(this._req_user._id)){
//     var canAccessKeystoneOld = this.get('canAccessKeystoneOld');
//     this.set('canAccessKeystone', canAccessKeystoneOld);
//     this.set('canAccessKeystoneOld', canAccessKeystoneOld);
//   }
//   next();
// });

User.track = true;
User.defaultColumns = 'name, email';
User.register();
