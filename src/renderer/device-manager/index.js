import React from 'react'

export default class DeviceManager extends React.Component {
  constructor () {
    super()
    this.state = {
      deviceInfo: null
    }
  }

  componentDidMount () {
    //
  }

  render () {
    return (
      <div>
        <div className='sidebar'>
          <div className='slideshow-preview' />
          <div className='device-info' />
          <div className='save-changes-prompt' />
        </div>
        <div className='photo-manager' />
      </div>
    )
  }
}
