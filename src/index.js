import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/app/App';
import { registerIonic } from '@ionic/react';
import registerServiceWorker from './registerServiceWorker';

registerIonic();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
