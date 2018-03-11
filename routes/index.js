import loginHandler from './handlers/loginHandler';
import logoutHandler from './handlers/logoutHandler';

import Home from './home';
import Admin from './admin';

import APITest from './api/test';

const Login = {
  method: ['GET', 'POST'],
  path: '/login',
  options: {
    handler: loginHandler,
    auth: { mode: 'try' },
    plugins: { 'hapi-auth-cookie': { redirectTo: false } }
  }
};

const Logout = {
  method: ['GET', 'POST'],
  path: '/logout',
  options: {
    handler: logoutHandler
  }
};

const Public = {
  method: 'GET',
  path: '/public/{path*}',
  options: {
    auth: false,
    handler: {
      directory: {
        path: './public',
        listing: false,
        index: false
      }
    }
  }
};

const Routes = [].concat(
    Public,
    Login,
    Logout,
    Home,
    Admin,
    APITest
);

export default Routes;
