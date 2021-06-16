module.exports = function(req, res, next) {
  const auth = {login: 'root', password: 'toor'} // change this

  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

  if (login && password && login === auth.login && password === auth.password) {
    return next()
  }

  res.set('WWW-Authenticate', 'Basic realm="My term"')
  res.status(401).send('Authentication required.')
}