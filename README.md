[![view on npm](http://img.shields.io/npm/v/hand-over-apns.svg?style=flat-square)](https://www.npmjs.com/package/hand-over-apns)
[![downloads per month](http://img.shields.io/npm/dm/hand-over-apns.svg?style=flat-square)](https://www.npmjs.com/package/hand-over-apns)
[![node version](https://img.shields.io/badge/node-%3E=0.8-brightgreen.svg?style=flat-square)](https://nodejs.org/download)
[![build status](https://img.shields.io/travis/schwarzkopfb/hand-over-apns.svg?style=flat-square)](https://travis-ci.org/schwarzkopfb/hand-over-apns)
[![test coverage](https://img.shields.io/coveralls/schwarzkopfb/hand-over-apns.svg?style=flat-square)](https://coveralls.io/github/schwarzkopfb/hand-over-apns)
[![license](https://img.shields.io/npm/l/hand-over-apns.svg?style=flat-square)](https://github.com/schwarzkopfb/hand-over-apns/blob/master/LICENSE)

Apple Push Notification Service plugin for [Handover](https://npm.im/hand-over).

## Usage

```js

const Handover = require('hand-over'),
      notifier = new Handover

notifier.use('apns', {
    cert:       'path/to/certificate.pem',
    key:        'path/to/key.pem',
    passphrase: 'your passphrase',
})

notifier.send('userId', {
    expiry: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    count: 42,
    sound: 'ping.aiff',
    alert: 'Notification title',
    payload: { test: 'test' }
}, callback)

function callback(err) {
    if (err)
        console.error(err.stack)
    else
        console.log('yay!')
}

```

__Note:__ Options are passed to the [apn](https://npm.im/apn) package's `Connection` constructor.

## Installation

With npm:

    npm install hand-over-apns

## License

[MIT](/LICENSE)
