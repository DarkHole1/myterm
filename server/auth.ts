import Credentials from './credentials';
import User from "./user";

export default async function(req: any, res: any, next: any) {
  const creds = Credentials.fromBasicAuth(res.headers.auth)
  const user = await User.findByCredentials(creds);
  if (user) {
    req.user = user;
    return next()
  }

  res.set('WWW-Authenticate', 'Basic realm="My term"')
  res.status(401).send('Authentication required.')
}