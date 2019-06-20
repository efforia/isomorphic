import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import AppContainer from './components/app/App';
import { registerIonic } from '@ionic/react';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers'

const store = createStore(rootReducer);

// registerIonic();
ReactDOM.render(<Provider store={store}><AppContainer /></Provider>, document.getElementById('root'));
registerServiceWorker();
