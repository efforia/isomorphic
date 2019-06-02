import authService from '../services/auth'
import redirect from '../services/redirect'

import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Onboarding from '../pages/Onboarding'
import SelectRole from '../pages/SelectRole'
import CreateUser from '../pages/CreateUser'
import CreateDriver from '../pages/CreateDriver'
import CreateRide from '../pages/CreateRide'
import SetRideItems from '../pages/SetRideItems'
import SetRideDestination from '../pages/SetRideDestination'
import HomeContainer from '../components/HomeContainer'
import config from '.'

const checkAuth = (to, from, resolve) => {
  if (authService.isLoggedIn()) {
    resolve()
  } else {
    window.location.pathname = '/login'
  }
}

const routes = [
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeContainer,
    beforeEnter: config.enableRouteGuards ? [checkAuth] : []
  },
  {
    path: '/landing',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/setup-user',
    name: 'SelectRole',
    component: SelectRole
  },
  {
    path: '/driver-signup',
    name: 'CreateDriver',
    component: CreateDriver
  },
  {
    path: '/user-signup',
    name: 'CreateUser',
    component: CreateUser
  },
  {
    path: '/create-ride',
    name: 'CreateRide',
    component: CreateRide
  },
  {
    path: '/ride-items',
    name: 'SetRideItems',
    component: SetRideItems
  },
  {
    path: '/ride-destination',
    name: 'SetRideDestination',
    component: SetRideDestination
  }
]

const rootPageName = redirect.getRootPage()
const rootPage = routes.filter(page => page.name === rootPageName)[0]
routes.push(
  /* Root page */
  {
    path: '/',
    name: 'Main',
    component: rootPage.component
  }
)

export default routes
