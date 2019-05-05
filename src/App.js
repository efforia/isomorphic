/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User controller.
 */

import React from 'react'
import { connect } from 'react-redux'
import { F7App, View } from 'framework7-react'

// ---- Web pages
import Landing from './pages/web/Landing'
import AddUser from './pages/web/AddUser'
import SignupFeedback from './pages/web/SignupFeedback'

// ---- Mobile pages
import Login from './pages/mobile/Login'
import WaitingForDevice from './pages/mobile/WaitingForDevice'
import SynchronizeDevice from './pages/mobile/SynchronizeDevice'
import SelectDevice from './pages/mobile/SelectDevice'
import AddDevice from './pages/mobile/AddDevice'
import ConfirmUserInfo from './pages/mobile/ConfirmUserInfo'
import DriverLicenseCheck from './pages/mobile/DriverLicenseCheck'
import DriverLicenseIntro from './pages/mobile/DriverLicenseIntro'
import ConfirmVehicleInfo from './pages/mobile/ConfirmVehicleInfo'
import SynchronizationFeedback from './pages/mobile/SynchronizationFeedback'
import TabsContainer from './components/TabsContainer'
import RiskForm from './pages/mobile/RiskForm'
import NotFound from './pages/common/NotFound'

import authService from './services/auth'
import insuranceService from './services/insurance'

import {
  checkBluetoothState,
  checkGpsState,
  watchBluetoothStateChanges,
  watchGpsStateChanges
} from './actions/hardware'

const isMobile = window.cordova
const checkAuth = (to, from, resolve) => {
  if (authService.isLoggedIn()) {
    resolve()
  } else {
    window.location.pathname = '/login'
  }
}

const f7params = {
  name: 'Frete Fácil',
  id: 'com.argo.instant',
  routes: [
    // --- Mobile pages
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/wait',
      name: 'WaitingForDevice',
      component: WaitingForDevice
    },
    {
      path: '/device-sync',
      name: 'SynchronizeDevice',
      component: SynchronizeDevice
    },
    {
      path: '/device-select',
      name: 'SelectDevice',
      component: SelectDevice
    },
    {
      path: '/device-add',
      name: 'AddDevice',
      component: AddDevice
    },
    {
      path: '/user-confirm',
      name: 'ConfirmUserInfo',
      component: ConfirmUserInfo
    },
    {
      path: '/license-intro',
      name: 'DriverLicenseIntro',
      component: DriverLicenseIntro
    },
    {
      path: '/license-check',
      name: 'DriverLicenseCheck',
      component: DriverLicenseCheck
    },
    {
      path: '/feedback',
      name: 'SynchronizationFeedback',
      component: SynchronizationFeedback
    },
    {
      path: '/vehicle-confirm',
      name: 'ConfirmVehicleInfo',
      component: ConfirmVehicleInfo
    },
    {
      path: '/risk-form',
      name: 'RiskForm',
      component: RiskForm
    },
    {
      path: '/home',
      name: 'Home',
      beforeEnter: [checkAuth],
      component: TabsContainer
    },
    // --- Web pages
    {
      path: '/landing',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/signup',
      name: 'AddUser',
      component: AddUser
    },
    {
      path: '/welcome',
      name: 'SignupFeedback',
      component: SignupFeedback
    },
    {
      path: '(.*)',
      name: '404',
      component: NotFound
    }
  ]
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    if (isMobile) {
      document.addEventListener('deviceready', () => {
        this.onReadyState()
        this.initializeHardware()
        insuranceService.initialize()
      })
    } else {
      this.onReadyState()
    }
  }

  onReadyState() {
    const isRoot = window.location.pathname === '/'
    const isBrowser = process.env.REACT_APP_PLATFORM === 'browser'
    const { router } = this.$f7.views.main
    const isLoggedIn = authService.isLoggedIn()
    const mobileRouterRoot = isLoggedIn ? 'Home' : 'Login'
    const webRouterRoot = isLoggedIn ? 'Home' : 'Login'
    const rootPage = isBrowser ? webRouterRoot : mobileRouterRoot
    console.log(router)
    if (isRoot) {
      console.log(`Navigating to ${rootPage} page...`)
      router.navigate({ name: rootPage })
    }
  }

  initializeHardware() {
    try {
      this.props.checkBluetoothState()
      this.props.watchBluetoothStateChanges()
      this.props.checkGpsState()
      this.props.watchGpsStateChanges()
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <F7App params={f7params} colorTheme="orange">
        <View main pushState pushStateSeparator="" />
      </F7App>
    )
  }
}

const mapStateToProps = state => ({
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
)(App)
