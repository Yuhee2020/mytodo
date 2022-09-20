import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {LinearProgress} from "@mui/material";
import {useSelector} from "react-redux";
import {StateType} from "../store/store";
import {AppStatusType} from "../store/appReducer";

export const Header=()=> {
    const status=useSelector<StateType, AppStatusType>(state => state.app.appStatus)
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar color='default' position="fixed">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        Todolist
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status==="loading" && <LinearProgress color={"success"}/>}
            </AppBar>
        </Box>
    );
}
