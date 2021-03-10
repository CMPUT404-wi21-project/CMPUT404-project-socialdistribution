import {
    GET_COMMENTS,
    GET_COMMENTS_FAIL,
    GET_COMMENTS_SUCCESS,
    CREATE_COMMENT,
    CREATE_COMMENT_SUCCESS,
    CREATE_COMMENT_FAIL,
    CLEAR_COMMENTS,
} from '../actions/types';


const initialState = {
    isCommentsLoading: false,
    isCreateLoading: false,
    Comments: [],
    page: 1,
    hasMore: false,
}

export default function(state=initialState, action) {
    switch(action.type) {
        case CREATE_COMMENT:
            return {
                ...state,
                isCreateLoading: true,
            }
        case CREATE_COMMENT_SUCCESS:
            return {
                ...state,
                isCreateLoading: false,
                Comments: [action.payload].concat(state.Comments),
            }
        case CREATE_COMMENT_FAIL:
            return {
                ...state,
                isCreateLoading: false,
            }
        case GET_COMMENTS:
            return {
                ...state,
                isCommentsLoading: true,
            }
        case GET_COMMENTS_SUCCESS:
            return {
                ...state,
                isCommentsLoading: false,
                Comments: state.Comments.concat(action.payload),
                hasMore: action.nextPage,
                page: (action.nextPage)? state.page+1: state.page,
            }
        case GET_COMMENTS_FAIL:
            return {
                ...state,
                hasMore: false,
                isCommentsLoading: false,
            }
        case CLEAR_COMMENTS:
            return initialState;
        default:
            return state;
    }
}


