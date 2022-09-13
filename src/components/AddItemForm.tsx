import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

type PropsType={
    addItem:(title:string)=>void
}

export const AddItemForm = (props:PropsType) => {
    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<string|null>(null)

    const onChangeHandler=(e:ChangeEvent<HTMLInputElement>)=>{
        error && setError("")
        setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler=(e:KeyboardEvent<HTMLInputElement>)=>{
        e.key==="Enter" && addItem()
    }
    const addItem=()=>{
        if(title.trim()!=="") {
            props.addItem(title.trim())
            setTitle("")
        }else{
            setError("Title is required")
        }
    }

    return (
        <div>
            <input
                onChange={onChangeHandler}
                value={title}
                onKeyPress={onKeyPressHandler}
                className={error? "error" : ""}
            />
            <button onClick={addItem} >+</button>
            {error && <div className='error-message'>{error}</div>}
        </div>
    );
};

