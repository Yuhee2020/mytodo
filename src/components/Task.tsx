import React, {ChangeEvent} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditSpan} from "./EditSpan";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskType} from "../Todolist";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../store/todolistsReducer";

type PropsType = {
    task: TaskType
    todolistId: string
}

export const Task: React.FC<PropsType> = ({task, todolistId}) => {
    const dispatch = useDispatch()
    const onClickHandler = () => {
        dispatch(removeTaskAC(todolistId, task.id))
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatusAC(todolistId, task.id, e.currentTarget.checked))
    }
    const changeTaskTitle = (title: string) => {
        dispatch(changeTaskTitleAC(todolistId, task.id, title))
    }

    return (
        <div key={task.id} className={task.isDone ? "is-done" : ""}>
            <Checkbox
                color='success'
                onChange={onChangeHandler}
                checked={task.isDone}
            />
            <EditSpan title={task.title} changeTitle={changeTaskTitle}/>
            <IconButton onClick={onClickHandler}><DeleteIcon/></IconButton>
        </div>
    );
};

