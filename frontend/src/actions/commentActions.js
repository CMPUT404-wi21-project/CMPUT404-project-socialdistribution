import axios from 'axios';

import {returnErrors} from './errorActions';
import {tokenConfig} from './authActions';

import {
    GET_COMMENTS,
    GET_COMMENTS_SUCCESS,
    GET_COMMENTS_FAIL,
    CREATE_COMMENT,
    CREATE_COMMENT_SUCCESS,
    CREATE_COMMENT_FAIL,
    GET_POST,
    GET_POST_SUCCESS,
    CREATE_POST_SUCCESS,
} from './types';


export const createComment = (post, {content, contentType}, callback) => (dispatch, getState) => {
    dispatch({type: CREATE_COMMENT});
    axios.post(`${post}/comments`, {content, contentType}, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: CREATE_POST_SUCCESS,
            })
            callback(res);
        })
        .catch(err => {
            if (err.response.data.detail) {
                err.response.data = err.response.data.detail;
            }
            dispatch(returnErrors(err.response.data, err.response.status, 'CREATE_COMMENT_FAIL'));
            dispatch({type: CREATE_COMMENT_FAIL});
        })
}


export const getComments = (post, page, callback) => (dispatch, getState) => {
    // Make a post request to get the comments for the given post
    dispatch({type: GET_COMMENTS});
    axios.get(`${post}/comments?pageNum=${page}`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_POST_SUCCESS,
            });
            callback(res);
        })
        .catch(err => {
            if (err.response.data.detail) {
                err.response.data = err.response.data.detail;
            }
            dispatch(returnErrors(err.response.data, err.response.status, 'GET_COMMENTS_FAIL'));
            dispatch({type: GET_COMMENTS_FAIL});
        })
}
