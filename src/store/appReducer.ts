import {Dispatch} from "redux";
import {authAPI, LoginParamsType} from "../api/api";
import {handleServerAppError} from "../utils/utils";
import {AppThunk} from "./store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState={
    appStatus: "idle" as AppStatusType,
    error: null as null | string,
    isLoggedIn: false,
    isInitialized:false
}

export const slice=createSlice({
    name:"app",
    initialState,
    reducers:{
        setAppStatus(state, action:PayloadAction<{status:AppStatusType}>){
            state.appStatus=action.payload.status
        },
        setAppError(state, action:PayloadAction<{error:null | string}>){
            state.error=action.payload.error
        },
        isLoggedIn(state, action:PayloadAction<{value:boolean}>){
            state.isLoggedIn=action.payload.value
        },
        setInitialized(state, action:PayloadAction<{value:boolean}>){
           state.isInitialized=action.payload.value
        },
    }
})

export const appReducer=slice.reducer
export const {setAppStatus, setAppError, isLoggedIn, setInitialized}=slice.actions



export const loginTC=(data:LoginParamsType)=>{
    return (dispatch:Dispatch)=>{
        dispatch(setAppStatus({status:"loading"}))
        authAPI.login(data)
            .then((res)=>{
                if (res.data.resultCode === 0) {
                    dispatch(isLoggedIn({value:true}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err=> dispatch(setAppError(err.message)))
            .finally(()=> dispatch(setAppStatus({status:"idle"})))
    }
}

export const logoutTC=()=>{
    return (dispatch:Dispatch)=>{
        dispatch(setAppStatus({status:"loading"}))
        authAPI.logout()
            .then((res)=>{
                if (res.data.resultCode === 0) {
                    dispatch(isLoggedIn({value:false}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err=> dispatch(setAppError(err.message)))
            .finally(()=> dispatch(setAppStatus({status:"idle"})))
    }
}

export const initializeAppTC=():AppThunk=>{
    return (dispatch)=>{
        dispatch(setAppStatus({status:"loading"}))
        authAPI.authMe()
            .then((res)=>{
                if (res.data.resultCode === 0) {
                    dispatch(isLoggedIn({value:true}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err=> dispatch(setAppError(err.message)))
            .finally(()=> {
                dispatch(setAppStatus({status:"idle"}))
                dispatch(setInitialized({value:true}))
            })
    }
}



export type AppStatusType='idle' | 'loading' | 'succeeded' | 'failed'