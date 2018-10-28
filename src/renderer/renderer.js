import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Transition } from 'react-spring'

import FullScreen from './ui/full-screen'
import DeviceSelect from './device-select'
import DeviceManager from './device-manager'

function useTimeout (fn, delay, deps = []) {
  useEffect(() => {
    const timeout = setTimeout(fn, delay)
    return () => clearTimeout(timeout)
  }, deps)
}

function LoadingScreen ({ styles }) {
  return (
    <FullScreen style={{ ...styles, justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ textAlign: 'center' }}>L U M O S</h1>
    </FullScreen>
  )
}

function DeviceManagerScreen ({ device, styles }) {
  return (
    <FullScreen style={styles}>
      <DeviceManager device={device} />
    </FullScreen>
  )
}

function DeviceSelectScreen ({ handleSelectDevice, styles }) {
  return (
    <FullScreen style={styles}>
      <DeviceSelect onSelectDevice={handleSelectDevice} />
    </FullScreen>
  )
}

function FadeThroughWhite ({ styles, children }) {
  const [timedOut, setTimedOut] = useState(false)

  useTimeout(() => setTimedOut(true), 500)

  let element = null
  if (timedOut) {
    element = React.Children.only(children)
  }

  return (
    <FullScreen style={{ ...styles, display: 'flex' }}>
      <Transition
        items={element}
        keys={item => item && item.key}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}>
        {item => styles => {
          return item && React.cloneElement(item, { styles })
        }}
      </Transition>
    </FullScreen>
  )
}

function App () {
  const [loaded, setLoaded] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState(null)

  useTimeout(() => setLoaded(true), 3000)

  let screen = null
  if (!loaded) {
    screen = <LoadingScreen key='loading' />
  } else if (selectedDevice) {
    screen = <DeviceManagerScreen device={selectedDevice} key='device-manager' />
  } else {
    screen = <DeviceSelectScreen handleSelectDevice={setSelectedDevice} key='device-select' />
  }

  return (
    <Transition
      items={[screen]}
      keys={item => item.key}
      from={{ opacity: 1 }}
      enter={{ opacity: 1 }}
      leave={{ opacity: 0 }}>
      {item => styles => <FadeThroughWhite key={item.key} styles={styles}>{item}</FadeThroughWhite>}
    </Transition>
  )
}

const render = () => ReactDOM.render(<App />, document.getElementById('app'))
render()
