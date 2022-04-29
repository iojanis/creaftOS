/* eslint-disable no-console */
import passport from 'passport'
import { Schema } from 'bodymen'
import { BasicStrategy } from 'passport-http'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { jwtSecret, masterKey } from '../../config'
import User, { schema } from '../../api/user/model'

export const password = () => (req, res, next) =>
  passport.authenticate('password', { session: false }, (err, user, info) => {
    if (err && err.param) {
      return res.status(400).json(err)
    } else if (err || !user) {
      return res.status(401).end()
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) { return res.status(401).end() }
      next()
    })
  })(req, res, next)

export const master = () => passport.authenticate('master', { session: false })

export const token = ({ required, roles = User.roles } = {}) => (
  req,
  res,
  next
) =>
  passport.authenticate('token', { session: false }, (err, user, info) => {
    if (
      err ||
      (required && !user) ||
      (required && !~roles.indexOf(user.role))
    ) {
      return res.status(401).end()
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) { return res.status(401).end() }
      next()
    })
  })(req, res, next)

export const local = () => (req, res, next) =>
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err && err.param) {
      return res.status(400).json(err)
    } else if (err || !user) {
      return res.status(401).end()
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) { return res.status(401).end() }
      next()
    })
  })(req, res, next)

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    (username, password, done) => {
      const userSchema = new Schema({
        username: schema.tree.username,
        password: schema.tree.password
      })
      userSchema.validate({ username, password }, (err) => {
        if (err) { done(err) }
      })

      User.findOne({ username }).then((user) => {
        if (!user) {
          done(true)
          return null
        }
        return user
          .authenticate(password, user.password)
          .then((user) => {
            done(null, user)
            return null
          })
          .catch(done)
      })
    }
  )
)

passport.use(
  'password',
  new BasicStrategy((username, password, done) => {
    const userSchema = new Schema({
      username: schema.tree.username,
      password: schema.tree.password
    })

    userSchema.validate({ username, password }, (err) => {
      if (err) { done(err) }
    })

    User.findOne({ username }).then((user) => {
      if (!user) {
        done(true)
        return null
      }
      return user
        .authenticate(password, user.password)
        .then((user) => {
          done(null, user)
          return null
        })
        .catch(done)
    })
  })
)

passport.use(
  'master',
  new BearerStrategy((token, done) => {
    if (token === masterKey) {
      done(null, {})
    } else {
      done(null, false)
    }
  })
)

passport.use(
  'token',
  new JwtStrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        ExtractJwt.fromAuthHeaderWithScheme('Bearer')
      ])
    },
    ({ id }, done) => {
      User.findById(id)
        .then((user) => {
          done(null, user)
          return null
        })
        .catch(done)
    }
  )
)
