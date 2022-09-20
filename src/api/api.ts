import axios, {AxiosResponse} from "axios";
import {AppStatusType} from "../store/appReducer";

const instance=axios.create({
    baseURL:'https://social-network.samuraijs.com/api/1.1/',
    withCredentials:true,
    headers:{
        'API-KEY': '68557ad3-b9a8-4dd0-9b3d-e2fde40e12b8'
    }
})

export const todolistAPI={
    getTodolists(){
        return instance.get<TodolistType[]>("todo-lists")
    },
    createTodolist(title:string){
        return instance.post<{title:string}, AxiosResponse<ResponseType<{ item: TodolistType }>>>("todo-lists", {title})
    },
    deleteTodolist(todolistId:string){
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId:string, title:string){
        return instance.put<{title:string},AxiosResponse<ResponseType>>(`todo-lists/${todolistId}`, {title})
    },
    getTasks(todolistId:string){
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks?count=100`)
    },
    deleteTask(todolistId:string, taskId:string){
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    createTask(todolistId:string, title:string){
        return instance.post<{title:string}, AxiosResponse<ResponseType<{item:TaskType}>>>(`todo-lists/${todolistId}/tasks/`,{title})
    },
    updateTask(todolistId:string,taskId:string, model:UpdateTaskModelType){
        return instance.put<{model:UpdateTaskModelType},AxiosResponse<ResponseType<{item: TaskType}>>>(`todo-lists/${todolistId}/tasks/${taskId}`,model)
    }

}


export type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

export type UpdateTaskModelType={
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
    entityStatus?:AppStatusType
}

// export type DomainTaskType=TaskType &{
//     entityStatus:AppStatusType
// }

type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}