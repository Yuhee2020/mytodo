import React from 'react';
import Grid from "@mui/material/Grid";
import {Paper} from "@mui/material";
import {AddItemForm} from "./AddItemForm";
import {FilterType, TaskType, Todolist} from "../Todolist";
import {useDispatch, useSelector} from "react-redux";
import {StateType} from "../store/store";
import {addTodolistAC} from "../store/todolistsReducer";


export type TodolistType = {
    title: string
    todolistId: string
    filter: FilterType
    tasks: TaskType[]
}
export type TodolistsType = TodolistType[]

export const TodolistsList = () => {
    const todolists = useSelector<StateType, TodolistsType>(state => state.todolists)
    const dispatch = useDispatch()
    const addTodolist = (title: string) => {
        dispatch(addTodolistAC(title))
    }
    return (
        <>
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
                            />
                        </Paper>
                    </Grid>
                })}

            </Grid>
        </>
    );
};
