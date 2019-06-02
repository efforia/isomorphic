import authService from './auth'

const getRootPage = () => {
  if (!authService.isLoggedIn()) return 'Onboarding'
  return 'Home'
}

export default { getRootPage }
