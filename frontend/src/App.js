import React from "react"
import './App.css';
import 'antd/dist/antd.css';

import {  Router} from 'react-router-dom';
import BaseRouter from './routes';

// State
import {Provider} from 'react-redux';
import store from './store';
import {loadUser} from './actions/authActions';

// Get hisotry
import {createBrowserHistory} from 'history';

const history = createBrowserHistory();

class App extends React.Component {
    constructor(props) {
         super();
    }

    componentDidMount() {
        // Attempt to load the user with a token from localstorage
        store.dispatch(loadUser());
    }

    /*Define Functions*/
    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <Router history={history}>
                       <BaseRouter/> 
                    </Router>
                </div>
            </Provider>
        );
    }
}



export default App;
