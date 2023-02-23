import { debug } from 'debug';
import Credentials from './credentials';
import { UserModel } from "./models/user";
const log = debug('app:auth');

export default async function(req: any, res: any, next: any) {
  // const creds = Credentials.fromBasicAuth(req.headers.authorization)
  const creds = Credentials.fromCookies(req.cookies);
  const user = await UserModel.findByCredentials(creds);
  if(!user) {
    res.status(401).send('Authentication required.')
    return
  }
  req.user = user;
  return next()
  // res.set('WWW-Authenticate', 'Basic realm="My term"')
}