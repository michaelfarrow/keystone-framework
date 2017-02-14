var keystone = require('keystone')
var Types = keystone.Field.Types

/**
LIST OPTIONS
*/

var User = new keystone.List('User', {
  track: true,
  defaultColumns: 'name, email'
})

/**
COMMON FIELDS
*/

User.add({
  name: { type: Types.Name, required: true, index: true },
  email: { type: Types.Email, initial: true, required: true, index: true },
  password: { type: Types.Password, initial: true, required: false },
  profileImage: { type: Types.CloudinaryImage, autoCleanup: true, folder: keystone.get('cloudinary prefix') + '/users', publicID: 'id' }
}, 'Permissions', {
  canAccessKeystone: { type: Boolean, initial: true, default: false }
})

/**
VALIDATION FUNCTIONS
*/

// Prevent user from disabling their own keystone access
User.schema.pre('save', function (next) {
  if (this._id && this._req_user && this._id.equals(this._req_user._id)) {
    this.set('canAccessKeystone', true)
  }
  next()
})

/**
REGISTER MODEL & EXPORT
We export the model because we may need to extend it later
*/
User.register()
exports = module.exports = User
