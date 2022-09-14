import React, {KeyboardEvent, useState} from 'react';
import {TextField} from "@mui/material";

type PropsType = {
    title: string
    changeTitle: (title: string) => void
}

export const EditSpan = (props: PropsType) => {
    const [edit, setEdit] = useState(false)
    const [newTitle, setNewTitle] = useState(props.title)

    const setEditMode = () => {
        setEdit(!edit)
        props.changeTitle(newTitle)

    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        e.key === "Enter" && setEditMode()
    }

    return edit
        ? <TextField
            onChange={(e) => setNewTitle(e.currentTarget.value)}
            value={newTitle}
            autoFocus
            onBlur={setEditMode}
            onKeyPress={onKeyPressHandler}
            size='small'
            color='success'/>
        : <span onDoubleClick={setEditMode}>{props.title}</span>
};

