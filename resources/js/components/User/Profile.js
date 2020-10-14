import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/User";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import Axios from "axios";
import { useCookies } from "react-cookie";
import Typography from "@material-ui/core/Typography";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import PersonIcon from "@material-ui/icons/Person";

import MomentUtils from "@date-io/moment";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from "@material-ui/pickers";

import Moment from "react-moment";

const useStyles = makeStyles(theme => ({
    infoCard: {
        padding: 24,
        marginBottom: 12
    },
    infoCardTitle: {
        flexGrow: 1
    },
    summaryCard: {
        padding: 18
    },
    summaryTitle: {
        marginBottom: 12
    }
}));

export default function Profile() {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();
    const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = React.useState(
        new Date("2014-08-18T21:11:54")
    );
    const handleDateChange = date => {
        setSelectedDate(date);
    };

    const handleTokenDialogClose = () => {
        setTokenDialogOpen(false);
    };

    const handleTokenDialogOpen = () => {
        setTokenDialogOpen(true);
    };

    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        address: "",
        zip_code: "",
        city: "",
        province: "",
        country: ""
    });

    const [device, setDevice] = useState({
        token: "",
        updated_at: ""
    });

    useEffect(() => {
        Axios.get("/api/active", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(response => {
            setUser(response.data.user);
        });

        Axios.get("/api/device", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(response => {
            setDevice(response.data);
        });
    }, []);

    const randomizeToken = () => {
        Axios.post(
            "/api/device/refresh",
            {},
            {
                headers: {
                    Authorization: "Bearer " + cookies.token
                }
            }
        ).then(response => {
            location.reload();
        });
    };

    return (
        <Template title={"Profile"}>
            {/* <Typography variant="h4" style={{ marginBottom: 12 }}>
                Profile
            </Typography> */}
            <Grid container spacing={2}>
                <Grid item md={3} style={{ padding: 12 }}>
                    <Paper style={{ padding: 12 }}>
                        <Grid container>
                            <Grid item xs={12} style={{ marginBottom: 12 }}>
                                <Grid container justify="center">
                                    <Avatar style={{ height: 50, width: 50 }}>
                                        <PersonIcon />
                                    </Avatar>
                                </Grid>
                            </Grid>
                            <Grid item sm={12}>
                                <Typography variant="h6" align="center">
                                    {user.first_name + " " + user.last_name}
                                </Typography>
                                <Typography variant="body2" align="center">
                                    {user.address}
                                    {", "}
                                    {user.zip_code}
                                    {", "}
                                    {user.city}
                                    {", "}
                                    {user.province}
                                    <br />
                                    {user.country}.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper style={{ padding: 12, marginTop: 12 }}>
                        <Typography
                            variant="subtitle2"
                            align="center"
                            style={{ marginBottom: 12 }}
                        >
                            Device Token
                        </Typography>
                        <TextField
                            label="Token (you can copy this field)"
                            value={device.token}
                            fullWidth
                            style={{ marginBottom: 12 }}
                        />
                        <Typography variant="caption">
                            Updated at: <Moment>{device.updated_at}</Moment>
                        </Typography>
                        <Grid container justify="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleTokenDialogOpen}
                            >
                                Regenerate
                            </Button>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item md={6} style={{ padding: 12 }}>
                    <Paper style={{ padding: 12 }}>
                        <Grid container>
                            <Grid item xs={6} style={{ padding: 12 }}>
                                <TextField
                                    label="First Name"
                                    value={user.first_name}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6} style={{ padding: 12 }}>
                                <TextField
                                    label="Last Name"
                                    value={user.last_name}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} style={{ paddingLeft: 12 }}>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Birthday"
                                        format="MMMM Do YYYY"
                                        value={user.birthday}
                                        onChange={handleDateChange}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={12} style={{ padding: 12 }}>
                                <TextField
                                    label="Address"
                                    value={user.address}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} style={{ padding: 12 }}>
                                <TextField
                                    label="Zip Code"
                                    value={user.zip_code}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} style={{ padding: 12 }}>
                                <TextField
                                    label="City"
                                    value={user.city}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} style={{ padding: 12 }}>
                                <TextField
                                    label="Province"
                                    value={user.province}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} style={{ padding: 12 }}>
                                <TextField
                                    label="Country"
                                    value={user.country}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} style={{ padding: 12 }}>
                                <Grid container justify="flex-end">
                                    <Button variant="contained" color="primary">
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Dialog
                open={tokenDialogOpen}
                onClose={handleTokenDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Are you sure want to regenerate token?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        After this action executed, you have to update the
                        device token setting value on your device. This action
                        is irreversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleTokenDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={randomizeToken} color="primary" autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </Template>
    );
}

if (document.getElementById("profile")) {
    ReactDOM.render(<Profile />, document.getElementById("profile"));
}
