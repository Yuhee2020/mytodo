import React from 'react';
import {TodolistType} from "./components/TodolistsList";
import {AddItemForm} from "./components/AddItemForm";
import {EditSpan} from "./components/EditSpan";
import {Button, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {Task} from "./components/Task";
import {useDispatch} from "react-redux";
import {addTaskAC, changeFilterAC, changeTodolistTitleAC, removeTodolistAC} from "./store/todolistsReducer";

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export type FilterType = 'all' | 'completed' | 'active'


type PropsType = {
    todolist: TodolistType
}


export const Todolist = (props: PropsType) => {
    const dispatch = useDispatch()

    const addTask = (title: string) => {
        dispatch(addTaskAC(props.todolist.todolistId, title))
    }

    const onClickAllHandler = () => {
        dispatch(changeFilterAC(props.todolist.todolistId, "all"))
    }
    const onClickCompletedHandler = () => {
        dispatch(changeFilterAC(props.todolist.todolistId, "completed"))
    }
    const onClickActiveHandler = () => {
        dispatch(changeFilterAC(props.todolist.todolistId, "active"))
    }
    const removeTodolist = () => {
        dispatch(removeTodolistAC(props.todolist.todolistId))
    }
    const changeTodolistTitle = (title: string) => {
        dispatch(changeTodolistTitleAC(props.todolist.todolistId, title))
    }
    let tasksForTodolist = props.todolist.tasks
    if (props.todolist.filter === "active") {
        tasksForTodolist = props.todolist.tasks.filter(el => !el.isDone)
    }
    if (props.todolist.filter === "completed") {
        tasksForTodolist = props.todolist.tasks.filter(el => el.isDone)
    }
    return (
        <div>
            <h3><EditSpan title={props.todolist.title} changeTitle={changeTodolistTitle}/>
                <IconButton onClick={removeTodolist}><DeleteIcon/></IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            <div>{tasksForTodolist.map(el => {
                return (
                    <Task task={el} todolistId={props.todolist.todolistId}/>
                )
            })}
            </div>
            <div>
                <Button color='success' variant={props.todolist.filter === "all" ? "contained" : "outlined"}
                        onClick={onClickAllHandler}>All
                </Button>
                <Button color='success' variant={props.todolist.filter === "active" ? "contained" : "outlined"}
                        onClick={onClickActiveHandler}>Active
                </Button>
                <Button color='success' variant={props.todolist.filter === "completed" ? "contained" : "outlined"}
                        onClick={onClickCompletedHandler}>Completed
                </Button>
            </div>
        </div>
    );
};

