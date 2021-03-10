import axios from 'axios';

import {returnErrors} from './errorActions';
import {tokenConfig} from './authActions';

import {
    GET_COMMENTS,
    GET_COMMENTS_FAIL,
    GET_COMMENTS_SUCCESS,
    CREATE_COMMENT,
    CREATE_COMMENT_SUCCESS,
    CREATE_COMMENT_FAIL,
    CLEAR_COMMENTS,
} from './types';


// Write a method to create a comment for a givn post
export const createComment = (post_url, {content, contentType}) => (dispatch, getState) => {
    dispatch({type: CREATE_COMMENT});
    axios.post(`${post_url}/comments`, {content, contentType}, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: CREATE_COMMENT_SUCCESS,
                payload: res.data,
            })
        })
        .catch((err) => {
            if (err.response.data.detail) {
                err.response.data = err.response.data.detail;
            }
            dispatch(returnErrors(err.response.data, err.response.status, 'CREATE_COMMENT_FAIL'));
            dispatch({type: CREATE_COMMENT_FAIL});
        })
}

export const getComments = (post_url, page) => (dispatch, getState) => {
    // Make a post request to get the comments for the given post
    dispatch({type: GET_COMMENTS});
    axios.get(`${post_url}/comments?page=${page}`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_COMMENTS_SUCCESS,
                payload: res.data.comments,
                nextPage: !!res.data.next,
            });
        })
        .catch(err => {
            if (err.response.data.detail) {
                err.response.data = err.response.data.detail;
            }
            dispatch(returnErrors(err.response.data, err.response.status, 'GET_COMMENTS_FAIL'));
            dispatch({type: GET_COMMENTS_FAIL});
        })
}

export const clearComments = () => {
    return {
        type: CLEAR_COMMENTS,
    };
}


