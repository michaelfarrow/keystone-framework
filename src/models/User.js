
var keystone = require('keystone');
var Types = keystone.Field.Types;

var User = new keystone.List('User', {});

User.add({
  name: { type: Types.Name, required: true, index: true },
  email: { type: Types.Email, initial: true, required: true, index: true },
  password: { type: Types.Password, initial: true, required: false },
}, 'Permissions', {
  canAccessKeystone: { type: Boolean },
});

User.schema.methods.wasActive = function () {
  this.lastActiveOn = new Date();
  return this;
};

User.track = true;
User.defaultColumns = 'name, email';
User.register();
