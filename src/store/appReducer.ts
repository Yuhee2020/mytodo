import {Dispatch} from "redux";
import {authAPI, LoginParamsType} from "../api/api";
import {handleServerAppError} from "../utils/utils";

const initialState={
    appStatus: "idle" as AppStatusType,
    error: null as null | string,
    isLoggedIn: false,
    isInitialized:false
}
type InitialStateType=typeof initialState

export const appReducer=(state:InitialStateType=initialState, action:ActionsType)=>{
    switch (action.type){
        case "APP/SET-APP-STATUS":{
            return {...state, appStatus:action.status}
        }
        case "APP/SET-APP-ERROR":{
            return {...state, error: action.error}
        }
        case "APP/SET-IS-LOGGED-IN":{
            return {...state,isLoggedIn: action.value}
        }
        case "APP/SET-INITIALIZED":{
            return  {...state, isInitialized: true}
        }

        default: return state
    }
}

export type setAppStatusAType=ReturnType<typeof setAppStatusAC>
export const setAppStatusAC=(status:AppStatusType)=>{
    return {
        type: "APP/SET-APP-STATUS",
        status
    }as const
}
export type setAppErrorAType=ReturnType<typeof setAppErrorAC>
export const setAppErrorAC=(error:null | string)=>{
    return {
        type: "APP/SET-APP-ERROR",
        error
    }as const
}
export type isLoggedInAType=ReturnType<typeof isLoggedInAC>
export const isLoggedInAC=(value:boolean)=>{
    return {
        type: "APP/SET-IS-LOGGED-IN",
        value
    }as const
}

export type setInitializedAType=ReturnType<typeof setInitializedAC>
export const setInitializedAC=(value:boolean)=>{
    return {
        type: "APP/SET-INITIALIZED",
        value
    }as const
}


export const loginTC=(data:LoginParamsType)=>{
    return (dispatch:Dispatch)=>{
        dispatch(setAppStatusAC("loading"))
        authAPI.login(data)
            .then((res)=>{
                if (res.data.resultCode === 0) {
                    dispatch(isLoggedInAC(true))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err=> dispatch(setAppErrorAC(err.message)))
            .finally(()=> dispatch(setAppStatusAC("idle")))
    }
}

export const logoutTC=()=>{
    return (dispatch:Dispatch)=>{
        dispatch(setAppStatusAC("loading"))
        authAPI.logout()
            .then((res)=>{
                if (res.data.resultCode === 0) {
                    dispatch(isLoggedInAC(false))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err=> dispatch(setAppErrorAC(err.message)))
            .finally(()=> dispatch(setAppStatusAC("idle")))
    }
}

export const initializeAppTC=()=>{
    return (dispatch:Dispatch)=>{
        dispatch(setAppStatusAC("loading"))
        authAPI.authMe()
            .then((res)=>{
                if (res.data.resultCode === 0) {
                    dispatch(isLoggedInAC(true))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err=> dispatch(setAppErrorAC(err.message)))
            .finally(()=> {
                dispatch(setAppStatusAC("idle"))
                dispatch(setInitializedAC(true))
            })
    }
}





type ActionsType=setAppStatusAType | setAppErrorAType | isLoggedInAType | setInitializedAType
export type AppStatusType='idle' | 'loading' | 'succeeded' | 'failed'