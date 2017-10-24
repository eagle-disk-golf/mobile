import {call, fork, put, takeLatest, apply, select} from 'redux-saga/effects';
import {delay} from 'redux-saga';

import {INCREMENT, DECREMENT, setCount} from './actions';
import {getCount} from './selectors';

function* handleDecrement() {
  try {
    const count = yield select(getCount);
    yield put(setCount(count - 1));
  } catch (er) {
    console.warn(er);
  }
}

function* watchDecrement() {
  yield takeLatest(DECREMENT, handleDecrement);
}

function* handleIncrement() {
  try {
    const count = yield select(getCount);
    yield put(setCount(count + 1));
  } catch (er) {
    console.warn(er);
  }
}

function* watchIncrement() {
  yield takeLatest(INCREMENT, handleIncrement);
}

export default function* watch() {
  console.log('tracking saga');
  yield fork(watchIncrement);
  yield fork(watchDecrement);
}
