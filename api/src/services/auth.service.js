import jwt from 'jsonwebtoken'
import compose from 'composable-middleware'
import randomstring from 'just.randomstring'
import User from '../routes/user/user.model'
import SubscriptionCtrl from '../routes/payment/subscription-ref/subscription-ref.controller'

const auth = {
  hasValidToken: () =>
    compose().use((req, res, next) => {
      let token = null

      if (req.query.accessToken) {
        token = req.query.accessToken
      }

      if (req.headers['x-access-token']) {
        token = req.headers['x-access-token']
      }
      if (token) {
        User.findOneWithDeleted(
          { _id: jwt.verify(token, process.env.MASTER_KEY)._id },
          async (error, user) => {
            if (error) {
              res.status(500).json(error)
            } else if (user) {
              req.user = user.toObject()
              if (user.payment && user.payment && user.payment.subscription) {
                req.user = await User.findOneAndUpdate(
                  { _id: user._id },
                  {
                    'payment.hasDelayedPayments': await SubscriptionCtrl.isOutOfDate(
                      user.payment.subscription.code
                    )
                  }
                ).lean()
                next()
              } else {
                next()
              }
            } else {
              res
                .status(401)
                .json(
                  'Whoops! It looks like this is not an valid token for this domain. Have you been switching between environments lately? :('
                )
            }
          }
        )
      } else {
        res.status(401).json({
          error: 'Whoops! An access token is required for this route!'
        })
      }
    }),

  isAuthenticated: () => compose().use(auth.hasValidToken()),

  isDriver: () =>
    auth.hasValidToken().use((req, res, next) => {
      if (req.user.roles.indexOf('MERCHANT') > -1) next()
      else
        res.status(403).json({
          error: `AREA 51! DO NOT TRESPASS. (a.k.a.: You don't have enought permissions for that.)`
        })
    }),

  isAdmin: () =>
    auth.hasValidToken().use((req, res, next) => {
      if (req.user.roles.indexOf('ADMIN') > -1) next()
      else
        res.status(403).json({
          error: `AREA 51! DO NOT TRESPASS. (a.k.a.: You don't have enought permissions for that.)`
        })
    }),

  passwordIsValid: () =>
    compose().use((req, res, next) => {
      const email = req.user ? req.user.email : req.body.email
      const { password } = req.body
      User.findOneWithDeleted({ email }, async (error, user) => {
        if (error) return res.status(500).send(error)

        if (!user) return res.status(401).send('Whoops! Check your credentials and try again!')

        if (!user.passwordIsValid(password))
          return res.status(401).send('Whoops! Check your credentials and try again!')

        if (user.deleted)
          return res.status(403).send('Whoops! It looks like this account has been suspended.')
        next()
      })
    }),

  paymentIsUpToDate: () =>
    compose().use(() => {
      console.log('Been here!')
    }),

  generatePassword: callback => {
    const randomNewPassword = randomstring(6)
    callback(randomNewPassword.toUpperCase())
  },

  generateEmailConfirmation: callback => {
    const randomness = randomstring(16)
    callback(randomness)
  }
}
export default auth
