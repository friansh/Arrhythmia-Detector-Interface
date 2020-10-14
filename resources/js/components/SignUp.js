import React, { Fragment, useState } from "react";
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

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import moment from "moment";
import MomentUtils from "@date-io/moment";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from "@material-ui/pickers";

import Axios from "axios";

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
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SignUp(props) {
    const classes = useStyles();
    const preventDefault = event => event.preventDefault();

    const [agreeTAC, setAgreeTAC] = useState(false);

    const handleAgree = function() {
        setAgreeTAC(!agreeTAC);
    };

    const [email, setEmail] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [address, setAddress] = useState();
    const [city, setCity] = useState();
    const [province, setProvince] = useState();
    const [country, setCountry] = useState();
    const [zipCode, setZipCode] = useState();
    const [password, setPassword] = useState();
    const [selectedDate, setSelectedDate] = React.useState(
        new Date(1990, 1, 0)
    );

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    const handleSubmit = function() {
        if (agreeTAC) {
            let birthday = moment(selectedDate).format();
            Axios.post("/register", {
                password: password,
                birthday: moment(selectedDate).format(),
                email: email,
                first_name: firstName,
                last_name: lastName,
                address: address,
                zip_code: zipCode,
                city: city,
                province: province,
                country: country
            }).then(response => {
                console.log(response.data);
                if (response.data.status) {
                    setSnackSeverity("success");
                    setSnackMessage(
                        "Registered. You will be redirected to the login form..."
                    );
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 3000);
                } else {
                    setSnackSeverity("error");
                    setSnackMessage(
                        "Please fill out all the required columns."
                    );
                }
                showSnack();
            });
        } else {
            setSnackSeverity("error");
            setSnackMessage("You do not agree to the terms and conditions");
            showSnack();
        }
    };

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
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                {/* <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography> */}
                <img
                    height={50}
                    src="landing-assets/images/logo/logo-use.png"
                />
                <div className={classes.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                onChange={event =>
                                    setFirstName(event.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                                onChange={event =>
                                    setLastName(event.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardDatePicker
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Birthday"
                                    format="MMMM Do YYYY"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={event => setEmail(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="addressline"
                                label="Address Line"
                                name="addressline"
                                autoComplete="addressline"
                                onChange={event =>
                                    setAddress(event.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="zipcode"
                                label="Zip Code"
                                name="zipcode"
                                autoComplete="zipcode"
                                onChange={event =>
                                    setZipCode(event.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="city"
                                label="City"
                                name="city"
                                autoComplete="city"
                                onChange={event => setCity(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="province"
                                label="Province"
                                name="province"
                                autoComplete="province"
                                onChange={event =>
                                    setProvince(event.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="country"
                                label="Country"
                                name="country"
                                autoComplete="country"
                                onChange={event =>
                                    setCountry(event.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={event =>
                                    setPassword(event.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value="allowExtraEmails"
                                        color="primary"
                                        onClick={handleAgree}
                                    />
                                }
                                label={
                                    <Fragment>
                                        <span>I agree to the </span>
                                        <Link href="#" onClick={preventDefault}>
                                            terms and conditions
                                        </Link>
                                    </Fragment>
                                }
                            />
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit}
                    >
                        Sign Up
                    </Button>
                </div>
                <Snackbar
                    open={snackOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackClose}
                >
                    <Alert onClose={handleSnackClose} severity={snackSeverity}>
                        {snackMessage}
                    </Alert>
                </Snackbar>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Link href="/login" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </div>
            <Box mt={5} mb={5}>
                <Copyright />
            </Box>
        </Container>
    );
}

if (document.getElementById("register")) {
    const element = document.getElementById("register");
    ReactDOM.render(<SignUp />, element);
}
