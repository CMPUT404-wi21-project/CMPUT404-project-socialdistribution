import {GET_ERRORS, GET_MULTI_ERRORS,CLEAR_ERRORS} from '../actions/types';

const initialState = {
    msgs: [],
    msg: {},
    status: null,
    id: null,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_ERRORS:
            return {
                msg: action.payload.msg,
                status: action.payload.status,
                id: action.payload.id,
            };
        case GET_MULTI_ERRORS:
            return {
                msgs: action.payload.msgs,
                status: action.payload.status,
                id: action.payload.id,
            };
        case CLEAR_ERRORS:
            return {
                msgs: [],
                msg: {},
                status: null,
                id: null,
            };
        default:
            return state;
    }
}
