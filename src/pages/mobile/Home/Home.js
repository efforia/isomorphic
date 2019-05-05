/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User information page.
 */

import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Page } from 'framework7-react'

import logo from '../../../assets/vectors/logo.svg'
import bell from '../../../assets/vectors/bell-icon.svg'

import Navbar from '../../../components/Navbar'
import BuyCreditsButton from '../../../components/BuyCreditsButton'
import MasterToggle from '../../../components/MasterToggle'
import HardwareIndicator from '../../../components/HardwareIndicator'
import UtilizationCard from '../../../components/UtilizationCard'
import AvailableCreditsCard from '../../../components/AvailableCreditsCard'

import {
  checkBluetoothState,
  checkGpsState,
  watchBluetoothStateChanges,
  watchGpsStateChanges
} from '../../../actions/hardware'

import './Home.scss'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {}

  componentDidMount() {}

  initHardwareIndicators() {
    this.props.checkBluetoothState()
    this.props.watchBluetoothStateChanges()
    this.props.checkGpsState()
    this.props.watchGpsStateChanges()
  }

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const { device, bluetooth, gps } = this.props
    const pageTitle = 'Frete Fácil: Home'
    return (
      <Page className="home-page">
        <Helmet title={pageTitle} />
        <Navbar className="home-page__navbar">
          <div className="app-navbar__left">
            <img src={logo} alt="Instant" />
          </div>
          <div className="app-navbar__center">
            <BuyCreditsButton />
          </div>
          <div className="app-navbar__right">
            <img src={bell} alt="Notificações" />
          </div>
        </Navbar>
        <div className="home-page__content">
          <div className="home-page__toggle-container">
            <MasterToggle isActive={false} />
          </div>
          <div className="home-page__indicators-container">
            <HardwareIndicator label="Bluetooth" active={bluetooth && bluetooth.isEnabled} />
            <HardwareIndicator label="GPS" active={gps && gps.isEnabled} />
            <HardwareIndicator label="Device" active={device && device.id} tive />
          </div>
          <div className="home-page__cards-container">
            <AvailableCreditsCard value="13" />
            <UtilizationCard value="17" />
          </div>
        </div>
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  device: state.device.connected,
  bluetooth: state.hardware.bluetooth,
  gps: state.hardware.gps
})

const mapDispatchToProps = dispatch => ({
  checkBluetoothState: dispatch(checkBluetoothState()),
  watchBluetoothStateChanges: dispatch(watchBluetoothStateChanges()),
  checkGpsState: dispatch(checkGpsState()),
  watchGpsStateChanges: dispatch(watchGpsStateChanges())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)