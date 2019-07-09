import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import AppContainer from './components/app/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AppContainer />, document.getElementById('root'));
registerServiceWorker();
