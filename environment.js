'use strict';

var debug = require('debug')('environment');
var Optional = require('optional');

var Environment = function() {
  this.name = (process.env.NODE_ENV || 'development');
};

/**
 * Get the NODE_ENV value, if not set, returns: 'development'
 * 
 * @returns {*|string}
 */
Environment.prototype.getName = function() {
  debug('Getting Environment name...');

  return this.name;
};

/**
 * Checks if a key is present
 *
 * @param key
 * @returns {*|string}
 */
Environment.prototype.hasProperty = function(key) {
  debug('Checking is Environment has the [%s] property...', key);

  return process.env[key];
};

module.exports = new Environment();
