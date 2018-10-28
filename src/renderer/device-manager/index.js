import React, { useEffect, useState } from 'react'

import makeCancellable from '../../lib/make-cancellable'
import { getServerInfo } from '../../lib/server'

export default function DeviceManager ({ device }) {
  const [deviceInfo, setDeviceInfo] = useState(null)

  useEffect(() => {
    setDeviceInfo(null)
    const [cancel, onDeviceInfo] = makeCancellable((_err, info) => setDeviceInfo(info))
    getServerInfo(device.addr, onDeviceInfo)

    return cancel
  }, [device.addr])

  if (!deviceInfo) {
    return <div>Fetching info...</div>
  }

  return (
    <div>
      <div className='sidebar'>
        <div className='slideshow-preview' />
        <div className='device-info'>
          <h2>{deviceInfo.name}</h2>
          Slide delay: {deviceInfo.slideTime}
        </div>
        <div className='save-changes-prompt' />
      </div>
      <div className='photo-manager' />
    </div>
  )
}
