
var async = require('async');
var updates = {};

updates.saveSingleModel = function(model, callback){
  model.save(callback);
};

updates.saveSingleModels = function(models){
  return function(callback){
    async.eachSeries(models, updates.saveSingleModel, callback);
  };
};

updates.saveModels = function(list, data){
  return function(callback){
    list.model.create(data, callback);
  };
}

exports = module.exports = updates;
