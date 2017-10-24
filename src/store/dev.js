import {compose, applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';


// development middleware
const sagaMiddleware = createSagaMiddleware();
const middleware = applyMiddleware(
  sagaMiddleware,
);


const composeEnhancers =
typeof window === 'object' &&
window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
  }) : compose;

// const enhancer = composeEnhancers(
// // applyMiddleware(...middleware),
// applyMiddleware(sagaMiddleware)
// // other store enhancers if any
// );

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();


// compose all enhancers
const enhancer = devTools ? compose(middleware, devTools) : compose(middleware);


export default function configureStore(initialState) {
  // const store = createStore(rootReducer, initialState, enhancer);
  const store = createStore(rootReducer, initialState, enhancer);
  store.runSaga = sagaMiddleware.run;

  return store;
}
