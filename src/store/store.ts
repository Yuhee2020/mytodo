import {combineReducers, createStore, applyMiddleware} from "redux";
import {todolistsReducer} from "./todolistsReducer";
import thunk from "redux-thunk";
import {appReducer} from "./appReducer";


export const rootReducer = combineReducers({
    todolists: todolistsReducer,
    app:appReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

// @ts-ignore
window.store = store

export type StateType = ReturnType<typeof rootReducer>