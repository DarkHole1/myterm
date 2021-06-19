const User = require("./user");

module.exports = async function(req, res, next) {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

  const user = await User.findOne({ name: login, password: password });
  if (user) {
    req.user = user;
    return next()
  }

  res.set('WWW-Authenticate', 'Basic realm="My term"')
  res.status(401).send('Authentication required.')
}