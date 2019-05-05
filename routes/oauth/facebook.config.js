const passport = require('passport')
const FacebookTokenStrategy = require('passport-facebook-token')

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    },
    function(accessToken, refreshToken, profile, next) {
      let user = profile._json
      return next(null, user)
    }
  )
)
