import {
    PROFILE_LOADING,
    PROFILE_LOAD_SUCCESS,
    PROFILE_LOAD_FAIL,
    PROFILE_SAVING,
    PROFILE_SAVE_SUCCESS,
    PROFILE_SAVE_FAIL,
    LOGOUT_SUCCESS,
} from '../actions/types';

const initialState = {
    profile: {},
    loadFailed: false,
    saveFailed: false,
    updateFoo: false,
};

export default function(state=initialState, action) {
    switch(action.type) {
        case PROFILE_LOADING:
            return {
                ...state,
                loadFailed: false,
            };
        case PROFILE_LOAD_SUCCESS:
            return {
                ...state,
                profile: action.payload,
            };
        case PROFILE_LOAD_FAIL:
            return {
                ...state,
                msg: 'Fail to load profile',
                loadFailed: true,
            };
        case PROFILE_SAVING:
            return {
                ...state,
                saveFailed: false,
            };
        case PROFILE_SAVE_SUCCESS:
            return {
                ...state,
                updateFoo: true,
            };
        case PROFILE_SAVE_FAIL:
            return {
                ...state,
                msg: 'Fail to save profile',
                saveFailed: true,
            };
        case LOGOUT_SUCCESS:
            localStorage.clear();
            return {
                profile: {},
                loadFailed: false,
                saveFailed: false,
                updateFoo: false,
            };
        default:
            return state;
    }  
}
