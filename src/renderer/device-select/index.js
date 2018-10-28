import dgram from 'dgram'

import React from 'react'

const PORT = 20105
const MULTICAST_ADDR = '233.255.255.255'

// TODO: add spinner for "searching" state
class LumosDiscoveryBroadcast {
  constructor (callback) {
    this.callback = callback
  }

  start () {
    this.socket = dgram.createSocket({ type: 'udp4', reuseAddr: true })
    this.socket.on('listening', this.onListening.bind(this))
    this.socket.on('message', this.onMessage.bind(this))
    this.socket.bind(PORT)
    this.interval = setInterval(this.sendBroadcast.bind(this), 3000)
  }

  stop () {
    if (this.interval) {
      clearInterval(this.interval)
      delete this.interval
    }
    this.socket.close()
    delete this.socket
  }

  sendBroadcast () {
    const data = JSON.stringify({ source: 'lumos', type: 'discovery-search' })
    const message = Buffer.from(data)
    this.socket.send(message, 0, message.length, PORT, MULTICAST_ADDR)
  }

  onListening () {
    this.socket.addMembership(MULTICAST_ADDR)
  }

  onMessage (message, rinfo) {
    try {
      message = message.toString()
      const data = JSON.parse(message)
      if (data.source !== 'lumos' || data.type !== 'discovery-response') {
        return
      }

      this.callback(data)
    } catch (err) {
      // do nothing
    }
  }
}

export default class DeviceSelect extends React.Component {
  constructor () {
    super()
    this.broadcast = new LumosDiscoveryBroadcast(this.handleDeviceDetected.bind(this))
    this.state = {
      searching: false,
      devices: {}
    }
  }

  componentDidMount () {
    this.broadcast.start()
  }

  componentWillUnmount () {
    this.broadcast.stop()
  }

  render () {
    return (
      <div>
        <ul>
          {Object.keys(this.state.devices).map(this.renderDevice.bind(this))}
        </ul>
      </div>
    )
  }

  renderDevice (dev) {
    dev = this.state.devices[dev]
    return (
      <li key={dev.addr}>
        <a onClick={() => this.selectDevice(dev)}>
          {dev.addr} (Lumos version {dev.version})
        </a>
      </li>
    )
  }

  handleDeviceDetected (devInfo) {
    this.setState({
      devices: {
        [devInfo.addr]: devInfo
      }
    })
  }

  selectDevice (device) {
    this.props.onSelectDevice(device)
  }
}
