# [![>bootenv](http://bootenv.com/img/logo-light-transparent-readme-files.png)](http://bootenv.com)-NODE

[![NPM](https://nodei.co/npm/bootenv.png?compact=true)](https://nodei.co/npm/bootenv/)

[![license](https://img.shields.io/badge/license-Apache_2.0-blue.svg)]()
[![engine](https://img.shields.io/badge/iojs-v2.1.0-yellow.svg)]()
[![npm](https://img.shields.io/npm/v/npm.svg)]()
[![Build Status](https://travis-ci.org/bootenv/bootenv-node.svg?branch=master)](https://travis-ci.org/bootenv/bootenv-node)

> It’s simple! Node.js utility methods to make using the environment properties more pleasant. `:wq`

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)

## Installation

### NPM

```
npm install bootenv --save
```

### Manual Installation

* `git clone git@github.com:bootenv/bootenv-node.git` this repository
* change into the new directory `bootenv-node`
* `nvm use`
* `npm install`
* `npm link`

### Run tests

```
npm test
```
## Usage

### Working with Environment Properties

*Environment* is a feature that allow you to define different components and settings based on the Environment properties.

### Getting Environment properties in your code

There are three useful methods to get the Environment properties: 

- `environment#getProperty(String)`
- `environment#getProperty(String, String)` 
- `environment#getOptionalProperty(String)`

The _first_ method returns the Environment property value if the value exists (_use only if you are 100% sure that the environment has a key_) if not found returns `null`.

The _second_ method returns the Environment property value if the key exists, otherwise returns the default value!

The _last_ method returns a Javascript [Optional](https://code.google.com/p/guava-libraries/wiki/UsingAndAvoidingNullExplained) property representation!

Please, take a look in the code below:

```javascript
var environment = require('bootenv');

var SEND_EMAIL_PROPERTY = 'SEND_EMAIL',
    EMAIL_ADDRESS_PROPERTY = 'EMAIL_ADDRESS',
    DEFAULT_EMAIL_ADDRESS_PROPERTY = 'DEFAULT_EMAIL_ADDRESS',
    DEFAULT_EMAIL_ADDRESS = 'support@bootenv.org';
    
...

if(environment.supportsOr(SEND_EMAIL_PROPERTY, false)) {
  var address = environment.getOptionalProperty(EMAIL_ADDRESS_PROPERTY);
  if(address.isPresent()){
    var email = address.get();
    console.info("Sending email to [%s]...", email);    
    ...
  } else {
    var email = environment.getPropertyOr(DEFAULT_EMAIL_ADDRESS_PROPERTY, DEFAULT_EMAIL_ADDRESS);
    console.info("Sending email to default address [%s]...", email);  
    ...
  }
} else {
  console.info('Not email send!');
}
```

## Further Reading / Useful Links

* [npm](https://www.npmjs.com/)
* [Node.js Foundation](https://nodejs.org/foundation/)
* [Node.js guide](http://nodeguide.com/)
* [The Art of Node](https://github.com/maxogden/art-of-node/#the-art-of-node)

## Versions
 
 - 1.0.0 (current)

## License

[Apache-2.0](LICENSE)
