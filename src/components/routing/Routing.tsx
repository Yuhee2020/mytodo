import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {TodolistsList} from "../TodolistsList";
import Login from "../Login";
import Error404 from "../error404/Error404";



export const Routing = () => {
    return (
        <div>
            <Routes >
               <Route path={"/"} element={<TodolistsList/>}/>
               <Route path={"/login"} element={<Login/>}/>
               <Route path={"/404"} element={<Error404/>}/>
               <Route path="*" element={<Navigate to={"/404"}/>}/>
            </Routes >

        </div>
    );
};

