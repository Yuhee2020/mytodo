import React, {useEffect} from 'react';
import './App.css'
import {Header} from "./components/Header";
import {ErrorSnackbar} from "./components/common/ErrorSnackbar";
import {Routing} from "./components/routing/Routing";
import {useDispatch, useSelector} from "react-redux";
import {initializeAppTC} from "./store/appReducer";
import {CircularProgress} from "@mui/material";
import {StateType} from "./store/store";


export const App = () => {
    const dispatch = useDispatch()
    const isInitialized = useSelector<StateType, boolean>(state =>state.app.isInitialized)
    useEffect(() => {
        dispatch(initializeAppTC() as any)
    })
    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress color={"success"}/>
        </div>
    }

    return (
        <div className='App'>
            <ErrorSnackbar/>
            <Header/>
            <Routing/>
        </div>
    )
};

