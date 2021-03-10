import {
    GET_POST,
    GET_POST_SUCCESS,
    GET_POST_FAIL,
    CREATE_POST, 
    DELETE_POST, 
    DELETE_POST_SUCCESS,
    DELETE_POST_FAIL,
    CREATE_POST_FAIL,
    CREATE_POST_SUCCESS,
    EDIT_POST,
    EDIT_POST_SUCCESS,
    EDIT_POST_FAIL,
    GET_AUTHOR_POSTS,
    GET_AUTHOR_POST_SUCCESS,
    GET_AUTHOR_POST_FAIL,
    GET_STREAM_POSTS,
    GET_STREAM_POSTS_SUCCESS,
    GET_STREAM_POSTS_FAIL,
    LOGOUT_SUCCESS,
} from '../actions/types';

// NOTE: This state is very temporary, whoever expands on posts should feel free to change it
const initialState = {
    cachedPosts: {},
    posts: {},
    post: null,
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
        case EDIT_POST:
            return {
                ...state,
                isLoading: true,
                createError: false,
                deleteError: false,
                editError: false,
                getError: false,
            };
        case EDIT_POST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                createError: false,
                deleteError: false,
                editError: false,
                getError: false,
                postsCreated: true,
            }
        case EDIT_POST_FAIL:
            return {
                ...state,
                isLoading: false,
                createError: true,
                deleteError: false,
                editError: false,
                getError: false,
            }
        case GET_POST_SUCCESS:{
            return{
                ...state,
                post: action.payload,
                isLoading: false,
                createError: false,
                deleteError: false,
                editError: false,
                getError: false,
                postsCreated: false,
            }
        }
        case GET_POST:{
            return{
                ...state,
                isLoading: true,
            }
        }
        case GET_POST_FAIL:{
            return{
                ...state,
                getError: true,
            }
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

        case GET_AUTHOR_POST_FAIL:{
            return{
                ...state,
                getError: true,
            }
        }
        case GET_STREAM_POSTS:{
            return{
                ...state,
                isLoading: true,
            }
        }
        case GET_STREAM_POSTS_SUCCESS:{
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
        case GET_STREAM_POSTS_FAIL:{
            return{
                ...state,
                getError: true,
            }
        }
        case DELETE_POST:{
            return{
                ...state,
                deleteError: false,
            }
        }
        case DELETE_POST_SUCCESS:{
            return{
                ...state,
                postsCreated: true,
            }
        }
        case DELETE_POST_FAIL:{
            return{
                ...state,
                deleteError: true,
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
