import {CHANGE_PAGE} from './types';

// Should be called on each navigation change
export const navigatePage = (key) => {
    return {
        type: CHANGE_PAGE,
        payload: key,
    }
}
