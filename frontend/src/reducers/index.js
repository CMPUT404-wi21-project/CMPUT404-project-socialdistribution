import {combineReducers} from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import postReducer from './postReducer';
import profileReducer from './profileReducer';
import pageReducer from './pageReducer';

export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    post: postReducer,
    profile: profileReducer,
    page: pageReducer,
});
