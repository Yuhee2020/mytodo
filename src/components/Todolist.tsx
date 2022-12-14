import React, {useEffect} from 'react';
import {TodolistDomainType} from "./TodolistsList";
import {AddItemForm} from "./common/AddItemForm";
import {EditSpan} from "./common/EditSpan";
import {Button, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {Task} from "./Task";
import {addTaskTC, changeFilter, changeTodolistTitleTC, getTasksTC, removeTodolistTC} from "../store/todolistsReducer";
import {TaskStatuses} from "../api/api";
import {useAppDispatch} from "../store/store";


export type FilterType = 'all' | 'completed' | 'active'


type PropsType = {
    todolist: TodolistDomainType
}


export const Todolist = (props: PropsType) => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getTasksTC(props.todolist.todolistId))
    }, [dispatch,props.todolist.todolistId])

    const addTask = (title: string) => {
        dispatch(addTaskTC({todolistId:props.todolist.todolistId, title}))
    }

    const onClickAllHandler = () => {
        dispatch(changeFilter({todolistId:props.todolist.todolistId,value: "all"}))
    }
    const onClickCompletedHandler = () => {
        dispatch(changeFilter({todolistId:props.todolist.todolistId, value:"completed"}))
    }
    const onClickActiveHandler = () => {
        dispatch(changeFilter({todolistId:props.todolist.todolistId, value:"active"}))
    }
    const removeTodolist = () => {
        dispatch(removeTodolistTC(props.todolist.todolistId))
    }
    const changeTodolistTitle = (title: string) => {
        dispatch(changeTodolistTitleTC({todolistId:props.todolist.todolistId, title}))
    }
    let tasksForTodolist = props.todolist.tasks
    if (props.todolist.filter === "active") {
        tasksForTodolist = props.todolist.tasks.filter(el => el.status === TaskStatuses.New)
    }
    if (props.todolist.filter === "completed") {
        tasksForTodolist = props.todolist.tasks.filter(el => el.status === TaskStatuses.Completed)
    }
    return (
        <div style={{width: "280px"}}>
            <h3 style={{textAlign:"center"}}>
                <EditSpan title={props.todolist.title}
                          changeTitle={changeTodolistTitle}
                          disabled={props.todolist.entityStatus === "loading"}/>
                <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === "loading"}><DeleteIcon/></IconButton>
            </h3>
            <AddItemForm addItem={addTask} label={"enter task title"}
                         disabled={props.todolist.entityStatus === "loading"}/>
            <div style={{marginTop:"8px"}}>{tasksForTodolist.map(el => {
                return (
                    <Task key={el.id} task={el} todolistId={props.todolist.todolistId}/>
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

