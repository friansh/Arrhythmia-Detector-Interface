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

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import PersonIcon from "@material-ui/icons/Person";
import SaveIcon from "@material-ui/icons/Save";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import SyncIcon from "@material-ui/icons/Sync";

import LinearProgress from "@material-ui/core/LinearProgress";

import moment from "moment";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

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
    const [updatedAlert, setUpdatedAlert] = useState(false);
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [address, setAddress] = useState();
    const [gender, setGender] = useState();
    const [city, setCity] = useState();
    const [province, setProvince] = useState();
    const [country, setCountry] = useState();
    const [zipCode, setZipCode] = useState();
    const [birthday, setBirthday] = React.useState(new Date(1990, 1, 0));
    const [device, setDevice] = useState({
        token: "",
        updated_at: ""
    });

    const handleDateChange = date => {
        setBirthday(date);
    };

    const handleTokenDialogClose = () => {
        setTokenDialogOpen(false);
    };

    const handleTokenDialogOpen = () => {
        setTokenDialogOpen(true);
    };

    const closeUpdatedAlert = () => {
        setUpdatedAlert(false);
    };

    const [messageContent, setMessageContent] = useState();
    const [messageSeverity, setMessageSeverity] = useState("success");

    const handleUpdate = () => {
        Axios.post(
            "/api/user",
            {
                _method: "PATCH",
                birthday: moment(birthday).format(),
                first_name: firstName,
                last_name: lastName,
                address,
                gender,
                zip_code: zipCode,
                city,
                province,
                country
            },
            {
                headers: {
                    Authorization: "Bearer " + cookies.token
                }
            }
        ).then(response => {
            console.log(response.data);
            if (response.data.status) {
                setMessageContent("The users profile has been updated.");
                setMessageSeverity("success");
                setUpdatedAlert(true);
            } else {
                setMessageContent("Failed to update user details.");
                setMessageSeverity("error");
                setUpdatedAlert(true);
            }
        });
    };

    useEffect(() => {
        Axios.get("/api/active", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        })
            .then(response => {
                setBirthday(new Date(response.data.user.birthday));
                setFirstName(response.data.user.first_name);
                setLastName(response.data.user.last_name);
                setGender(response.data.user.gender);
                setAddress(response.data.user.address);
                setZipCode(response.data.user.zip_code);
                setCity(response.data.user.city);
                setProvince(response.data.user.province);
                setCountry(response.data.user.country);
            })
            .finally(loadDone);

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

    const [loading, setLoading] = useState(true);

    const loadDone = () => {
        setLoading(false);
    };

    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [newPasswordConfirm, setNewPasswordConfirm] = useState();

    const handleOldPassword = e => {
        setOldPassword(e.target.value);
    };

    const handleNewPassword = e => {
        setNewPassword(e.target.value);
    };

    const handleNewPasswordConfirm = e => {
        setNewPasswordConfirm(e.target.value);
    };

    const changePassword = () => {
        Axios.post(
            "/api/password",
            {
                _method: "PATCH",
                old_password: oldPassword,
                new_password: newPassword,
                new_password_confirm: newPasswordConfirm
            },
            {
                headers: {
                    Authorization: "Bearer " + cookies.token
                }
            }
        ).then(response => {
            if (response.data.status) {
                setMessageContent("Your password has been changed.");
                setMessageSeverity("success");
                setUpdatedAlert(true);
            } else {
                setMessageContent("Failed to update user password.");
                setMessageSeverity("error");
                setUpdatedAlert(true);
            }
        });
    };

    if (loading)
        return (
            <Template>
                <LinearProgress />
            </Template>
        );
    else
        return (
            <Template title={"Profile"}>
                {/* <Typography variant="h4" style={{ marginBottom: 12 }}>
                Profile
            </Typography> */}
                <Grid container spacing={2}>
                    <Grid item md={3} xs={12} style={{ padding: 12 }}>
                        <Paper style={{ padding: 12 }}>
                            <Grid container>
                                <Grid item xs={12} style={{ marginBottom: 12 }}>
                                    <Grid container justify="center">
                                        <Avatar
                                            style={{ height: 50, width: 50 }}
                                        >
                                            <PersonIcon />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                                <Grid item sm={12}>
                                    <Typography variant="h6" align="center">
                                        {firstName + " " + lastName}
                                    </Typography>
                                    <Typography variant="body2" align="center">
                                        {address}
                                        {", "}
                                        {zipCode}
                                        {", "}
                                        {city}
                                        {", "}
                                        {province}
                                        <br />
                                        {country}.
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
                                    endIcon={<SyncIcon />}
                                >
                                    Regenerate
                                </Button>
                            </Grid>
                        </Paper>
                        <Paper style={{ padding: 12, marginTop: 12 }}>
                            <Typography
                                variant="subtitle2"
                                align="center"
                                style={{ marginBottom: 12 }}
                            >
                                Change User Password
                            </Typography>
                            <TextField
                                label="Old Password"
                                type="password"
                                variant="outlined"
                                size="small"
                                onChange={handleOldPassword}
                                style={{ marginBottom: 12 }}
                                fullWidth
                            />
                            <TextField
                                label="New Password"
                                type="password"
                                variant="outlined"
                                size="small"
                                onChange={handleNewPassword}
                                style={{ marginBottom: 12 }}
                                fullWidth
                            />
                            <TextField
                                label="New Password Confirmation"
                                type="password"
                                variant="outlined"
                                size="small"
                                onChange={handleNewPasswordConfirm}
                                fullWidth
                            />
                            <Grid
                                container
                                justify="flex-end"
                                style={{ marginTop: 12 }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={changePassword}
                                    endIcon={<SaveAltIcon />}
                                >
                                    Update Password
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
                                        defaultValue={firstName}
                                        variant="outlined"
                                        fullWidth
                                        onChange={event =>
                                            setFirstName(event.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6} style={{ padding: 12 }}>
                                    <TextField
                                        label="Last Name"
                                        defaultValue={lastName}
                                        variant="outlined"
                                        fullWidth
                                        onChange={event =>
                                            setLastName(event.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ paddingLeft: 12 }}>
                                    <MuiPickersUtilsProvider
                                        utils={MomentUtils}
                                    >
                                        <KeyboardDatePicker
                                            margin="normal"
                                            id="date-picker-dialog"
                                            label="Birthday"
                                            format="MMMM Do YYYY"
                                            value={birthday}
                                            onChange={handleDateChange}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} style={{ padding: 12 }}>
                                    <FormControl
                                        variant="outlined"
                                        style={{ width: "100%" }}
                                    >
                                        <InputLabel id="gender-field">
                                            Gender
                                        </InputLabel>
                                        <Select
                                            labelId="age-field"
                                            value={gender}
                                            onChange={event =>
                                                setGender(event.target.value)
                                            }
                                            label="Gender"
                                            fullWidth
                                        >
                                            <MenuItem value={0}>
                                                Female
                                            </MenuItem>
                                            <MenuItem value={1}>Male</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} style={{ padding: 12 }}>
                                    <TextField
                                        label="Address"
                                        defaultValue={address}
                                        variant="outlined"
                                        fullWidth
                                        onChange={event =>
                                            setAddress(event.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ padding: 12 }}>
                                    <TextField
                                        label="Zip Code"
                                        defaultValue={zipCode}
                                        variant="outlined"
                                        fullWidth
                                        onChange={event =>
                                            setZipCode(event.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ padding: 12 }}>
                                    <TextField
                                        label="City"
                                        defaultValue={city}
                                        variant="outlined"
                                        fullWidth
                                        onChange={event =>
                                            setCity(event.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ padding: 12 }}>
                                    <TextField
                                        label="Province"
                                        defaultValue={province}
                                        variant="outlined"
                                        fullWidth
                                        onChange={event =>
                                            setProvince(event.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ padding: 12 }}>
                                    <TextField
                                        label="Country"
                                        defaultValue={country}
                                        variant="outlined"
                                        fullWidth
                                        onChange={event =>
                                            setCountry(event.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ padding: 12 }}>
                                    <Grid container justify="flex-end">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleUpdate}
                                            endIcon={<SaveIcon />}
                                        >
                                            Save Profile
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
                <Dialog open={tokenDialogOpen} onClose={handleTokenDialogClose}>
                    <DialogTitle id="alert-dialog-title">
                        Are you sure want to regenerate token?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            After this action executed, you have to update the
                            device token setting value on your device. This
                            action is irreversible.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleTokenDialogClose}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={randomizeToken}
                            color="primary"
                            autoFocus
                        >
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    open={updatedAlert}
                    autoHideDuration={60000}
                    onClose={closeUpdatedAlert}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={closeUpdatedAlert}
                        severity={messageSeverity}
                    >
                        {messageContent}
                    </MuiAlert>
                </Snackbar>
            </Template>
        );
}

if (document.getElementById("profile")) {
    ReactDOM.render(<Profile />, document.getElementById("profile"));
}
