import {GET_ERRORS, CLEAR_ERRORS, GET_MULTI_ERRORS} from './types';

// RETURN ERRORS
export const returnErrors = (msg, status, id=null) => {
    return {
        type: GET_ERRORS,
        payload: {msg, status, id}
    };
}

// RETURN ERRORS
export const returnMultiErrors = (msgs, status, id=null) => {
    return {
        type: GET_MULTI_ERRORS,
        payload: {msgs, status, id}
    };
}

// CLEAR ERRORS
export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS,
    }
}
