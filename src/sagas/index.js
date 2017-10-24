import {fork, all} from 'redux-saga/effects';

import tracking from '../modules/tracking/saga';

export default function* root() {
  console.log('root saga');
  yield all ([
    fork(tracking)
  ]);
}
