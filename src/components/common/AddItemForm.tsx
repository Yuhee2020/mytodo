import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';

type PropsType = {
    addItem: (title: string) => void
    label:string
    disabled:boolean
}

export const AddItemForm = (props: PropsType) => {
    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError("")
        setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        e.key === "Enter" && addItem()
    }
    const addItem = () => {
        if (title.trim() !== "") {
            props.addItem(title.trim())
            setTitle("")
        } else {
            setError("Title is required")
        }
    }

    return (
        <div>
            <TextField
                disabled={props.disabled}
                color='success'
                onChange={onChangeHandler}
                value={title}
                onKeyPress={onKeyPressHandler}
                error={!!error}
                label={props.label}
                size='small'
                helperText={error}
            />

            <IconButton
                disabled={props.disabled}
                color='success'
                onClick={addItem}
                size='small'>
                <AddBoxIcon sx={{fontSize:30}} />
            </IconButton>
        </div>
    );
};

