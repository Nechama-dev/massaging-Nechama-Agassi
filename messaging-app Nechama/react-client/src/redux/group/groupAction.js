import {ADD_GROUP} from './groupType'
import {DELETE_GROUP} from './groupType'


export const addGroup = group => {
    return {
        type: ADD_GROUP,
        payload: group
    }
}

export const deleteGroup = group => {
    return {
        type: DELETE_GROUP,
        payload: group
    }
}