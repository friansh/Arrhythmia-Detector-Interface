import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/Doctor";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { Doughnut } from "react-chartjs-2";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { useCookies } from "react-cookie";
import Axios from "axios";
import Moment from "react-moment";

import TextField from "@material-ui/core/TextField";

import LinearProgress from "@material-ui/core/LinearProgress";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SearchIcon from "@material-ui/icons/Search";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import Classify from "../App/Classify";

const useStyles = makeStyles(theme => ({
    table: {},
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

export default function Dashboard(props) {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();

    const [name, setName] = useState();
    const [doctor, setDoctor] = useState({
        qualification: null,
        str_number: null,
        file_number: null,
        application_date: null,
        valid_until: null,
        city: null
    });

    const [user, setUser] = useState({
        first_name: null,
        last_name: null
    });

    const [userCount, setUserCount] = useState();
    const [abnormalCount, setAbnormalCount] = useState();

    let firstName = null;
    let lastName = null;

    function firstNameChange(event) {
        firstName = event.target.value;
        searchUser();
    }

    function lastNameChange(event) {
        lastName = event.target.value;
        searchUser();
    }

    function searchUser() {
        if (
            firstName != "" ||
            lastName != "" ||
            firstName != null ||
            lastName != null
        ) {
            Axios.post(
                "/api/user/search",
                {
                    first_name: firstName,
                    last_name: lastName
                },
                {
                    headers: {
                        Authorization: "Bearer " + cookies.token
                    }
                }
            ).then(response => {
                console.log("Searching for: " + firstName + " " + lastName);
                setUsersFound(response.data);
            });
        }
    }

    const [usersFound, setUsersFound] = useState([]);

    function getAbnormal() {
        Axios.get("/api/abnormal", {
            headers: {
                Authorization: "Bearer " + cookies.token
            },
            params: {
                count: 1
            }
        }).then(response => {
            setAbnormalCount(response.data.data.count);
        });
    }

    const notifSound = new Audio("/sound/notification.wav");
    const [anomalyDetected, setAnomalyDetected] = useState({
        result: null,
        user: {
            first_name: null,
            last_name: null
        }
    });

    useEffect(() => {
        Axios.get("api/doctor/dashboard", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        })
            .then(response => {
                setUser(response.data.user);
                setDoctor(response.data.doctor);
                setUserCount(response.data.summary.user);
            })
            .finally(() => setLoading(false));

        getAbnormal();

        Echo.private("classified-anomaly").listen(".detected", e => {
            setAnomalyDetected(e);
            notifSound.play();
            setOpen(true);
        });
    }, []);

    const [open, setOpen] = React.useState(false);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const [loading, setLoading] = useState(true);

    if (loading)
        return (
            <Template>
                <LinearProgress />
            </Template>
        );
    else
        return (
            <Template>
                <Grid container spacing={2}>
                    <Grid item md={9} style={{ marginBottom: 12 }}>
                        <Typography variant="h5">
                            {user.first_name + " " + user.last_name}
                            <VerifiedUserIcon />
                        </Typography>
                        <TableContainer
                            component={Paper}
                            style={{ marginBottom: 12 }}
                        >
                            <Table
                                className={classes.table}
                                size="small"
                                aria-label="a dense table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Parameter</TableCell>
                                        <TableCell align="right">
                                            Data
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            Qualification
                                        </TableCell>
                                        <TableCell align="right">
                                            {doctor.qualification}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            STR Number
                                        </TableCell>
                                        <TableCell align="right">
                                            {doctor.str_number}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            File Number
                                        </TableCell>
                                        <TableCell align="right">
                                            {doctor.file_number}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key="Berlaku Sampai">
                                        <TableCell component="th" scope="row">
                                            Application Date
                                        </TableCell>
                                        <TableCell align="right">
                                            <Moment format="DD MMMM YYYY">
                                                {doctor.application_date}
                                            </Moment>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            Valid Until
                                        </TableCell>
                                        <TableCell align="right">
                                            <Moment format="DD MMMM YYYY">
                                                {doctor.valid_until}
                                            </Moment>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            City/District
                                        </TableCell>
                                        <TableCell align="right">
                                            {doctor.city}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Grid container spacing={2}>
                            <Grid item md={6}>
                                <Paper>
                                    <Doughnut
                                        data={{
                                            labels: ["Normal", "Abnormal"],
                                            datasets: [
                                                {
                                                    data: [
                                                        userCount -
                                                            abnormalCount,
                                                        abnormalCount
                                                    ],
                                                    backgroundColor: [
                                                        "#8bc34a",
                                                        "#ff5722"
                                                    ]
                                                }
                                            ]
                                        }}
                                        options={{
                                            legend: {
                                                position: "bottom"
                                            },
                                            title: {
                                                display: true,
                                                position: "top",
                                                text: "User Condition Summary"
                                            }
                                        }}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper
                                    component={Paper}
                                    style={{ padding: 12 }}
                                >
                                    <Typography
                                        variant="h6"
                                        style={{ marginBottom: 5 }}
                                    >
                                        <SearchIcon /> Search for user
                                        classified data
                                    </Typography>

                                    <Grid container spacing={1}>
                                        <Grid item lg={6}>
                                            <TextField
                                                label="First Name"
                                                onChange={event =>
                                                    firstNameChange(event)
                                                }
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item lg={6}>
                                            <TextField
                                                label="Last Name"
                                                onChange={event =>
                                                    lastNameChange(event)
                                                }
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>

                                    <List
                                        component="nav"
                                        className={classes.root}
                                        aria-label="contacts"
                                    >
                                        {usersFound.map(data => (
                                            <ListItem
                                                button
                                                key={data.id}
                                                onClick={() =>
                                                    (window.location.href =
                                                        "/doctor/classified/" +
                                                        data.id)
                                                }
                                            >
                                                <ListItemIcon>
                                                    <AccountBoxIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        data.first_name +
                                                        " " +
                                                        data.last_name
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={3}
                        component={Paper}
                        style={{ padding: 12 }}
                    >
                        <Typography
                            variant="h6"
                            align="center"
                            style={{ marginBottom: 6 }}
                        >
                            Help
                        </Typography>
                        <Typography component="span" variant="body2">
                            Doctor roles can do this action:
                            <ul>
                                <li>
                                    See raw ECG data from a user in abnormal
                                    data table
                                </li>
                                <li>
                                    See classified ECG data from a user in
                                    abnormal data table
                                </li>
                                <li>Search for all user classified ECG data</li>
                                <li>
                                    Get notification for user that has abnormal
                                    ECG data
                                </li>
                            </ul>
                        </Typography>
                    </Grid>
                </Grid>
                <Snackbar
                    open={open}
                    autoHideDuration={60000}
                    onClose={handleClose}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={handleClose}
                        severity="error"
                    >
                        Arrythmia type{" "}
                        {Classify(parseInt(anomalyDetected.result))} detected on
                        user{" "}
                        {anomalyDetected.user.first_name +
                            " " +
                            anomalyDetected.user.last_name}
                        ! Click the message icon to see the details.
                    </MuiAlert>
                </Snackbar>
            </Template>
        );
}

if (document.getElementById("doctor-dashboard")) {
    ReactDOM.render(<Dashboard />, document.getElementById("doctor-dashboard"));
}
