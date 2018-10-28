import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Spring, Transition } from 'react-spring'

import FullScreen from './ui/full-screen'
import DeviceSelect from './device-select'
import DeviceManager from './device-manager'

function LoadingScreen ({ styles }) {
  return (
    <FullScreen style={{ ...styles, display: 'flex' }} key='loading'>
      <Spring config={{ delay: 500, tension: 100, friction: 50 }} from={{ opacity: 0 }} to={{ opacity: 1 }}>
        {innerStyles => (
          <div style={{ ...innerStyles, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'center' }}>L U M O S</h1>
          </div>
        )}
      </Spring>
    </FullScreen>
  )
}

function DeviceManagerScreen ({ device, styles }) {
  return (
    <FullScreen style={{ ...styles, display: 'flex' }} key='dev-manager'>
      <DeviceManager device={device} />
    </FullScreen>
  )
}

function DeviceSelectScreen ({ handleSelectDevice, styles }) {
  return (
    <FullScreen style={{ ...styles, display: 'flex' }} key='dev-select'>
      <DeviceSelect onSelectDevice={handleSelectDevice} />
    </FullScreen>
  )
}

function App () {
  const [loaded, setLoaded] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState(null)

  useEffect(() => {
    // 3 second splash screen
    setTimeout(() => setLoaded(true), 3000)
  }, [])

  let screen = null
  if (!loaded) {
    screen = <LoadingScreen />
  } else if (selectedDevice) {
    screen = <DeviceManagerScreen device={selectedDevice} />
  } else {
    screen = <DeviceSelectScreen handleSelectDevice={setSelectedDevice} />
  }

  return (
    <Transition
      items={[screen]}
      keys={item => item.type}
      from={{ opacity: 0 }}
      enter={{ opacity: 1 }}
      leave={{ opacity: 0 }}>
      {item => styles => React.cloneElement(item, { styles })}
    </Transition>
  )
}

const render = () => ReactDOM.render(<App />, document.getElementById('app'))
render()
