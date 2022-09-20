import React from 'react';
import './App.css'
import {Header} from "./components/Header";
import {TodolistsList} from "./components/TodolistsList";
import {ErrorSnackbar} from "./components/common/ErrorSnackbar";


export const App = () => {

    return (

        <div className='App'>
            <ErrorSnackbar/>
            <Header/>
            <TodolistsList/>
        </div>
    )
};

