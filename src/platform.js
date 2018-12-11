const OakPlatform = require('@oaklabs/platform')

async function getWifiScan (cb = function () {}) {
  // open a connection to the platform host
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })

  let network = await platform.network()

  network.WiFiScan(undefined, cb)
}

async function getKnownWifiNetworks (cb = function () {}) {
  // open a connection to the platform host
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })

  let network = await platform.network()

  network.ListKnownWiFiNetworks(undefined, cb)
}

async function addWifi (wifi, cb = function () {}) {
  // open a connection to the platform host
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })

  let network = await platform.network()

  network.AddWiFi(wifi, cb)
}

async function forgetWifi (wifi, cb = function () {}) {
  // open a connection to the platform host
  let platform = await new OakPlatform({
    host: process.env.PLATFORM_HOST || 'localhost:443'
  })

  let network = await platform.network()
  let obj = {
    'ssid': wifi.ssid
  }
  network.ForgetWiFi(obj, cb)
}

module.exports.getWifiScan = getWifiScan
module.exports.addWifi = addWifi
module.exports.forgetWifi = forgetWifi
module.exports.getKnownWifiNetworks = getKnownWifiNetworks
