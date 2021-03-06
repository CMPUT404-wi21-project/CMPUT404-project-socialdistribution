import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: null,
    isRegistered: null,
};


export default function(state=initialState, action) {
    switch(action.type) {
        case USER_LOADING:
            // Get user from backend
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED: // Should run basically every request to see if we are logged in or not
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
            };
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                isRegistered: true,
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
            localStorage.clear();
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isRegistered: false,
            };
        default:
            return state;
    }
}
