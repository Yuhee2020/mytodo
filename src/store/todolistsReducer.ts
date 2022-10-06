import {FilterType} from "../components/Todolist";
import {TodolistDomainType, TodolistsType} from "../components/TodolistsList";
import {TaskStatuses, TaskType, todolistAPI, TodolistType} from "../api/api";
import {AppStatusType, setAppError, setAppStatus} from "./appReducer";
import {AppThunk} from "./store";
import {handleServerAppError} from "../utils/utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TodolistsType = []

export const slice = createSlice({
    name: "todolist",
    initialState,
    reducers: {
        addTodolist(state, action: PayloadAction<{ todolist: TodolistType }>) {
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
        },
        changeTodolistTitle(state, action: PayloadAction<{ todolistId: string, title: string }>) {
            const index = state.findIndex(tl => tl.todolistId === action.payload.todolistId)
            state[index].title = action.payload.title
        },
        removeTodolist(state, action: PayloadAction<{ todolistId: string }>) {
            const index = state.findIndex(tl => tl.todolistId === action.payload.todolistId)
            state.splice(index, 1)
        },
        changeFilter(state, action: PayloadAction<{ todolistId: string, value: FilterType }>) {
            const index = state.findIndex(tl => tl.todolistId === action.payload.todolistId)
            state[index].filter=action.payload.value
        },
        removeTask(state, action: PayloadAction<{ todolistId: string, taskID: string }>) {
            const tlIndex=state.findIndex(tl=>tl.todolistId===action.payload.todolistId)
            const taskIndex=state[tlIndex].tasks.findIndex(ts=>ts.id===action.payload.taskID)
            state[tlIndex].tasks.splice(taskIndex,1)
        },
        addTask(state, action: PayloadAction<{ task: TaskType }>) {
            const index=state.findIndex(tl=>tl.todolistId===action.payload.task.todoListId)
            state[index].tasks.unshift(action.payload.task)
        },
        changeTaskStatus(state, action: PayloadAction<{ todolistId: string, taskId: string, status: TaskStatuses }>) {
            const tlIndex=state.findIndex(tl=>tl.todolistId===action.payload.todolistId)
            const taskIndex=state[tlIndex].tasks.findIndex(ts=>ts.id===action.payload.taskId)
            state[tlIndex].tasks[taskIndex].status=action.payload.status
        },
        changeTaskTitle(state, action: PayloadAction<{ todolistId: string, taskId: string, title: string }>) {
            const tlIndex=state.findIndex(tl=>tl.todolistId===action.payload.todolistId)
            const taskIndex=state[tlIndex].tasks.findIndex(ts=>ts.id===action.payload.taskId)
            state[tlIndex].tasks[taskIndex].title=action.payload.title
        },
        setTodolists(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
            return action.payload.todolists.map(el => ({
                title: el.title,
                todolistId: el.id,
                filter: "all" as FilterType,
                tasks: [],
                addedDate: el.addedDate,
                order: el.order,
                entityStatus: "idle"
            }))
        },
        setTasks(state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) {
            return state.map(el => el.todolistId === action.payload.todolistId ? {
                ...el,
                tasks: action.payload.tasks
            } : el)
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ todolistId: string, status: AppStatusType }>) {
            const index = state.findIndex(tl => tl.todolistId === action.payload.todolistId)
            state[index].entityStatus=action.payload.status
        },
        changeTaskEntityStatus(state, action: PayloadAction<{ todolistId: string, taskId: string, status: AppStatusType }>) {
            const tlIndex=state.findIndex(tl=>tl.todolistId===action.payload.todolistId)
            const taskIndex=state[tlIndex].tasks.findIndex(ts=>ts.id===action.payload.taskId)
            state[tlIndex].tasks[taskIndex].entityStatus=action.payload.status
        },


    }
})

export const todolistsReducer = slice.reducer
export const {
    changeTaskEntityStatus,
    changeTodolistEntityStatus,
    setTasks,
    setTodolists,
    changeTaskTitle,
    changeTaskStatus,
    addTask,
    removeTask,
    changeFilter,
    removeTodolist,
    changeTodolistTitle,
    addTodolist
} = slice.actions

//////////////////////thunk

export const getTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatus({status: "loading"}))
        todolistAPI.getTodolists()
            .then(res => {
                debugger
                dispatch(setTodolists({todolists: res.data}))
            })
            .catch((err) => {
                dispatch(setAppError({error:err.message}))
            })
    }
}
export const getTasksTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        todolistAPI.getTasks(todolistId)
            .then(res => {
                dispatch(setTasks({todolistId, tasks: res.data.items}))
            })
            .catch((err) => {
                dispatch(setAppError({error: err.message}))
            })
            .finally(() => dispatch(setAppStatus({status: "idle"})))
    }
}


export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatus({status: "loading"}))
        todolistAPI.createTodolist(title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolist({todolist: res.data.data.item}))
                } else handleServerAppError(res.data, dispatch)
            })
            .catch((err) => {
                dispatch(setAppError({error: err.message}))

            })
            .finally(() => dispatch(setAppStatus({status: "idle"})))

    }
}

export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        dispatch(changeTodolistEntityStatus({todolistId, status: "loading"}))
        dispatch(setAppStatus({status: "loading"}))
        todolistAPI.deleteTodolist(todolistId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolist({todolistId}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((err) => {
                dispatch(setAppError({error: err.message}))
            })
            .finally(() => dispatch(setAppStatus({status: "idle"})))
    }
}

export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatus({status: "loading"}))
        todolistAPI.updateTodolist(todolistId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTodolistTitle({todolistId, title}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((err) => {
                dispatch(setAppError({error:err.message}))
            })
            .finally(() => dispatch(setAppStatus({status: "idle"})))
    }
}


export const removeTaskTC = (todolistId: string, taskId: string): AppThunk => {
    return (dispatch) => {
        dispatch(changeTaskEntityStatus({todolistId, taskId, status: "loading"}))
        dispatch(setAppStatus({status: "loading"}))
        todolistAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTask({todolistId, taskID: taskId}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((err) => {
                dispatch(setAppError({error:err.message}))
            })
            .finally(() => {
                dispatch(setAppStatus({status: "idle"}))
                dispatch(changeTaskEntityStatus({todolistId, taskId, status: "idle"}))
            })
    }
}

export const addTaskTC = (todolistId: string, title: string): AppThunk => {
    return (dispatch) => {
        dispatch(changeTodolistEntityStatus({todolistId, status: "loading"}))
        dispatch(setAppStatus({status: "loading"}))
        todolistAPI.createTask(todolistId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTask({task: res.data.data.item}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((err) => {
                dispatch(setAppError({error:err.message}))
            })
            .finally(() => {
                dispatch(setAppStatus({status: "idle"}))
                dispatch(changeTodolistEntityStatus({todolistId, status: "idle"}))
            })
    }
}

export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses): AppThunk => {
    return (dispatch, getState) => {
        dispatch(changeTaskEntityStatus({todolistId, taskId, status: "loading"}))
        dispatch(setAppStatus({status: "loading"}))
        const task = getState().todolists.filter(tl => tl.todolistId === todolistId)[0].tasks.filter(ts => ts.id === taskId)[0]

        if (task) {
            todolistAPI.updateTask(todolistId, taskId, {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status
            }).then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTaskStatus({todolistId, taskId, status}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
                .catch((err) => {
                    dispatch(setAppError({error:err.message}))
                })
                .finally(() => {
                    dispatch(changeTaskEntityStatus({todolistId, taskId, status: "idle"}))
                    dispatch(setAppStatus({status: "idle"}))
                })
        }
    }
}

export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string): AppThunk => {
    return (dispatch, getState) => {
        dispatch(changeTaskEntityStatus({todolistId, taskId, status: "loading"}))
        dispatch(setAppStatus({status: "loading"}))
        const task = getState().todolists.filter(tl => tl.todolistId === todolistId)[0].tasks.filter(ts => ts.id === taskId)[0]

        if (task) {
            todolistAPI.updateTask(todolistId, taskId, {
                title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: task.status
            }).then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTaskTitle({todolistId, taskId, title}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
                .catch((err) => {
                    dispatch(setAppError({error: err.message}))
                })
                .finally(() => {
                    dispatch(changeTaskEntityStatus({todolistId, taskId, status: "idle"}))
                    dispatch(setAppStatus({status: "idle"}))
                })
        }
    }
}



