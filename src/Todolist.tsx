import React, {ChangeEvent} from 'react';
import {TodolistType} from "./App";
import {AddItemForm} from "./components/AddItemForm";
import {EditSpan} from "./components/EditSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export type FilterType = 'all' | 'completed' | 'active'


type PropsType = {
    todolist: TodolistType
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolistId: string, value: FilterType) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, status: boolean) => void
    removeTodolist: (todolistId: string) => void
    changeTaskTitle: (todolistId: string, taskId: string, title: string) => void
    changeTodolistTitle: (todolistId: string, title: string) => void
}


export const Todolist = (props: PropsType) => {

    const addTask = (title: string) => {
        props.addTask(props.todolist.todolistId, title)
    }

    const onClickAllHandler = () => {
        props.changeFilter(props.todolist.todolistId, "all")
    }
    const onClickCompletedHandler = () => {
        props.changeFilter(props.todolist.todolistId, "completed")
    }
    const onClickActiveHandler = () => {
        props.changeFilter(props.todolist.todolistId, "active")
    }
    const changeTaskStatus = (taskId: string, status: boolean) => {
        props.changeTaskStatus(props.todolist.todolistId, taskId, status)
    }
    const removeTodolist = () => {
        props.removeTodolist(props.todolist.todolistId)
    }
    const changeTodolistTitle = (title: string) => {
        props.changeTodolistTitle(props.todolist.todolistId, title)
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
                const onClickHandler = () => {
                    props.removeTask(props.todolist.todolistId, el.id)
                }
                const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                    changeTaskStatus(el.id, e.currentTarget.checked)
                }
                const changeTaskTitle = (title: string) => {
                    props.changeTaskTitle(props.todolist.todolistId, el.id, title)
                }
                return (
                    <div key={el.id} className={el.isDone ? "is-done" : ""}>
                        <Checkbox
                            color='success'
                            onChange={onChangeHandler}
                            checked={el.isDone}
                        />
                        <EditSpan title={el.title} changeTitle={changeTaskTitle}/>
                        <IconButton onClick={onClickHandler}><DeleteIcon/></IconButton>
                    </div>
                )
            })}
            </div>
            <div>
                <Button color='success' variant={props.todolist.filter === "all" ? "contained" : "outlined"}
                        onClick={onClickAllHandler}>All
                </Button>
                <Button color='success'  variant={props.todolist.filter === "active" ? "contained" : "outlined"}
                        onClick={onClickActiveHandler}>Active
                </Button>
                <Button color='success' variant={props.todolist.filter === "completed" ? "contained" : "outlined"}
                        onClick={onClickCompletedHandler}>Completed
                </Button>
            </div>
        </div>
    );
};

