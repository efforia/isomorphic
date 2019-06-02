import authService from '../services/auth'
import config from './index'

import Onboarding from '../pages/Onboarding'
import HomeContainer from '../components/HomeContainer'
import redirect from '../services/redirect'
import AddEntry from '../pages/AddEntry'
import AddHighEntry from '../pages/AddHighEntry'
import AddLowEntry from '../pages/AddLowEntry'
import AddMidEntry from '../pages/AddMidEntry'
import DefineEntryMood from '../pages/DefineEntryMood/DefineEntryMood';

const checkAuth = (to, from, resolve, reject) => {
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
    path: '/home',
    name: 'Home',
    component: HomeContainer,
    beforeEnter: config.enableRouteGuards ? checkAuth : null
  },
  {
    path: '/add-mood',
    name: 'AddEntry',
    component: AddEntry,
    beforeEnter: config.enableRouteGuards ? checkAuth : null
  },
  {
    path: '/add-mid-mood',
    name: 'AddMidEntry',
    component: AddMidEntry,
    beforeEnter: config.enableRouteGuards ? checkAuth : null
  },
  {
    path: '/add-high-mood',
    name: 'AddHighEntry',
    component: AddHighEntry,
    beforeEnter: config.enableRouteGuards ? checkAuth : null
  },
  {
    path: '/add-low-mood',
    name: 'AddLowEntry',
    component: AddLowEntry,
    beforeEnter: config.enableRouteGuards ? checkAuth : null
  },
  {
    path: '/save-mood',
    name: 'DefineEntryMood',
    component: DefineEntryMood,
    beforeEnter: config.enableRouteGuards ? checkAuth : null
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
