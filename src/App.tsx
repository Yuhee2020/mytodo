import React from 'react';
import {FilterType, TaskType, Todolist} from "./Todolist";
import './App.css'
import {AddItemForm} from "./components/AddItemForm";
import {Header} from "./components/Header";
import Grid from '@mui/material/Grid';
import {Paper} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {StateType} from "./store/store";
import {
    addTaskAC,
    addTodolistAC,
    changeFilterAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    changeTodolistTitleAC,
    removeTaskAC,
    removeTodolistAC
} from "./store/todolistsReducer";

export type TodolistType = {
    title: string
    todolistId: string
    filter: FilterType
    tasks: TaskType[]
}
export type TodolistsType = TodolistType[]

export const App = () => {
    const todolists = useSelector<StateType, TodolistsType>(state => state.todolists)
    const dispatch = useDispatch()
    const removeTask = (todolistId: string, taskID: string) => {
        dispatch(removeTaskAC(todolistId, taskID))
    }
    const addTask = (todolistId: string, title: string) => {
        dispatch(addTaskAC(todolistId, title))
    }
    const changeFilter = (todolistId: string, value: FilterType) => {
        dispatch(changeFilterAC(todolistId, value))
    }
    const changeTaskStatus = (todolistId: string, taskId: string, status: boolean) => {
        dispatch(changeTaskStatusAC(todolistId, taskId, status))
    }
    const removeTodolist = (todolistId: string) => {
        dispatch(removeTodolistAC(todolistId))
    }
    const changeTaskTitle = (todolistId: string, taskId: string, title: string) => {
        dispatch(changeTaskTitleAC(todolistId, taskId, title))
    }
    const changeTodolistTitle = (todolistId: string, title: string) => {
        dispatch(changeTodolistTitleAC(todolistId, title))
    }
    const addTodolist = (title: string) => {
        dispatch(addTodolistAC(title))
    }

    return (

        <div className='App'>
            <Header/>
            <Grid margin='80px 20px 20px 20px' container direction="column" alignItems="center">
                <Grid item>
                    <Paper style={{padding: "10px"}}>
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
                        <Paper elevation={3} style={{padding: "15px"}}>
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

