import dgram from 'dgram'

import React, { useEffect, useState } from 'react'

const PORT = 20105
const MULTICAST_ADDR = '233.255.255.255'

// TODO: add spinner for "searching" state
function discoveryBroadcast (addr, port, callback) {
  let socket = dgram.createSocket({ type: 'udp4', reuseAddr: true })

  function onListening () {
    socket.addMembership(MULTICAST_ADDR)
  }

  function onMessage (message, rinfo) {
    try {
      message = message.toString()
      const data = JSON.parse(message)
      if (data.source !== 'lumos' || data.type !== 'discovery-response') {
        return
      }

      callback(data)
    } catch (err) {
      // do nothing
    }
  }

  function sendBroadcast () {
    const data = JSON.stringify({ source: 'lumos', type: 'discovery-search' })
    const message = Buffer.from(data)
    socket.send(message, 0, message.length, port, addr)
  }

  socket.on('message', onMessage)
  socket.bind(port, onListening)

  let interval = setInterval(sendBroadcast, 3000)

  return function unsubscribe () {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    if (socket) {
      socket.off('message', onMessage)
      socket.close()
      socket = null
    }
  }
}

export default function DeviceSelect ({ onSelectDevice }) {
  const [devices, setDevices] = useState({})

  function onDeviceDetected (device) {
    setDevices(devices => ({ ...devices, [device.addr]: device }))
  }

  useEffect(function subscribeToDiscoveryBroadcast () {
    const unsubscribe = discoveryBroadcast(MULTICAST_ADDR, PORT, onDeviceDetected)
    return () => unsubscribe()
  }, [])

  return (
    <div>
      <h2>Searching for devices...</h2>
      <ul>
        {Object.keys(devices).map((deviceAddr) => {
          const device = devices[deviceAddr]
          const onClick = (e) => {
            e.preventDefault()
            onSelectDevice(device)
          }
          return (
            <li key={device.addr}>
              <a href='#' onClick={onClick}>
                {device.addr} (Lumos version {device.version})
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
