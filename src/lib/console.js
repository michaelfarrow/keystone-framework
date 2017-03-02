var debug = require('debug')('app')
var _ = require('lodash')

var consoleLog = console.log

var log = function () {
  var args = Array.from(arguments)
  args.pop()
  consoleLog.apply(console, args)
}

debug.log = log

// override console.log to use debug library
console.log = function () {
  var args = Array.from(arguments)
  if (args.length === 1 && _.isString(args[0])) {
    var argLines = args[0].trim().split('\n')
    return _.each(argLines, function (line) {
      debug.apply(this, [line])
    })
  }
  debug.apply(this, args)
}

module.exports = {
  withoutTime: log
}
