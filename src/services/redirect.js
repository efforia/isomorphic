import authService from './auth'

const getRootPage = () => {
  if (!authService.isLoggedIn()) return 'Onboarding'
  return 'UserHome'
}

export default { getRootPage }
