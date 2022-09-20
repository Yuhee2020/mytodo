
const initialState={
    appStatus: "idle" as AppStatusType,
    error: null as null | string
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


type ActionsType=setAppStatusAType | setAppErrorAType
export type AppStatusType='idle' | 'loading' | 'succeeded' | 'failed'