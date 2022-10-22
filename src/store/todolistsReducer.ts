import {FilterType} from "../components/Todolist";
import {TodolistDomainType, TodolistsType} from "../components/TodolistsList";
import {TaskStatuses, todolistAPI} from "../api/api";
import {AppStatusType, setAppError, setAppStatus} from "./appReducer";
import {StateType} from "./store";
import {handleServerAppError} from "../utils/utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";


//////////////////////AsyncThunk

export const getTodolistsTC = createAsyncThunk("todolist/getTodolists", async (params, {dispatch, rejectWithValue}) => {
        try {
            dispatch(setAppStatus({status: "loading"}))
            const res = await todolistAPI.getTodolists()
            return {todolists: res.data}
        } catch (err) {
            const error = err as AxiosError
            dispatch(setAppError({error: error.message}))
            return rejectWithValue(null)
        }
    }
)

export const getTasksTC = createAsyncThunk("todolist/getTasks", async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    try {
        const res = await todolistAPI.getTasks(todolistId)
        return {todolistId, tasks: res.data.items}
    } catch (err) {
        const error = err as AxiosError
        dispatch(setAppError({error: error.message}))
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: "idle"}))
    }
})

export const addTodolistTC = createAsyncThunk("todolist/addTodolist", async (title: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatus({status: "loading"}))
    try {
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === 0) {
            return {todolist: res.data.data.item}
        } else handleServerAppError(res.data, dispatch)
    } catch (err) {
        const error = err as AxiosError
        dispatch(setAppError({error: error.message}))
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: "idle"}))
    }
})

export const removeTodolistTC = createAsyncThunk("todolist/removeTodolist", async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(changeTodolistEntityStatus({todolistId, status: "loading"}))
    dispatch(setAppStatus({status: "loading"}))
    try {
        const res = await todolistAPI.deleteTodolist(todolistId)
        if (res.data.resultCode === 0) {
            return {todolistId}
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (err) {
        const error = err as AxiosError
        dispatch(setAppError({error: error.message}))
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: "idle"}))
        dispatch(changeTodolistEntityStatus({todolistId, status: "idle"}))
    }
})

export const changeTodolistTitleTC = createAsyncThunk("todolist/changeTodolistTitle", async (params: {
    todolistId: string,
    title: string
}, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: "loading"}))
    try {
        const res = await todolistAPI.updateTodolist(params.todolistId, params.title)
        if (res.data.resultCode === 0) {
            return params
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

export const removeTaskTC = createAsyncThunk("todolist/removeTask", async (params: { todolistId: string, taskId: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(changeTaskEntityStatus({todolistId: params.todolistId, taskId: params.taskId, status: "loading"}))
    dispatch(setAppStatus({status: "loading"}))
    try {
        const res = await todolistAPI.deleteTask(params.todolistId, params.taskId)
        if (res.data.resultCode === 0) {
            return {todolistId: params.todolistId, taskID: params.taskId}
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (err) {
        const error = err as AxiosError
        dispatch(setAppError({error: error.message}))
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: "idle"}))
        dispatch(changeTaskEntityStatus({
            todolistId: params.todolistId,
            taskId: params.taskId,
            status: "idle"
        }))
    }
})


export const addTaskTC = createAsyncThunk("todolist/addTask", async (params: { todolistId: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(changeTodolistEntityStatus({todolistId: params.todolistId, status: "loading"}))
    dispatch(setAppStatus({status: "loading"}))
    try {
        const res = await todolistAPI.createTask(params.todolistId, params.title)
        if (res.data.resultCode === 0) {
            return {task: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (err) {
        rejectWithValue(err)
        const error = err as AxiosError
        dispatch(setAppError({error: error.message}))
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: "idle"}))
        dispatch(changeTodolistEntityStatus({todolistId: params.todolistId, status: "idle"}))
    }
})
export const updateTaskStatusTC = createAsyncThunk("todolist/updateTaskStatus", async (params: { todolistId: string, taskId: string, status: TaskStatuses }, {
    dispatch,
    getState,
    rejectWithValue
}) => {
    dispatch(changeTaskEntityStatus({todolistId: params.todolistId, taskId: params.taskId, status: "loading"}))
    dispatch(setAppStatus({status: "loading"}))
    try {
        const state = getState() as StateType
        const task = state.todolists.filter(tl => tl.todolistId === params.todolistId)[0].tasks.filter(ts => ts.id === params.taskId)[0]
        if (task) {
            const res = await todolistAPI.updateTask(params.todolistId, params.taskId, {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: params.status
            })
            if (res.data.resultCode === 0) {
                return {todolistId: params.todolistId, taskId: params.taskId, status: params.status}
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }
    } catch (err) {
        const error = err as AxiosError
        dispatch(setAppError({error: error.message}))
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: "idle"}))
        dispatch(changeTaskEntityStatus({
            todolistId: params.todolistId,
            taskId: params.taskId,
            status: "idle"
        }))
    }
})

export const updateTaskTitleTC = createAsyncThunk("todolist/updateTaskTitle", async (params: { todolistId: string, taskId: string, title: string }, {
    dispatch,
    getState,
    rejectWithValue
}) => {
    dispatch(changeTaskEntityStatus({todolistId: params.todolistId, taskId: params.taskId, status: "loading"}))
    dispatch(setAppStatus({status: "loading"}))
    try {
        const state = getState() as StateType
        const task = state.todolists.filter(tl => tl.todolistId === params.todolistId)[0].tasks.filter(ts => ts.id === params.taskId)[0]
        if (task) {
            const res = await todolistAPI.updateTask(params.todolistId, params.taskId, {
                title: params.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: task.status
            })
            if (res.data.resultCode === 0) {
                return {todolistId: params.todolistId, taskId: params.taskId, title: params.title}
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }
    } catch (err) {
        const error = err as AxiosError
        dispatch(setAppError({error: error.message}))
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: "idle"}))
        dispatch(changeTaskEntityStatus({
            todolistId: params.todolistId,
            taskId: params.taskId,
            status: "idle"
        }))
    }
})

//////////////slice
export const slice = createSlice({
    name: "todolist",
    initialState: [] as TodolistsType,
    reducers: {
        changeFilter(state, action: PayloadAction<{ todolistId: string, value: FilterType }>) {
            const index = state.findIndex(tl => tl.todolistId === action.payload.todolistId)
            state[index].filter = action.payload.value
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ todolistId: string, status: AppStatusType }>) {
            const index = state.findIndex(tl => tl.todolistId === action.payload.todolistId)
            state[index].entityStatus = action.payload.status
        },
        changeTaskEntityStatus(state, action: PayloadAction<{ todolistId: string, taskId: string, status: AppStatusType }>) {
            const tlIndex = state.findIndex(tl => tl.todolistId === action.payload.todolistId)
            const taskIndex = state[tlIndex].tasks.findIndex(ts => ts.id === action.payload.taskId)
            state[tlIndex].tasks[taskIndex].entityStatus = action.payload.status
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getTodolistsTC.fulfilled, (state, action) => {
            return action.payload?.todolists.map(el => ({
                title: el.title,
                todolistId: el.id,
                filter: "all" as FilterType,
                tasks: [],
                addedDate: el.addedDate,
                order: el.order,
                entityStatus: "idle"
            }))
        });
        builder.addCase(getTasksTC.fulfilled, (state, action) => {
            return state.map(el => el.todolistId === action.payload?.todolistId ? {
                ...el,
                tasks: action.payload.tasks
            } : el)
        })
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            if (action.payload) {
                const newTodolist: TodolistDomainType = {
                    title: action.payload.todolist.title,
                    todolistId: action.payload.todolist.id,
                    filter: "all" as FilterType,
                    tasks: [],
                    addedDate: action.payload.todolist.addedDate,
                    order: action.payload.todolist.order,
                    entityStatus: "idle"
                }
                state.unshift(newTodolist)
            }
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.todolistId === action.payload?.todolistId)
            state.splice(index, 1)
        })
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            if (action.payload) {
                const index = state.findIndex(tl => tl.todolistId === action.payload?.todolistId)
                state[index].title = action.payload.title
            }
        })
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            const tlIndex = state.findIndex(tl => tl.todolistId === action.payload?.todolistId)
            const taskIndex = state[tlIndex].tasks.findIndex(ts => ts.id === action.payload?.taskID)
            state[tlIndex].tasks.splice(taskIndex, 1)
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
                const index = state.findIndex(tl => tl.todolistId === action.payload?.task.todoListId)
                state[index].tasks.unshift(action.payload.task)
            }
        })
        builder.addCase(updateTaskStatusTC.fulfilled, (state, action) => {
            if (action.payload) {
                const tlIndex = state.findIndex(tl => tl.todolistId === action.payload?.todolistId)
                const taskIndex = state[tlIndex].tasks.findIndex(ts => ts.id === action.payload?.taskId)
                state[tlIndex].tasks[taskIndex].status = action.payload.status
            }
        })
        builder.addCase(updateTaskTitleTC.fulfilled, (state, action) => {
            if (action.payload) {
                const tlIndex = state.findIndex(tl => tl.todolistId === action.payload?.todolistId)
                const taskIndex = state[tlIndex].tasks.findIndex(ts => ts.id === action.payload?.taskId)
                state[tlIndex].tasks[taskIndex].title = action.payload.title
            }
        })
    }
})

export const todolistsReducer = slice.reducer
export const {
    changeTaskEntityStatus,
    changeTodolistEntityStatus,
    changeFilter,
} = slice.actions









