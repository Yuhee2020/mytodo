import {v1} from "uuid";
import {FilterType, TaskType} from "../Todolist";

const initialState = [
    {
        title: "What",
        todolistId: v1(),
        filter: "all" as FilterType,
        tasks: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "ReactJS", isDone: false}
        ] as TaskType[]
    },
    {
        title: "sldjskf",
        todolistId: v1(),
        filter: "all" as FilterType,
        tasks: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false}
        ] as TaskType[]
    }
]
type InitialStateType = typeof initialState

export const todolistsReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case "ADD-TODOLIST": {
            const newTodolist = {
                title: action.title,
                todolistId: v1(),
                filter: "all"as FilterType,
                tasks: []
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
            let newTask = {id: v1(), title: action.title, isDone: false}
            return state.map(tl => tl.todolistId === action.todolistId ? {...tl, tasks: [newTask, ...tl.tasks]} : tl)
        }
        case "CHANGE-TASK-STATUS": {
            return state.map(tl => tl.todolistId === action.todolistId
                ? {
                    ...tl, tasks: tl.tasks.map(t => t.id === action.taskId
                        ? {...t, isDone: action.status} : t)
                } : tl)
        }
        case "CHANGE-TASK-TITLE":{
            return state.map(tl => tl.todolistId === action.todolistId ? {
                ...tl,
                tasks: tl.tasks.map(t => t.id === action.taskId ? {...t, title:action.title} : t)
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


type AddTodolistAType = ReturnType<typeof addTodolistAC>
export const addTodolistAC = (title: string) => {
    return {
        type: "ADD-TODOLIST",
        title
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
export const addTaskAC = (todolistId: string, title: string) => {
    return {
        type: "ADD-TASK",
        todolistId,
        title
    } as const
}

type ChangeTaskStatusAType = ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC = (todolistId: string, taskId: string, status: boolean) => {
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