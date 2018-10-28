import request from 'request'

const LUMOS_WEB_PORT = 20106

export function webServerForDevice (deviceAddr) {
  return `http://${deviceAddr}:${LUMOS_WEB_PORT}/_info`
}

export function getServerInfo (deviceAddr, callback) {
  const serverInfoUrl = webServerForDevice(deviceAddr)
  const options = {
    uri: serverInfoUrl,
    method: 'GET',
    json: true
  }

  request(options, function onRequest (err, _response, body) {
    err ? callback(err) : callback(null, body)
  })
}
