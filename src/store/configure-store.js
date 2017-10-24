import {env} from '../../env';

let store;

if (env.production) {
  store = require('./prod').default;
}
else {
  store = require('./dev').default;
}

module.exports = store({});
