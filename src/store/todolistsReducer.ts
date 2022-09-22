import {FilterType} from "../components/Todolist";
import {TodolistDomainType, TodolistsType} from "../components/TodolistsList";
import {TaskStatuses, TaskType, todolistAPI, TodolistType} from "../api/api";
import {Dispatch} from "redux";
import {AppStatusType, setAppErrorAC, setAppStatusAC} from "./appReducer";
import {StateType} from "./store";
import {handleServerAppError} from "../utils/utils";

const initialState: TodolistsType = []
type InitialStateType = typeof initialState

export const todolistsReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case "ADD-TODOLIST": {
            const newTodolist: TodolistDomainType = {
                title: action.todolist.title,
                todolistId: action.todolist.id,
                filter: "all" as FilterType,
                tasks: [],
                addedDate: action.todolist.addedDate,
                order: action.todolist.order,
                entityStatus: "idle"
            }
            return [newTodolist, ...state]
        }
        case "CHANGE-TODOLIST-TITLE": {
            return state.map(tl => tl.todolistId === action.todolistId ? {...tl, title: action.title} : tl)
        }
        case "REMOVE-TODOLIST": {
            return state.filter(tl => tl.todolistId !== action.todolistId)
        }
        case "CHANGE-FILTER": {
            return state.map(tl => tl.todolistId === action.todolistId ? {...tl, filter: action.value} : tl)
        }
        case "REMOVE-TASK": {
            return state.map(el => el.todolistId === action.todolistId ? {
                ...el, tasks: el.tasks.filter(t => t.id !== action.taskID)
            } : el)
        }
        case "ADD-TASK": {
            return state.map(tl => tl.todolistId === action.task.todoListId ? {
                ...tl,
                tasks: [action.task, ...tl.tasks]
            } : tl)
        }
        case "CHANGE-TASK-STATUS": {
            return state.map(tl => tl.todolistId === action.todolistId
                ? {
                    ...tl, tasks: tl.tasks.map(t => t.id === action.taskId
                        ? {...t, status: action.status} : t)
                } : tl)
        }
        case "CHANGE-TASK-TITLE": {
            return state.map(tl => tl.todolistId === action.todolistId ? {
                ...tl,
                tasks: tl.tasks.map(t => t.id === action.taskId ? {...t, title: action.title} : t)
            } : tl)
        }
        case "SET-TODOLISTS": {
            return action.todolists.map(el => ({
                title: el.title,
                todolistId: el.id,
                filter: "all" as FilterType,
                tasks: [],
                addedDate: el.addedDate,
                order: el.order,
                entityStatus: "idle"
            }))
        }
        case "SET-TASKS": {
            return state.map(el => el.todolistId === action.todolistId ? {...el, tasks: action.tasks} : el)
        }
        case "CHANGE-TL-ENTITY-STATUS": {
            return state.map(el => el.todolistId === action.todolistId ? {...el, entityStatus: action.status} : el)
        }
        case "CHANGE-TASK-ENTITY-STATUS": {
            return state.map(tl => tl.todolistId === action.todolistId ? {
                ...tl,
                tasks: tl.tasks.map(t => t.id === action.taskId ? {...t, entityStatus: action.status} : t)
            } : tl)
        }
        default:
            return state
    }
}
type ActionsType =
    | AddTodolistAType
    | ChangeTodolistTitleAType
    | RemoveTodolistAType
    | ChangeFilterAType
    | RemoveTaskAType
    | AddTaskAType
    | ChangeTaskStatusAType
    | ChangeTaskTitleAType
    | SetTodolistsAType
    | SetTasksAType
    | ChangeTodolistEntityStatusAType
    | ChangeTaskEntityStatusAType

///////////////////actions

type AddTodolistAType = ReturnType<typeof addTodolistAC>
export const addTodolistAC = (todolist: TodolistType) => {
    return {
        type: "ADD-TODOLIST",
        todolist
    } as const
}

type ChangeTodolistTitleAType = ReturnType<typeof changeTodolistTitleAC>
export const changeTodolistTitleAC = (todolistId: string, title: string) => {
    return {
        type: "CHANGE-TODOLIST-TITLE",
        todolistId,
        title
    } as const
}

type RemoveTodolistAType = ReturnType<typeof removeTodolistAC>
export const removeTodolistAC = (todolistId: string) => {
    return {
        type: "REMOVE-TODOLIST",
        todolistId,
    } as const
}

type ChangeFilterAType = ReturnType<typeof changeFilterAC>
export const changeFilterAC = (todolistId: string, value: FilterType) => {
    return {
        type: "CHANGE-FILTER",
        todolistId,
        value
    } as const
}

type RemoveTaskAType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (todolistId: string, taskID: string) => {
    return {
        type: "REMOVE-TASK",
        todolistId,
        taskID
    } as const
}

type AddTaskAType = ReturnType<typeof addTaskAC>
export const addTaskAC = (task: TaskType) => {
    return {
        type: "ADD-TASK",
        task
    } as const
}

type ChangeTaskStatusAType = ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC = (todolistId: string, taskId: string, status: TaskStatuses) => {
    return {
        type: "CHANGE-TASK-STATUS",
        todolistId,
        taskId,
        status
    } as const
}

type ChangeTaskTitleAType = ReturnType<typeof changeTaskTitleAC>
export const changeTaskTitleAC = (todolistId: string, taskId: string, title: string) => {
    return {
        type: "CHANGE-TASK-TITLE",
        todolistId,
        taskId,
        title
    } as const
}

type SetTodolistsAType = ReturnType<typeof setTodolistsAC>
export const setTodolistsAC = (todolists: TodolistType[]) => {
    return {
        type: "SET-TODOLISTS",
        todolists
    } as const
}

type SetTasksAType = ReturnType<typeof setTasksAC>
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => {
    return {
        type: "SET-TASKS",
        todolistId,
        tasks
    } as const
}

type ChangeTodolistEntityStatusAType = ReturnType<typeof changeTodolistEntityStatusAC>
export const changeTodolistEntityStatusAC = (todolistId: string, status: AppStatusType) => {
    return {
        type: "CHANGE-TL-ENTITY-STATUS",
        status,
        todolistId
    } as const
}

type ChangeTaskEntityStatusAType = ReturnType<typeof changeTaskEntityStatusAC>
export const changeTaskEntityStatusAC = (todolistId: string, taskId: string, status: AppStatusType) => {
    return {
        type: "CHANGE-TASK-ENTITY-STATUS",
        status,
        todolistId,
        taskId
    } as const
}

//////////////////////thunk

export const getTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC("loading"))
        todolistAPI.getTodolists()
            .then(res => {
                dispatch(setTodolistsAC(res.data))
            })
            .catch((err) => {
                dispatch(setAppErrorAC(err.message))
            })
    }
}
export const getTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistAPI.getTasks(todolistId)
            .then(res => {
                dispatch(setTasksAC(todolistId, res.data.items))
            })
            .catch((err) => {
                dispatch(setAppErrorAC(err.message))
            })
            .finally(() => dispatch(setAppStatusAC("idle")))
    }
}


export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC("loading"))
        todolistAPI.createTodolist(title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item))
                } else handleServerAppError(res.data, dispatch)
            })
            .catch((err) => {
                dispatch(setAppErrorAC(err.message))

            })
            .finally(() => dispatch(setAppStatusAC("idle")))

    }
}

export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(changeTodolistEntityStatusAC(todolistId, "loading"))
        dispatch(setAppStatusAC("loading"))
        todolistAPI.deleteTodolist(todolistId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistId))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((err) => {
                dispatch(setAppErrorAC(err.message))
            })
            .finally(() => dispatch(setAppStatusAC("idle")))
    }
}

export const changeTodolistTileTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC("loading"))
        todolistAPI.updateTodolist(todolistId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTodolistTitleAC(todolistId, title))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((err) => {
                dispatch(setAppErrorAC(err.message))
            })
            .finally(() => dispatch(setAppStatusAC("idle")))
    }
}


export const removeTaskTC = (todolistId: string, taskId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, "loading"))
        dispatch(setAppStatusAC("loading"))
        todolistAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTaskAC(todolistId, taskId))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((err) => {
                dispatch(setAppErrorAC(err.message))
            })
            .finally(() => {
                dispatch(setAppStatusAC("idle"))
                dispatch(changeTaskEntityStatusAC(todolistId, taskId, "idle"))
            })
    }
}

export const addTaskTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(changeTodolistEntityStatusAC(todolistId, "loading"))
        dispatch(setAppStatusAC("loading"))
        todolistAPI.createTask(todolistId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC(res.data.data.item))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((err) => {
                dispatch(setAppErrorAC(err.message))
            })
            .finally(() => {
                dispatch(setAppStatusAC("idle"))
                dispatch(changeTodolistEntityStatusAC(todolistId, "idle"))
            })
    }
}

export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch, getState: () => StateType) => {
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, "loading"))
        dispatch(setAppStatusAC("loading"))
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
                    dispatch(changeTaskStatusAC(todolistId, taskId, status))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
                .catch((err) => {
                    dispatch(setAppErrorAC(err.message))
                })
                .finally(() => {
                    dispatch(changeTaskEntityStatusAC(todolistId, taskId, "idle"))
                    dispatch(setAppStatusAC("idle"))
                })
        }
    }
}

export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string) => {
    return (dispatch: Dispatch, getState: () => StateType) => {
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, "loading"))
        dispatch(setAppStatusAC("loading"))
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
                    dispatch(changeTaskTitleAC(todolistId, taskId, title))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
                .catch((err) => {
                    dispatch(setAppErrorAC(err.message))
                })
                .finally(() => {
                    dispatch(changeTaskEntityStatusAC(todolistId, taskId, "idle"))
                    dispatch(setAppStatusAC("idle"))
                })
        }
    }
}



