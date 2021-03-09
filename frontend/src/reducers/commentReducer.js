import {
    GET_COMMENTS,
    GET_COMMENTS_SUCCESS,
    GET_COMMENTS_FAIL,
    CREATE_COMMENT,
    CREATE_COMMENT_SUCCESS,
    CREATE_COMMENT_FAIL,
} from '../actions/types';


const initialState = {
}

export default function(state=initialState, action) {
    switch(action.type) {
        case GET_COMMENTS:
        case GET_COMMENTS_SUCCESS:
        case GET_COMMENTS_FAIL:
        case CREATE_COMMENT:
        case CREATE_COMMENT_SUCCESS:
        case CREATE_COMMENT_FAIL:
        default:
            return state;
    }
}

