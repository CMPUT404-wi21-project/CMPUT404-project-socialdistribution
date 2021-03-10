import {CHANGE_PAGE, LOGOUT_SUCCESS} from '../actions/types';

const initialState = {
    activeKey : "0",
}


export default function(state=initialState, action) {
    switch(action.type) {
        case CHANGE_PAGE:
            return {
                ...state,
                activeKey: action.payload,
            }
        case LOGOUT_SUCCESS:
            localStorage.clear();
            return initialState;
        default:
            return state;
    }
}
