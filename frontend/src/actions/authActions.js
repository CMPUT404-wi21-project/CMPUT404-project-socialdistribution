import axios from 'axios';

import {returnErrors} from './errorActions';

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
} from './types';

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({ type: USER_LOADING });
    
        // Fetch the user
    axios.get(process.env.REACT_APP_HOST +
        '/api/author/current/', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data,
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR,
            });
        });
}

// REGISTER
export const register = ({username, password, github_url, displayName}) => dispatch => {
    // Header
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    } 

    // Request body
    const body = JSON.stringify({username, password, github_url, displayName});

    axios.post(process.env.REACT_APP_HOST +
        '/author/register/', body, config)
        .then(res => dispatch({
            type: REGISTER_SUCCESS,
        }))
        .catch(err => {
            console.log(err);
            console.log({...err})
            if (err.response.data.username) {
                err.response.data = err.response.data.username;
            }
            dispatch(returnErrors(err.response.data, err.response.status, "REGISTER_FAIL"));
            dispatch({type: REGISTER_FAIL});
        });
}

// LOGIN
export const login = ({username, password}) => dispatch => {
    // Header
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    } 

    // Request body
    const body = JSON.stringify({username, password });
    axios.post(process.env.REACT_APP_HOST +
        '/author/login/', body, config)
        .then(res => dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
            })
        )
        .catch(err => {
            dispatch(returnErrors(err.response.data.detail, err.response.status, "LOGIN_FAIL"));
            dispatch({type: LOGIN_FAIL});
        });
}

// LOGOUT
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    };
}


// Set Up config/header and token
export const tokenConfig = getState => {
    // Get token from localstorage
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            "Content-type": "application/json",
        }
    };

    // If token, add to headers
    if (token) {
        config.headers['Authorization'] = "Bearer " + token;
    }

    return config;
}

