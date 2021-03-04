import {CHANGE_PAGE, LOGOUT_SUCCESS} from '../actions/types';

const initialState = {
    activeKey : "1",
}


export default function(state=initialState, action) {
    switch(action.type) {
        case CHANGE_PAGE:
            return {
                ...state,
                activeKey: action.payload,
            }
        case LOGOUT_SUCCESS:
            return initialState;
        default:
            return state;
    }
}
