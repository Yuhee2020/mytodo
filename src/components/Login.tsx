import React, {useState} from "react";
import {useFormik} from 'formik';
import {Navigate} from 'react-router-dom'
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    TextField
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {loginTC} from "../store/appReducer";
import {useAppDispatch, useAppSelector} from "../store/store";
import Typography from "@mui/material/Typography";


type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}
type FormikValuesType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(state => state.app.isLoggedIn)
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const validate = (values: FormikValuesType) => {
        const errors: FormikErrorType = {};
        if (!values.email) {
            errors.email = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }
        if (!values.password) {
            errors.password = 'Required';
        } else if (values.password.length < 4) {
            errors.password = 'Must be mo then 4 symbols';
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
            captcha: false
        },
        validate,
        onSubmit: async (values) => {
            dispatch(loginTC(values))
        },
    });
    if (isLoggedIn) {
        return <Navigate to={"/"}/>
    }
    return (
        <Grid container justifyContent={'center'}>
            <Grid item marginTop={'80px'} textAlign={"center"} width={"400px"}>
                <Paper elevation={14} style={{padding: "30px", height: "430px"}}>
                    <form onSubmit={formik.handleSubmit}>
                        <Typography variant={"body2"} marginTop={"10px"}>
                            To log use common test account credentials:
                            <div>Email: free@samuraijs.com</div>
                            <div>Password: free</div>
                        </Typography>
                        <FormControl fullWidth>
                            <FormLabel style={{textAlign: "center"}}>
                                <h2>Sign in</h2>
                            </FormLabel>
                            <FormGroup>
                                <TextField
                                    color={'success'}
                                    label="Email"
                                    helperText={formik.touched.email && !!formik.errors.email ? formik.errors.email : " "}
                                    variant="standard"
                                    type="text"
                                    error={formik.touched.email && !!formik.errors.email}
                                    {...formik.getFieldProps('email')}
                                />
                                <TextField
                                    color={'success'}
                                    label="Password"
                                    helperText={formik.touched.password && !!formik.errors.password ? formik.errors.password : " "}
                                    variant="standard"
                                    type={showPassword ? 'text' : 'password'}
                                    error={formik.touched.password && !!formik.errors.password}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    {...formik.getFieldProps('password')}

                                />
                                <FormControlLabel label={'Remember me'}
                                                  color={'success'}
                                                  control={<Checkbox
                                                      checked={formik.values.rememberMe}
                                                      {...formik.getFieldProps("rememberMe")}
                                                  />}/>
                                <Button style={{marginTop: "40px"}} type={'submit'} variant={'contained'}
                                        color={'success'} fullWidth>
                                    Sign In
                                </Button>
                            </FormGroup>
                        </FormControl>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Login;