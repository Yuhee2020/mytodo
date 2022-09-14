import React, {useState} from 'react';
import {FilterType, TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";
import './App.css'
import {AddItemForm} from "./components/AddItemForm";
import {Header} from "./components/Header";
import Grid from '@mui/material/Grid';
import {Paper} from "@mui/material";

export type TodolistType = {
    title: string
    todolistId: string
    filter: FilterType
    tasks: TaskType[]
}
export type TodolistsType = TodolistType[]

export const App = () => {
    const [todolists, setTodolists] = useState<TodolistsType>([
        {
            title: "What",
            todolistId: v1(),
            filter: "all",
            tasks: [
                {id: v1(), title: "HTML&CSS", isDone: true},
                {id: v1(), title: "JS", isDone: true},
                {id: v1(), title: "ReactJS", isDone: false},
                {id: v1(), title: "ReactJS", isDone: false},
                {id: v1(), title: "ReactJS", isDone: false}
            ]
        },
        {
            title: "sldjskf",
            todolistId: v1(),
            filter: "all",
            tasks: [
                {id: v1(), title: "HTML&CSS", isDone: true},
                {id: v1(), title: "JS", isDone: true},
                {id: v1(), title: "ReactJS", isDone: false}
            ]
        }
    ])

    const removeTask = (todolistId: string, taskID: string) => {
        setTodolists(todolists.map(el => el.todolistId === todolistId ? {
            ...el,
            tasks: el.tasks.filter(t => t.id !== taskID)
        } : el))
        console.log(todolists[0].tasks)
    }
    const addTask = (todolistId: string, title: string) => {
        let newTask = {id: v1(), title, isDone: false}
        setTodolists(todolists.map(tl => tl.todolistId === todolistId ? {...tl, tasks: [newTask, ...tl.tasks]} : tl))
    }

    const changeFilter = (todolistId: string, value: FilterType) => {
        setTodolists(todolists.map(tl => tl.todolistId === todolistId ? {...tl, filter: value} : tl))
    }
    const changeTaskStatus = (todolistId: string, taskId: string, status: boolean) => {
        setTodolists(todolists.map(tl => tl.todolistId === todolistId ? {
            ...tl,
            tasks: tl.tasks.map(t => t.id === taskId ? {...t, isDone: status} : t)
        } : tl))
    }
    const removeTodolist = (todolistId: string) => {
        setTodolists(todolists.filter(tl => tl.todolistId !== todolistId))
    }
    const changeTaskTitle = (todolistId: string, taskId: string, title: string) => {
        setTodolists(todolists.map(tl => tl.todolistId === todolistId ? {
            ...tl,
            tasks: tl.tasks.map(t => t.id === taskId ? {...t, title} : t)
        } : tl))
    }
    const changeTodolistTitle = (todolistId: string, title: string) => {
        setTodolists(todolists.map(tl => tl.todolistId === todolistId ? {...tl, title} : tl))
    }

    const addTodolist = (title: string) => {
        const newTodolist: TodolistType = {
            title,
            todolistId: v1(),
            filter: "all",
            tasks: []
        }
        setTodolists([newTodolist, ...todolists])
    }

    return (

        <div className='App'>
            <Header/>
            <Grid margin='80px 20px 20px 20px' container direction="column" alignItems="center">
                <Grid item>
                    <Paper style={{padding:"10px"}}>
                    <AddItemForm addItem={addTodolist}/>
                    </Paper>
                </Grid>
            </Grid>
            <Grid
                spacing={4}
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="baseline"
            >

                {todolists.map(tl => {
                    return <Grid item>
                        <Paper elevation={3} style={{padding:"15px"}}>
                            <Todolist
                                todolist={tl}
                                key={tl.todolistId}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeTaskStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                })}

            </Grid>
        </div>
    )
};

