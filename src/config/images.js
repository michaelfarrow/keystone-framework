var keystone = require('keystone')

keystone.set('cloudinary config', process.env.CLOUDINARY_URL || 'cloudinary://XXXXX:XXXX@XXXXX')
keystone.set('cloudinary folders', true)
keystone.set('cloudinary prefix', keystone.utils.slug(keystone.get('name')))
