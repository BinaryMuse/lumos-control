const PORT = 20105
const MULTICAST_ADDR = '233.255.255.255'

const dgram = require('dgram')

const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true })
socket.bind(PORT)

socket.on('listening', () => {
  socket.addMembership(MULTICAST_ADDR)
  setInterval(sendMessage, 3000)
})

socket.on('message', (message, rinfo) => {
  try {
    message = message.toString()
    const data = JSON.parse(message)
    if (data.source !== 'lumos' || data.type !== 'discovery-response') {
      return
    }

    console.log('Got response', data)
  } catch (err) {
    // do nothing
  }
})

function sendMessage () {
  const messageStr = JSON.stringify({ source: 'lumos', type: 'discovery-search' })
  const message = Buffer.from(messageStr)
  socket.send(message, 0, message.length, PORT, MULTICAST_ADDR, () => {
    console.info(`Sending: ${message}`)
  })
}
