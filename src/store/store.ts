import {combineReducers, createStore} from "redux";
import {todolistsReducer} from "./todolistsReducer";


export const rootReducer = combineReducers({
    todolists: todolistsReducer
})

export const store = createStore(rootReducer)

// @ts-ignore
window.store = store

export type StateType = ReturnType<typeof rootReducer>