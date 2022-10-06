import {appReducer, AppStatusType, isLoggedIn, setAppError, setAppStatus, setInitialized} from "./appReducer";

let startState={
    appStatus: "idle" as AppStatusType,
    error: null as null | string,
    isLoggedIn: false,
    isInitialized:false
}

beforeEach(() => {
    startState = {
        appStatus: "idle" as AppStatusType,
        error: null as null | string,
        isLoggedIn: false,
        isInitialized:false
    }
})

test('correct error message should be set', () => {

    const endState = appReducer(startState, setAppError({error:'critical error'}))

    expect(endState.error).toBe('critical error');
})

test('correct status should be set', () => {

    const endState = appReducer(startState, setAppStatus({status:'loading'}))

    expect(endState.appStatus).toBe('loading');
})

test('correct isLoggedIn status should be set', () => {

    const endState = appReducer(startState, isLoggedIn({value:true}))

    expect(endState.isLoggedIn).toBe(true);
})

test('correct initialized status should be set', () => {

    const endState = appReducer(startState, setInitialized({value:true}))

    expect(endState.isInitialized).toBe(true);
})

