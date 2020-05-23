import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from 'container/App';
import * as serviceWorker from 'utils/serviceWorker';

import { createStore } from 'redux';
import rootReducer from './redux/modules';
import { Provider } from 'react-redux';

const store = createStore(rootReducer);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

serviceWorker.unregister();
