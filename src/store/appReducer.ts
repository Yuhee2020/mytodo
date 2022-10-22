import {authAPI, LoginParamsType} from "../api/api";
import {handleServerAppError} from "../utils/utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

const initialState = {
    appStatus: "idle" as AppStatusType,
    error: null as null | string,
    isLoggedIn: false,
    isInitialized: false
}


export const loginTC = createAsyncThunk("app/login", async (params: LoginParamsType, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: "loading"}))
    try {
        const res = await authAPI.login(params)
        if (res.data.resultCode === 0) {
            dispatch(isLoggedIn({value: true}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (err) {
        const error = err as AxiosError
        dispatch(setAppError({error: error.message}))
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: "idle"}))
    }
})

export const logoutTC = createAsyncThunk("app/logout", async (params, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: "loading"}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(isLoggedIn({value: false}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (err) {
        const error = err as AxiosError
        dispatch(setAppError({error: error.message}))
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: "idle"}))
    }
})

export const initializeAppTC = createAsyncThunk("app/initializeApp", async (params, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: "loading"}))
    try{
      const res=await authAPI.authMe()
        if (res.data.resultCode === 0) {
            dispatch(isLoggedIn({value: true}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }catch (err) {
        const error = err as AxiosError
        dispatch(setAppError({error: error.message}))
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: "idle"}))
        dispatch(setInitialized({value: true}))
    }
})


export const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppStatus(state, action: PayloadAction<{ status: AppStatusType }>) {
            state.appStatus = action.payload.status
        },
        setAppError(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        },
        isLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        },
        setInitialized(state, action: PayloadAction<{ value: boolean }>) {
            state.isInitialized = action.payload.value
        },
    }
})

export const appReducer = slice.reducer
export const {setAppStatus, setAppError, isLoggedIn, setInitialized} = slice.actions

export type AppStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'