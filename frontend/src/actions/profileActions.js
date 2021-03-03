import axios from 'axios';
import {returnErrors} from './errorActions';
import {tokenConfig} from './authActions';

import {
    PROFILE_LOADING,
    PROFILE_LOAD_SUCCESS,
    PROFILE_LOAD_FAIL,
    PROFILE_SAVING,
    PROFILE_SAVE_SUCCESS,
    PROFILE_SAVE_FAIL,
} from './types';

// GET profile by authorID
export const getMyProfile = () => (dispatch, getState) => {
    // State that we are getting from server
    dispatch({ type: PROFILE_LOADING })
    // Send request to get the profile
    axios.get(process.env.REACT_APP_HOST +
        `/author/${getState().auth.user.pk}/`, tokenConfig(getState))
        .then(res => dispatch({
            type: PROFILE_LOAD_SUCCESS,
            payload: res.data,
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, "PROFILE_LOAD_FAIL"));
            dispatch({
                type: PROFILE_LOAD_FAIL,
            });
        });
}

// Update author profile on server
export const saveMyProfile = (profile) => (dispatch, getState) => {
    // State that we are saving to server
    dispatch({type: PROFILE_SAVING})
    // Send request to save the profile
    axios.post(process.env.REACT_APP_HOST + 
        `/author/${getState().auth.user.pk}/`, profile, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: PROFILE_SAVE_SUCCESS,
                payload: res.data,
            });
        })
        .catch(err => {
            // Certain errors hold the data in the .data.detail so we are handling that here
            if (err.response.data.detail) {
                err.response.data = err.response.data.detail;
            }
            dispatch(returnErrors(err.response.data, err.response.status, "PROFILE_SAVE_FAIL"));
            dispatch({type: PROFILE_SAVE_FAIL});
        })
}


