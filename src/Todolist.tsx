import React, {ChangeEvent} from 'react';
import {TodolistType} from "./App";
import {AddItemForm} from "./components/AddItemForm";
import {EditSpan} from "./components/EditSpan";

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
    changeTaskTitle: (todolistId: string, taskId: string, title:string)=>void
    changeTodolistTitle: (todolistId: string, title: string)=>void
}


export const Todolist = (props: PropsType) => {

    const addTask=(title:string)=>{
        props.addTask(props.todolist.todolistId,title)
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
    const changeTodolistTitle=(title:string)=>{
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
                <button onClick={removeTodolist}>-</button>
            </h3>
            <AddItemForm addItem={addTask}/>
            <ul>{tasksForTodolist.map(el => {
                const onClickHandler = () => {
                    props.removeTask(props.todolist.todolistId, el.id)
                }
                const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                    changeTaskStatus(el.id, e.currentTarget.checked)
                }
                const changeTaskTitle=(title:string)=>{
                    props.changeTaskTitle(props.todolist.todolistId, el.id, title)
                }
                return (
                    <li key={el.id} className={el.isDone ? "is-done" : ""}>
                        <input
                            onChange={onChangeHandler}
                            type='checkbox'
                            checked={el.isDone}
                        />
                       <EditSpan title={el.title} changeTitle={changeTaskTitle}/>
                        <button onClick={onClickHandler}>-</button>
                    </li>
                )
            })}
            </ul>
            <div>
                <button className={props.todolist.filter === "all" ? "active-filter" : ""}
                        onClick={onClickAllHandler}>All
                </button>
                <button className={props.todolist.filter === "active" ? "active-filter" : ""}
                        onClick={onClickActiveHandler}>Active
                </button>
                <button className={props.todolist.filter === "completed" ? "active-filter" : ""}
                        onClick={onClickCompletedHandler}>Completed
                </button>
            </div>
        </div>
    );
};

