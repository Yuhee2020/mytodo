import React, {useEffect} from 'react';
import Grid from "@mui/material/Grid";
import {Paper} from "@mui/material";
import {AddItemForm} from "./common/AddItemForm";
import {FilterType, Todolist} from "./Todolist";
import {useSelector} from "react-redux";
import {StateType, useAppDispatch, useAppSelector} from "../store/store";
import {addTodolistTC, getTodolistsTC} from "../store/todolistsReducer";
import {TaskType} from "../api/api";
import {AppStatusType} from "../store/appReducer";
import {Navigate} from "react-router-dom";


export type TodolistDomainType = {
    title: string
    todolistId: string
    addedDate: string,
    order: number
    filter: FilterType
    tasks: TaskType[]
    entityStatus: AppStatusType

}
export type TodolistsType = TodolistDomainType[]

export const TodolistsList = () => {
    const appStatus=useAppSelector(state => state.app.appStatus)
    const isLoggedIn = useAppSelector(state =>state.app.isLoggedIn)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!isLoggedIn){return}
        dispatch(getTodolistsTC())
    }, [])

    const todolists = useSelector<StateType, TodolistsType>(state => state.todolists)

    const addTodolist = (title: string) => {
        dispatch(addTodolistTC(title))
    }
    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }
    return (
        <>
            <Grid margin='80px 0px 20px 0px' container direction="column" alignItems="center">
                <Grid item>
                    <Paper style={{padding: "15px"}}>
                        <AddItemForm addItem={addTodolist} label={"enter todolist title"} disabled={appStatus==="loading"}/>
                    </Paper>
                </Grid>
            </Grid>
            <Grid
                spacing={3}
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="baseline"
            >

                {todolists.map(tl => {
                    return <Grid item key={tl.todolistId}>
                        <Paper elevation={3} style={{padding: "15px"}}>
                            <Todolist
                                todolist={tl}

                            />
                        </Paper>
                    </Grid>
                })}

            </Grid>
        </>
    );
};
