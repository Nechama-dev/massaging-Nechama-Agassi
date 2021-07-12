import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { TextField, Typography, Button } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import * as api from '../../api';
import { connect } from 'react-redux'
import { setUser } from '../../redux'


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function Login(props) {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [authenticated, set_authenticated] = useState(false);
    const [error, setError] = useState("");

    const submitForm = () => {
        console.log(password)
        if (userName === "" || password === "") {
            setError("Fields are required");
            return;
        }

        loginUser();
    };

    const loginUser = async e => {
        const response = await api.login(userName, password)
        if (response.status === "you are login") {
            set_authenticated(true)
            console.log('hii from client', response.user);
            props.setUser(response.user)
            console.log('hii from redux', props.userId)
        } else {
            setError(response.status);
            return;
        }
    }

    return (
        <div>
            <form>
                <Typography variant="h5" style={{ marginBottom: 8 }}>
                    Login chat
                </Typography>
                <TextField
                    label="User name"
                    variant="outlined"
                    fullWidth
                    className="form-input"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="form-input"
                    size="large"
                    onClick={submitForm}
                >
                    Login
                </Button>
                {error && (
                    <Alert severity="error" onClick={() => setError(null)}>
                        {error}
                    </Alert>
                )}
            </form>
            <h1>heloooo{props.userId}</h1>
            <div>
                <Route exact path="/"> 
                    {authenticated && props?.role === "admin" ? <Redirect to="/CreateGroup" /> : null}
                    {authenticated && props?.role === "user" ? <Redirect to="/Home" /> : null} 
                </Route>
          
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        userId: state.user.id,
        userName: state.user.userName,
        role: state.user.role,
    }
}

const mapDispachToProps = dispatch => {
    return {
        setUser: user => dispatch(setUser(user))
    }
}

export default connect(mapStateToProps, mapDispachToProps)(Login)

