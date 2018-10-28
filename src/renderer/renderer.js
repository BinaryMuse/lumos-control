import React from 'react'
import ReactDOM from 'react-dom'
import { Spring, Transition } from 'react-spring'

import FullScreen from './ui/full-screen'
import DeviceSelect from './device-select'
import DeviceManager from './device-manager'

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      loadTimer: false,
      selectedDevice: null
    }
  }

  async componentDidMount () {
    setTimeout(() => {
      this.setState({ loadTimer: true })
    }, 3000)
  }

  render () {
    const loaded = this.state.loadTimer

    return (
      <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
        {(loaded ? styles => this.renderApp(styles) : styles => this.renderLoading(styles))}
      </Transition>
    )
  }

  renderLoading (styles) {
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

  renderApp (styles) {
    const dev = this.state.selectedDevice
    return (
      <Transition from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
        {(dev ? styles => this.renderDeviceManager(styles) : styles => this.renderDeviceSelect(styles))}
      </Transition>
    )
  }

  renderDeviceSelect (styles) {
    return (
      <FullScreen style={{ ...styles, display: 'flex' }} key='dev-select'>
        <DeviceSelect onSelectDevice={this.handleSelectDevice.bind(this)} />
      </FullScreen>
    )
  }

  renderDeviceManager (styles) {
    return (
      <FullScreen style={{ ...styles, display: 'flex' }} key='dev-manager'>
        <DeviceManager device={this.state.selectedDevice} />
      </FullScreen>
    )
  }

  handleSelectDevice (device) {
    console.log('Selected device', device)
    this.setState({ selectedDevice: device })
  }
}

const render = () => ReactDOM.render(<App />, document.getElementById('app'))
render()
