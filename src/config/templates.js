
// var keystone = require('keystone');
// var Types = keystone.Field.Types;

// keystone.set('template options', {
//   track: false,
// });

// keystone.set('templates global', {
//   displayTitle: { type: Types.Text },
// });

// keystone.set('templates global footer', [
//   { heading: 'Linkable' },
//   { linkable: {
//       title: { type: Types.Text },
//       buttonTitle: { type: Types.Text, default: 'See More' },
//       description: { type: Types.Html, wysiwyg: true },
//     },
//   },
// ]);

// keystone.set('templates', {
//   'default': {
//     text: { type: Types.Text },
//     textarea: { type: Types.Textarea },
//   },
//   'home': {
//     text: { type: Types.Text },
//   },
// });

// keystone.set('template virtuals', {
//   'home.isActive': function(){
//     return this.fields.live;
//   },
// });

// keystone.set('template methods', {
//   'home.allPages': function(callback){
//     Page.model.find()
//       .where('template').ne('home')
//       .exec(callback);
//   },
// });

// keystone.set('templates validation', {
//   'Default': function(callback){
//     callback(this.slug == 'restricted' ? 'Error' : null);
//   },
// });
