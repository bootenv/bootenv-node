'use strict';

var test = require('tap').test;
var environment = require('./environment');

var KEY1 = 'KEY1';
var KEY2 = 'KEY2';
var KEY3 = 'KEY3';
var KEY4 = 'KEY4';
var KEY5 = 'KEY5';
var KEY6 = 'KEY6';

var VALUE1 = ' TrUe';
var VALUE2 = 'fAlSe ';
var DEFAULT_VALUE = 'DEFAULT';
var DEFAULT_NUMBER = 10;

function loadProperties() {
  process.env[KEY1] = VALUE1;
  process.env[KEY2] = VALUE2;
  process.env[KEY3] = null;
  process.env[KEY4] = '';
}

function loadNumberProperties() {
  process.env[KEY1] = '1000000';
  process.env[KEY2] = '2.5';
  process.env[KEY3] = '-3';
  process.env[KEY4] = null;
  process.env[KEY5] = 'abc123';
  process.env[KEY6] = '';
}

test('>bootenv environment', function(tap) {

  tap.test('getName', function(t) {
    t.equal('development', environment.getName());

    t.end();
  });

  tap.test('hasProperty', function(t) {
    loadProperties();

    t.ok(environment.hasProperty(KEY1));
    t.ok(environment.hasProperty(KEY2));
    t.notOk(environment.hasProperty(KEY3));
    t.notOk(environment.hasProperty(KEY4));

    t.end();
  });

  tap.test('supports', function(t) {
    loadProperties();

    t.ok(environment.supports(KEY1));
    t.notOk(environment.supports(KEY2));
    t.notOk(environment.supports(KEY3));
    t.notOk(environment.supports(KEY4));

    t.end();
  });

  tap.test('supportsOr', function(t) {
    loadProperties();

    t.ok(environment.supportsOr(KEY1, false));
    t.notOk(environment.supportsOr(KEY2, true));
    t.ok(environment.supportsOr(KEY3, true));
    t.ok(environment.supportsOr(KEY4, true));

    t.end();
  });

  tap.test('getOptionalProperty', function(t) {
    loadProperties();

    var property = environment.getOptionalProperty(KEY1);
    t.ok(property.isPresent());
    t.equal(VALUE1, property.get());

    property = environment.getOptionalProperty(KEY2);
    t.ok(property.isPresent());
    t.equal(VALUE2, property.get());

    property = environment.getOptionalProperty(KEY3);
    t.notOk(property.isPresent());

    property = environment.getOptionalProperty(KEY4);
    t.notOk(property.isPresent());

    t.end();
  });

  tap.test('getProperty', function(t) {
    loadProperties();

    t.equal(VALUE1, environment.getProperty(KEY1));
    t.equal(VALUE2, environment.getProperty(KEY2));
    t.notOk(environment.getProperty(KEY3));
    t.notOk(environment.getProperty(KEY4));

    t.end();
  });

  tap.test('getPropertyOr', function(t) {
    loadProperties();

    t.equal(VALUE1, environment.getPropertyOr(KEY1, DEFAULT_VALUE));
    t.equal(VALUE2, environment.getPropertyOr(KEY2, DEFAULT_VALUE));
    t.equal(DEFAULT_VALUE, environment.getPropertyOr(KEY3, DEFAULT_VALUE));
    t.equal(DEFAULT_VALUE, environment.getPropertyOr(KEY4, DEFAULT_VALUE));

    t.end();
  });

  tap.test('getOptionalNumber', function(t) {
    loadNumberProperties();

    var number = environment.getOptionalNumber(KEY1);
    t.ok(number.isPresent());
    t.equal(1000000, number.get());

    number = environment.getOptionalNumber(KEY2);
    t.ok(number.isPresent());
    t.equal(2.5, number.get());

    number = environment.getOptionalNumber(KEY3);
    t.ok(number.isPresent());
    t.equal(-3, number.get());

    number = environment.getOptionalNumber(KEY4);
    t.notOk(number.isPresent());

    number = environment.getOptionalNumber(KEY5);
    t.notOk(number.isPresent());

    number = environment.getOptionalNumber(KEY6);
    t.notOk(number.isPresent());

    t.end();
  });

  tap.test('getNumber', function(t) {
    loadNumberProperties();

    t.equal(1000000, environment.getNumber(KEY1));
    t.equal(2.5, environment.getNumber(KEY2));
    t.equal(-3, environment.getNumber(KEY3));
    t.notOk(environment.getNumber(KEY4));
    t.notOk(environment.getNumber(KEY5));
    t.notOk(environment.getNumber(KEY6));

    t.end();
  });

  tap.test('getNumberOr', function(t) {
    loadNumberProperties();

    t.equal(1000000, environment.getNumberOr(KEY1, DEFAULT_NUMBER));
    t.equal(2.5, environment.getNumberOr(KEY2, DEFAULT_NUMBER));
    t.equal(-3, environment.getNumberOr(KEY3, DEFAULT_NUMBER));
    t.equal(DEFAULT_NUMBER, environment.getNumberOr(KEY4, DEFAULT_NUMBER));
    t.equal(DEFAULT_NUMBER, environment.getNumberOr(KEY5, DEFAULT_NUMBER));
    t.equal(DEFAULT_NUMBER, environment.getNumberOr(KEY6, DEFAULT_NUMBER));

    t.end();
  });

  tap.test('getKeys', function(t) {
    loadProperties();

    t.ok(environment.getKeys());

    t.end();
  });

});
