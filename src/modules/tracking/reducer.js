import {pipe, omit} from 'ramda';
import initialState from './initial-state';
import {set, over} from '../../helpers/lens';
import {INCREMENT, DECREMENT, SET_COUNT} from './actions';


export default function tracking(state = initialState, {payload, type}) {
  switch (type) {
    // case INCREMENT: return set('count', 0, state);

    // case DECREMENT: return set('count', 0, state);

    case SET_COUNT: return set('count',  payload, state);

  }
  return state; 
}