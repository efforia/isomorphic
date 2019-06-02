import authService from './auth'

const getRootPage = () => {
  if (!authService.isLoggedIn()) return 'Onboarding'
  return 'CreateRide'
}

export default { getRootPage }
