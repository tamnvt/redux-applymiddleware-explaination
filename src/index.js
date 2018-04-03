import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, createStore} from './lib/redux/src/index';
import {Provider} from 'react-redux';

import thunk from './shared/redux-middleware/thunk';
import logger from './shared/redux-middleware/logger';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
console.log('Go to src/lib/redux/src/applyMiddleware to see comments')

const store = createStore(
    (state, action) => {
        if (action.type === 'UPDATE') {
            return {...state, number: action.number}
        }

        return state
    },
    {number: 0},
    applyMiddleware(thunk, logger),
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'));
registerServiceWorker();
