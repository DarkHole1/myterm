import { debug } from 'debug';
import Credentials from './credentials';
import User from "./user";
const log = debug('app:auth');

export default async function(req: any, res: any, next: any) {
  // const creds = Credentials.fromBasicAuth(req.headers.authorization)
  const creds = Credentials.fromCookies(req.cookies);
  const user = await User.findByCredentials(creds);
  req.user = user;
  return next()
  // res.set('WWW-Authenticate', 'Basic realm="My term"')
  // res.status(401).send('Authentication required.')
}