import React, { useState } from "react";
import ReactDOM from "react-dom";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import Axios from "axios";
import { CookiesProvider, useCookies } from "react-cookie";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://material-ui.com/">
                Fikri Rida Pebriansyah
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SignIn() {
    const classes = useStyles();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [cookies, setCookie, removeCookie] = useCookies();

    function emailChange(event) {
        setEmail(event.target.value);
    }

    function passwordChange(event) {
        setPassword(event.target.value);
    }

    function submit(event) {
        event.preventDefault();
        Axios.post("/login", {
            email: email,
            password: password
        })
            .then(function(response) {
                console.log(response.data);
                if (response.data.status) {
                    setSnackSeverity("success");
                    setSnackMessage(
                        <span>
                            <b>Logged in, </b> redirecting...
                        </span>
                    );
                    showSnack();
                    setCookie("token", response.data.token);
                    setTimeout(() => {
                        window.location.href = "/user";
                    }, 2000);
                } else {
                    setSnackSeverity("error");
                    setSnackMessage(
                        <span>
                            <b>Incorrect</b> username or password.
                        </span>
                    );
                    showSnack();
                }
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            });
    }

    const [snackOpen, setSnackOpen] = useState(false);
    const [snackSeverity, setSnackSeverity] = useState("success");
    const [snackMessage, setSnackMessage] = useState("this is message");

    const handleSnackClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setSnackOpen(false);
    };

    const showSnack = () => {
        setSnackOpen(true);
    };

    return (
        <CookiesProvider>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    {/* <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar> */}
                    <img
                        height={50}
                        src="landing-assets/images/logo/logo-use.png"
                    />
                    {/* <Typography component="h1" variant="h5">
                        Sign in
                    </Typography> */}
                    <form className={classes.form} method={"post"} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            onChange={event => emailChange(event)}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={event => passwordChange(event)}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox value="remember" color="primary" />
                            }
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={event => submit(event)}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/" variant="body2">
                                    &#8592; Back to Landing Page
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
            <Snackbar
                open={snackOpen}
                autoHideDuration={6000}
                onClose={handleSnackClose}
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        </CookiesProvider>
    );
}

if (document.getElementById("login")) {
    ReactDOM.render(<SignIn />, document.getElementById("login"));
}
