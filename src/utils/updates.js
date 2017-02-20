var async = require('async')

/**
 * Color mixer.
 * @module utils/updates
 */

/**
 * Save a single model instance. For use in async methods
 * @param {*} model - The model instance to save.
 * @param {mongooseModelSaveCallback} callback
 */
module.exports.saveSingleModel = function (model, callback) {
  model.save(callback)
}

/**
 * Save an array of single model instances.
 * @param {Array<*>} models - The array of model instances to save.
 * @param {function} callback
 */
module.exports.saveSingleModels = function (models, callback) {
  async.eachSeries(models, module.exports.saveSingleModel, callback)
}

/**
 * Create multiple objects based on an array of object literals.
 * @param {List} models - Type of Keystone List to create.
 * @param {Array<{}>} models - The array of object model literals.
 * @param {function} callback
 */
module.exports.saveModels = function (list, data, callback) {
  list.model.create(data, callback)
}
