'use strict';

var debug = require('debug')('environment');
var Optional = require('guava-optional');

var DEFAULT_NAME = 'development';

/**
 * @private
 * @param {String} value The `value` to check
 * @returns {boolean} Returns `true` only if the value is `true`
 */
function safeSupports(value) {
  return (value.trim().toLowerCase() === 'true');
}

/**
 * @private
 * @returns {Optional} Returns An object containing the user environment
 */
function getEnvironment() {
  if (process && typeof process !== 'undefined') {
    return Optional.fromNullable(process.env);
  }

  return Optional.absent();
}

var Environment = function() {
  var environment = getEnvironment();
  if (environment.isPresent()) {
    this.name = (environment.get().NODE_ENV || DEFAULT_NAME);
  } else {
    this.name = DEFAULT_NAME;
  }
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
 * Get a `Optional` property value according to Environment
 *
 * @param {String} key The property name
 * @returns {Optional} Returns the `Optional` property value according to Environment
 */
Environment.prototype.getOptionalProperty = function(key) {
  debug('Getting [%s] property from Environment...', key);

  var environment = getEnvironment();
  if (environment.isPresent()) {
    try {
      var properties = environment.get();
      if (properties.hasOwnProperty(key)) {
        var value = properties[key];
        if (value && typeof value === 'string' && value !== 'undefined' && value !== 'null') {
          return Optional.of(value);
        }
      }
    } catch (error) {
      debug('Error getting Environment property for key [%s]!', key, error);
    }
  }

  return Optional.absent();
};

/**
 * Get the property value according to Environment,
 * if it's not present will return the `defaultValue`
 *
 * @param {String} key The property name
 * @param {String} defaultValue The  default value
 * @returns {String} Returns the property value according to Environment
 */
Environment.prototype.getPropertyOr = function(key, defaultValue) {
  var property = this.getOptionalProperty(key);
  if (property.isPresent()) {
    return property.get();
  }

  debug('Environment has no the [%s] property, returning default value [%s]', key, defaultValue);
  return defaultValue;
};

/**
 * Get the property value according to Environment,
 * use only if you are 100% sure that the environment has a `key`
 *
 * @param {String} key The property name
 * @returns {String} Returns the property value according to Environment, otherwise returns `null`
 */
Environment.prototype.getProperty = function(key) {
  return this.getPropertyOr(key, null);
};

/**
 * Checks if a `key` is present
 *
 * @param {String} key The value to check.
 * @returns {boolean} Returns `true` only if the Environment has a property
 */
Environment.prototype.hasProperty = function(key) {
  debug('Checking is Environment has the [%s] property...', key);

  var property = this.getOptionalProperty(key);

  return property.isPresent();
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
 * @param  {boolean} defaultValue The `default value`
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
 * Get a `Optional` property number value according to Environment
 *
 * @param {String} key The property name
 * @returns {Optional} Returns the `Optional` property number value according to Environment
 */
Environment.prototype.getOptionalNumber = function(key) {
  var property = this.getOptionalProperty(key);
  if (property.isPresent()) {
    var number = property.get();

    if (typeof number === 'number') {
      return Optional.of(number);
    }

    try {
      return Optional.fromNullable(Number(number));
    } catch (error) {
      debug('Error getting number from string [%s]!', number, error);
    }
  }

  return Optional.absent();
};

/**
 * Get the property number value according to Environment,
 * if it's not present will return the `defaultValue`
 *
 * @param {String} key The property name
 * @param {Number} defaultValue The  default value
 * @returns {Number} Returns the property number value according to Environment
 */
Environment.prototype.getNumberOr = function(key, defaultValue) {
  var number = this.getOptionalNumber(key);
  if (number.isPresent()) {
    return number.get();
  }

  debug('Environment has no the [%s] property, returning default value [%s]', key, defaultValue);
  return defaultValue;
};

/**
 * Get the property number value according to Environment,
 * use only if you are 100% sure that the environment has a key,
 *
 * @param {String} key The property name
 * @returns {Number} Returns the property number value according to Environment, otherwise returns `null`
 */
Environment.prototype.getNumber = function(key) {
  return this.getNumberOr(key, null);
};

/**
 * @returns {Array} Returns an Array`with all Environment keys
 */
Environment.prototype.getKeys = function() {
  var keys = [];
  var environment = getEnvironment();
  if (environment.isPresent()) {
    var properties = environment.get();
    for (var key in properties) {
      if (properties.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
  }

  return keys;
};

module.exports = new Environment();
