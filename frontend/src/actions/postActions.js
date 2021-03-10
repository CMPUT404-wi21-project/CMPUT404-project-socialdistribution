import axios from 'axios';

import {returnErrors} from './errorActions';
import {tokenConfig} from './authActions';

import {
GET_AUTHOR_POSTS,
GET_AUTHOR_POST_SUCCESS,
GET_AUTHOR_POST_FAIL,
CREATE_POST,
CREATE_POST_SUCCESS,
CREATE_POST_FAIL,
EDIT_POST,
EDIT_POST_SUCCESS,
EDIT_POST_FAIL,
DELETE_POST,
DELETE_POST_SUCCESS,
DELETE_POST_FAIL,
GET_POST,
GET_POST_SUCCESS,
GET_POST_FAIL,
CLEAR_ERRORS
} from './types';

// CREATE POST
export const createPost = (post) => (dispatch, getState) => {
    // State that we are creating a post
    dispatch({type: CREATE_POST})
    // Send request to create the post
    axios.post(process.env.REACT_APP_HOST + 
        `/author/${getState().auth.user.pk}/posts/`, post, tokenConfig(getState))
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

export const editPost = (post,id) => (dispatch, getState) => {
    // State that we are creating a post
    dispatch({type: EDIT_POST})
    // Send request to edit the post
    axios.post(process.env.REACT_APP_HOST + 
        `/author/${getState().auth.user.pk}/posts/${id}`, post, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: EDIT_POST_SUCCESS,
                // payload: res.data,
            });
        })
        .catch(err => {
            // Certain errors hold the data in the .data.detail so we are handling that here
            if (err.response.data.detail) {
                err.response.data = err.response.data.detail;
            }
            dispatch(returnErrors(err.response.data, err.response.status, "EDIT_POST_FAIL"));
            dispatch({type: EDIT_POST_FAIL});
        })
}

// GET POSTS by postID
export const getPostByPostId = (postID) => (dispatch, getState) => {
    dispatch({ type: GET_POST })
    axios.get(process.env.REACT_APP_HOST +
        `/author/${getState().auth.user.pk}/posts/${postID}`, tokenConfig(getState))
        .then(res => dispatch({
            type: GET_POST_SUCCESS,
            payload: res.data,
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, "GET_POST_FAIL"));
            dispatch({
                type: GET_POST_FAIL,
            });
        })
}

// GET POSTS by authorID
export const getCurAuthorPosts = (pageNum, size) => (dispatch, getState) => {
    dispatch({ type: GET_AUTHOR_POSTS })
    axios.get(process.env.REACT_APP_HOST +
        `/author/${getState().auth.user.pk}/posts/?pageNum=${pageNum}&pageSize=${size}`, tokenConfig(getState))
        .then(res => dispatch({
            type: GET_AUTHOR_POST_SUCCESS,
            payload: res.data,
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, "GET_AUTHOR_POST_FAIL"));
            dispatch({
                type: GET_AUTHOR_POST_FAIL,
            });
        });
}

// GET STREAM POSTS by authorID
export const getAuthorStreamPosts = (pageNum, size) => (dispatch, getState) => {
    dispatch({ type: GET_AUTHOR_POSTS })
    axios.get(process.env.REACT_APP_HOST +
        `/author/${getState().auth.user.pk}/stream/?pageNum=${pageNum}&pageSize=${size}`, tokenConfig(getState))
        .then(res => dispatch({
            type: GET_AUTHOR_POST_SUCCESS,
            payload: res.data,
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, "GET_AUTHOR_POST_FAIL"));
            dispatch({
                type: GET_AUTHOR_POST_FAIL,
            });
        });
}

// DELETE POSTS by authorID and PostID
export const deletePost = (id) => (dispatch, getState) => {
    dispatch({ type: DELETE_POST })
    axios.delete(process.env.REACT_APP_HOST +
        `/author/${getState().auth.user.pk}/posts/${id}`, tokenConfig(getState))
        .then(res => dispatch({
            type: DELETE_POST_SUCCESS,
            // payload: res.data,
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, "DELETE_POST_FAIL"));
            dispatch({
                type: DELETE_POST_FAIL,
            });
        });
}