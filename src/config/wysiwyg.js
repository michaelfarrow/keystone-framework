var keystone = require('keystone');

keystone.set('wysiwyg additional plugins', 'paste');
// keystone.set('wysiwyg cloudinary images', true);

keystone.set('wysiwyg additional options', {
  paste_as_text: true,
  convert_urls: false,
  relative_urls: false
});

keystone.set('wysiwyg additional buttons', 'formatselect');

