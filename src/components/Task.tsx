import React, {ChangeEvent} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditSpan} from "./common/EditSpan";
import DeleteIcon from "@mui/icons-material/Delete";
import {removeTaskTC, updateTaskStatusTC, updateTaskTitleTC} from "../store/todolistsReducer";
import {TaskStatuses, TaskType} from "../api/api";
import {useAppDispatch} from "../store/store";

type PropsType = {
    task: TaskType
    todolistId: string
}

export const Task: React.FC<PropsType> = ({task, todolistId}) => {
    const dispatch = useAppDispatch()
    const onClickHandler = () => {
        dispatch(removeTaskTC({todolistId, taskId: task.id}) as any)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateTaskStatusTC({
            todolistId,
            taskId: task.id,
            status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        }))
    }
    const changeTaskTitle = (title: string) => {
        dispatch(updateTaskTitleTC({todolistId, taskId:task.id, title}) as any)
    }

    return (
        <div key={task.id}>
            <Checkbox
                disabled={task.entityStatus === "loading"}
                color='success'
                onChange={onChangeHandler}
                checked={task.status === TaskStatuses.Completed}
            />
            <EditSpan title={task.title} changeTitle={changeTaskTitle} disabled={task.entityStatus === "loading"}/>
            <IconButton onClick={onClickHandler} disabled={task.entityStatus === "loading"}><DeleteIcon/></IconButton>
        </div>
    );
};

