import {createStore, combineReducers} from 'redux';
import userReducer from './user/userReducer'
import groupReducer from './group/groupReducer'


const rootReducer = combineReducers({
    user: userReducer,
    group: groupReducer
})
const store = createStore(rootReducer)

export default store;