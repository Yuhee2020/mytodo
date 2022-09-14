import React from 'react';
import './App.css'
import {Header} from "./components/Header";
import {TodolistsList} from "./components/TodolistsList";


export const App = () => {

    return (

        <div className='App'>
            <Header/>
            <TodolistsList/>
        </div>
    )
};

