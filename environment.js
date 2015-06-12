'use strict';

var debug = require('debug')('environment');
var Optional = require('optional');

/**
 * @private
 * @param {String} value The `value` to check
 * @returns {boolean} Returns `true` only if the value is `true`
 */
function safeSupports(value) {
  return (value.trim().toLowerCase() === 'true');
}

var Environment = function() {
  this.name = (process.env.NODE_ENV || 'development');
};

/**
 * Get the `NODE_ENV` value, if not set, returns: `development`
 *
 * @returns {string} Returns the Environment name
 */
Environment.prototype.getName = function() {
  debug('Getting Environment name...');

  return this.name;
};

/**
 * Checks if a `key` is present
 *
 * @param {String} key The value to check.
 * @returns {boolean} Returns `true` only if the Environment has a property
 */
Environment.prototype.hasProperty = function(key) {
  debug('Checking is Environment has the [%s] property...', key);

  return process.env[key];
};

/**
 * Checks if a key is equals to `true` if it's not present will returns `false`
 *
 * @param {String} feature The `feature` name
 * @returns {boolean} Returns `true` only if the environment has a property and the value is `true`
 */
Environment.prototype.supports = function(feature) {
  debug('Checking is Environment supports the [%s] feature...', feature);

  var property = this.getOptionalProperty(feature);

  return (property.isPresent() && safeSupports(property.get()));
};

/**
 * Checks if a key is equals to `true`
 * if it's not present will return the `defaultValue`
 *
 * @param {String} feature The `feature` name
 * @param  {boolean} defaultValue The  default value
 * @returns {boolean} Returns `true` only if the environment has a property and the value is `true`,
 * otherwise: returns the `defaultValue`
 */
Environment.prototype.supportsOr = function(feature, defaultValue) {
  debug('Checking is Environment supports the [%s] feature...', feature);

  var property = this.getOptionalProperty(feature);
  if (property.isPresent()) {
    return safeSupports(property.get());
  }

  return defaultValue;
};

/**
 * Get a `Optional` property value according to Environment
 *
 * @param {String} key The property name
 * @returns {Optional} The `Optional` property value according to Environment
 */
Environment.prototype.getOptionalProperty = function(key) {
  debug('Checking is Environment has the [%s] property...', key);

  try {
    var value = process.env[key];
    if (value && value !== undefined && typeof value === 'string') {
      return Optional.fromNullable(value);
    }
  } catch (error) {
    debug('Error getting Environment property for key [%s]!', key, error);
  }

  return Optional.absent();
};

/**
 * Get the property value according to Environment,
 * if it's not present will return the `defaultValue`
 *
 * @param {String} key The property name
 * @param {String} defaultValue The  default value
 * @returns {String} the property value according to Environment
 */
Environment.prototype.getPropertyOr = function(key, defaultValue) {
  var property = this.getOptionalProperty(key);
  if (property.isPresent()) {
    return property.get();
  }

  return defaultValue;
};

/**
 * Get the property value according to Environment,
 * use only if you are 100% sure that the environment has a `key`
 *
 * @param {String} key The property name
 * @returns {String} the property value according to Environment, otherwise returns `null`
 */
Environment.prototype.getProperty = function(key) {
  return this.getPropertyOr(key, null);
};

module.exports = new Environment();
