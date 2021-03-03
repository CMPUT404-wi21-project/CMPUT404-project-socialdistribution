import {
    GET_POSTS, 
    CREATE_POST, 
    DELETE_POST, 
    CREATE_POST_FAIL,
    CREATE_POST_SUCCESS,
    GET_AUTHOR_POSTS,
    GET_AUTHOR_POST_SUCCESS,
    GET_AUTHOR_POST_FAIL,
    LOGOUT_SUCCESS,
} from '../actions/types';

// NOTE: This state is very temporary, whoever expands on posts should feel free to change it
const initialState = {
    cachedPosts: {},
    posts: {},
    isLoading: true,
    createError: false,
    editError: false,
    deleteError: false,
    getError: false,
    postsCreated: false,
}


export default function(state = initialState, action) {
    switch(action.type) {
        case CREATE_POST:
            return {
                ...state,
                isLoading: true,
                createError: false,
                deleteError: false,
                editError: false,
                getError: false,
            };
        case CREATE_POST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                createError: false,
                deleteError: false,
                editError: false,
                getError: false,
                postsCreated: true,
            }
        case CREATE_POST_FAIL:
            return {
                ...state,
                isLoading: false,
                createError: true,
                deleteError: false,
                editError: false,
                getError: false,

            }
        case GET_AUTHOR_POST_SUCCESS:{
            return{
                ...state,
                posts: action.payload,
                isLoading: false,
                createError: false,
                deleteError: false,
                editError: false,
                getError: false,
                postsCreated: false,
            }
        }
        case GET_AUTHOR_POSTS:{
            return{
                ...state,
                isLoading: true,
            }
        }
        case LOGOUT_SUCCESS:{
            localStorage.clear();
            return{
                cachedPosts: {},
                posts: {},
                isLoading: false,
                createError: false,
                editError: false,
                deleteError: false,
                getError: false,
            }
        }
        default:
            return state;
    }
}
