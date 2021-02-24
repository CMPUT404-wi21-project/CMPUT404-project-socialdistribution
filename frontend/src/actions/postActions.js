import axios from 'axios';

import {returnErrors} from './errorActions';
import {tokenConfig} from './authActions';

import {
CREATE_POST,
CREATE_POST_SUCCESS,
CREATE_POST_FAIL,
DELETE_POST,
DELETE_POST_SUCCESS,
DELETE_POST_FAIL,
GET_POST,
GET_POST_SUCCESS,
GET_POST_FAIL,
} from './types';

// CREATE POST
export const createPost = (post) => (dispatch, getState) => {
    // State that we are creating a post
    dispatch({type: CREATE_POST})
    // Send request to create the post
    axios
        .post(`/author/${getState().auth.user.pk}/posts/`, post, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: CREATE_POST_SUCCESS,
                payload: res.data,
            });
        })
        .catch(err => {
            // Certain errors hold the data in the .data.detail so we are handling that here
            if (err.response.data.detail) {
                err.response.data = err.response.data.detail;
            }
            dispatch(returnErrors(err.response.data, err.response.status, "CREATE_POST_FAIL"));
            dispatch({type: CREATE_POST_FAIL});
        })
        
}
