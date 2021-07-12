import { ADD_GROUP } from './groupType';
import { DELETE_GROUP } from './groupType';

const initialState = {
    groups: []
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_GROUP: return {
            ...state,
            groups: [...action.payload]
        }
        case DELETE_GROUP: return {
            ...state,
            groups: state.groups.filter(g => g !== action.payload)
        }
        default: return state;
    }
}

export default userReducer;