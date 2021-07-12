import {SET_USER} from './userTypes';

const initialState = {
    _id: "0",
    userName: "",
    role: ""
}

const userReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_USER : return{
            ...state,
            id: action.payload._id,
            userName: action.payload.userName,
            role: action.payload.role,
        }

        default: return state;
    }
}

export default userReducer;