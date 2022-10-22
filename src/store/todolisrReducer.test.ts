import {TodolistsType} from "../components/TodolistsList";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/api";
import {
    addTaskTC,
    addTodolistTC,
    changeFilter,
    changeTaskEntityStatus,
    updateTaskTitleTC,
    changeTodolistEntityStatus,
    changeTodolistTitleTC,
    removeTaskTC,
    removeTodolistTC,
    todolistsReducer,
    updateTaskStatusTC
} from "./todolistsReducer";

let startState: TodolistsType = []

beforeEach(() => {
    startState = [
        {
            title: "what to do?",
            todolistId: "123456789",
            addedDate: "", order: 0,
            filter: "all",
            entityStatus: "idle",
            tasks: [
                {
                    description: "",
                    title: "Learning JS",
                    status: TaskStatuses.New,
                    priority: TaskPriorities.Low,
                    startDate: "",
                    deadline: "",
                    id: "12345",
                    todoListId: "123456789",
                    order: 0,
                    addedDate: "",
                    entityStatus: "idle"
                },
                {
                    description: "",
                    title: "Learning React",
                    status: TaskStatuses.New,
                    priority: TaskPriorities.Low,
                    startDate: "",
                    deadline: "",
                    id: "54321",
                    todoListId: "123456789",
                    order: 0,
                    addedDate: "",
                    entityStatus: "idle"
                }
            ],

        },
        {
            title: "what to by?",
            todolistId: "987654321",
            addedDate: "",
            order: 0,
            filter: "all",
            entityStatus: "idle",
            tasks: [
                {
                    description: "",
                    title: "bread",
                    status: TaskStatuses.New,
                    priority: TaskPriorities.Low,
                    startDate: "",
                    deadline: "",
                    id: "789658",
                    todoListId: "987654321",
                    order: 0,
                    addedDate: "",
                    entityStatus: "idle"
                },
                {
                    description: "",
                    title: "sugar",
                    status: TaskStatuses.New,
                    priority: TaskPriorities.Low,
                    startDate: "",
                    deadline: "",
                    id: "326487",
                    todoListId: "987654321",
                    order: 0,
                    addedDate: "",
                    entityStatus: "idle"
                },

            ],

        }
    ]
})

test("todolist should be added correctly", () => {
    let newTodolist = {
        id: "258525",
        title: "New todolist",
        addedDate: "20.07.1991",
        order: 0
    }
    const endState=todolistsReducer(startState, addTodolistTC.fulfilled({todolist:newTodolist},"",newTodolist.title))
    expect(endState.length).toBe(3)
    expect(endState[0].addedDate).toEqual(newTodolist.addedDate)
    expect(endState[0].filter).toEqual("all")
})

test("todolist title should be changed correctly", () => {

    const endState=todolistsReducer(startState, changeTodolistTitleTC.fulfilled({ todolistId:"123456789" , title: "New todolist title" },"",{ todolistId:"123456789" , title: "New todolist title" }))
    expect(endState[0].title).toBe("New todolist title")
    expect(endState[1].title).toBe("what to by?")
    expect(endState.length).toBe(2)
})

test("correct todolist should be deleted", () => {

    const endState=todolistsReducer(startState, removeTodolistTC.fulfilled({ todolistId:"123456789"},"","123456789"))
    expect(endState[0].todolistId).toBe("987654321")
    expect(endState.length).toBe(1)
})

test("filter of todolist should be changed correctly", () => {

    const endState=todolistsReducer(startState, changeFilter({ todolistId:"123456789", value: "active"}))
    expect(endState[0].filter).toBe("active")
    expect(endState[1].filter).toBe("all")
    expect(endState.length).toBe(2)
})

test("correct task of todolist should be deleted", () => {

    const endState=todolistsReducer(startState, removeTaskTC.fulfilled({ todolistId:"123456789", taskID:"12345"},"",{ todolistId:"123456789", taskId:"12345"}))
    expect(endState[0].tasks.length).toBe(1)
    expect(endState[1].tasks.length).toBe(2)
    expect(endState[0].tasks[0].id).toBe("54321")
})

test("task should be added correctly", () => {

const newTask:TaskType= {
    description: "string",
    title: "New Task",
    status: TaskStatuses.New,
    priority: TaskPriorities.Low,
    startDate:" string",
    deadline: "string",
    id: "5256082",
    todoListId: "123456789",
    order: 0,
    addedDate: "string",
    entityStatus:"idle"
}
    const endState=todolistsReducer(startState, addTaskTC.fulfilled({task:newTask},"", {todolistId:newTask.todoListId, title:newTask.title}))
    expect(endState[0].tasks.length).toBe(3)
    expect(endState[1].tasks.length).toBe(2)
    expect(endState[0].tasks[0].id).toBe("5256082")
})

test("task status should be changed correctly", () => {

    const endState=todolistsReducer(startState, updateTaskStatusTC.fulfilled({  todolistId: "123456789", taskId:"12345", status: TaskStatuses.Completed },"", {  todolistId: "123456789", taskId:"12345", status: TaskStatuses.Completed }))
    expect(endState[0].tasks[0].status).toBe(TaskStatuses.Completed)
    expect(endState[1].tasks[0].status).toBe(TaskStatuses.New)
    expect(endState[0].tasks[1].status).toBe(TaskStatuses.New)
    expect(endState[0].tasks.length).toBe(2)
})

test("task title should be changed correctly", () => {

    const endState=todolistsReducer(startState, updateTaskTitleTC.fulfilled({  todolistId: "123456789", taskId:"12345", title:"reading" },"",{  todolistId: "123456789", taskId:"12345", title:"reading" }))
    expect(endState[0].tasks[0].title).toBe("reading")
    expect(endState[1].tasks[0].title).toBe("bread")
    expect(endState[0].tasks[1].title).toBe("Learning React")
    expect(endState[0].tasks.length).toBe(2)
})

test("TodolistEntityStatus should be changed correctly", () => {

    const endState=todolistsReducer(startState, changeTodolistEntityStatus({  todolistId: "123456789", status:"loading"}))
    expect(endState[0].entityStatus).toBe("loading")
    expect(endState[1].entityStatus).toBe("idle")
})

test("TaskEntityStatus should be changed correctly", () => {

    const endState=todolistsReducer(startState, changeTaskEntityStatus({  todolistId: "123456789", taskId:"12345", status:"loading"}))
    expect(endState[0].tasks[0].entityStatus).toBe("loading")
    expect(endState[0].tasks[1].entityStatus).toBe("idle")
    expect(endState[1].tasks[0].entityStatus).toBe("idle")
})

