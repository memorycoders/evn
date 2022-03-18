import React from 'react';
import ReactDOM from 'react-dom';
import {store} from './middleware.js'
import { Provider } from "react-redux";
import App from './App.js'
import { interceptor } from './apis/http'
interceptor(store);
const Root = () => (
    <Provider store={store}>
        <App/>
    </Provider>
);

ReactDOM.render(<Root />, document.getElementById('root'));