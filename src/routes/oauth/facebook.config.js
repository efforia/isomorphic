import passport from 'passport'
import FacebookTokenStrategy from 'passport-facebook-token'

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    },
    (accessToken, refreshToken, profile, next) => {
      const user = profile._json
      return next(null, user)
    }
  )
)
