import {combineReducers} from 'redux';
import {reducer as form} from 'redux-form';

import tracking from '../modules/tracking/reducer';

export default combineReducers({
  form,
  tracking
});
