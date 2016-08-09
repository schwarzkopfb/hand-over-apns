'use strict'

module.exports = HandoverAPNS

var inherits = require('util').inherits,
    Plugin   = require('hand-over/plugin'),
    apn      = require('apn')

function HandoverAPNS(opts) {
    Plugin.call(this, opts)

    opts.onError    = this.onError.bind(this)
    this.connection = new apn.Connection(opts)
}

inherits(HandoverAPNS, Plugin)

HandoverAPNS.prototype.name = 'apns'

HandoverAPNS.prototype.onError = function (err, notification, device) {
    if (device)
        err.target = device.token.toString(16)

    this.emit('error', err)
}

HandoverAPNS.prototype.send = function sendOverAPNS(token, data, callback) {
    if (!data)
        data = {}

    try {
        var device = new apn.Device(token),
            msg    = new apn.Notification

        if ('expiry' in data)
            msg.expiry = data.expiry

        if ('count' in data)
            msg.badge = data.count

        if ('sound' in data)
            msg.sound = data.sound

        if ('alert' in data)
            msg.alert = data.alert

        msg.payload = data.payload || data

        this.connection.pushNotification(msg, device)
        callback()
    }
    catch (ex) {
        callback(ex)
    }
}

HandoverAPNS.prototype.destroy = function destroyAPNSConnection() {
    this.unref()
}

HandoverAPNS.prototype.unref = function unreferenceAPNSConnection() {
    this.connection.shutdown()
}
