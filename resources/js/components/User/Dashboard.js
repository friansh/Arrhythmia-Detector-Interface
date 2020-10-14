import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/User";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import ListIcon from "@material-ui/icons/List";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import BatteryFullIcon from "@material-ui/icons/BatteryFull";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { Doughnut } from "react-chartjs-2";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { useCookies } from "react-cookie";
import Axios from "axios";
import Moment from "react-moment";

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

    function classify(num) {
        switch (num) {
            case 0:
                return "Normal (NOR)";

            case 1:
                return "Premature Ventricular Contraction Beat (PVC)";

            case 2:
                return "Paced Beat (PAB)";

            case 3:
                return "Right Bundle Branch Block Beat (RBB)";

            case 4:
                return "Left Bundle Branch Block Beat (LBB)";

            case 5:
                return "Atrial Premature Contraction Beat (APC)";

            case 6:
                return "Ventricular Flutter Wave (VFW)";

            case 7:
                return "Premature Ventricular Contraction Beat (VEB)";

            default:
                return "Unknown";
        }
    }

    const [cookies, setCookie] = useCookies();

    const [name, setName] = useState();
    const [battery, setBattery] = useState();
    const [lastRawData, setLastRawData] = useState();
    const [lastClassifiedData, setLastClassifiedData] = useState();
    const [classifiedDataSummary, setClassifiedDataSummary] = useState();
    const [rawDataSummary, setRawDataSummary] = useState([]);

    useEffect(() => {
        Axios.get("api/data/dashboard", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(response => {
            setName(response.data.fullName);
            setBattery(response.data.battery.battery);
            setLastRawData(response.data.lastData.created_at);
            setLastClassifiedData(response.data.condition.result);
            setRawDataSummary(response.data.dataSummary);
            setClassifiedDataSummary(response.data.conditionSummary);
        });
    }, []);

    return (
        <Template fullName={name}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Paper className={classes.infoCard}>
                        <Grid
                            container
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <Typography
                                    variant="h5"
                                    className={classes.infoCardTitle}
                                    color="primary"
                                >
                                    Active User
                                </Typography>
                            </Grid>
                            <Grid item>
                                <AccountCircleIcon color="secondary" />
                            </Grid>
                        </Grid>
                        <Typography variant="h6">{name}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Paper className={classes.infoCard}>
                        <Grid
                            container
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <Typography
                                    variant="h5"
                                    className={classes.infoCardTitle}
                                    color="primary"
                                >
                                    Last Data
                                </Typography>
                            </Grid>
                            <Grid item>
                                <ListIcon color="secondary" />
                            </Grid>
                        </Grid>
                        <Typography variant="h6">
                            <Moment>{lastRawData}</Moment>
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Paper className={classes.infoCard}>
                        <Grid
                            container
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <Typography
                                    variant="h5"
                                    className={classes.infoCardTitle}
                                    color="primary"
                                >
                                    Condition
                                </Typography>
                            </Grid>
                            <Grid item>
                                <DonutLargeIcon color="secondary" />
                            </Grid>
                        </Grid>
                        <Typography variant="h6">
                            {classify(lastClassifiedData)}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Paper className={classes.infoCard}>
                        <Grid
                            container
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <Typography
                                    variant="h5"
                                    className={classes.infoCardTitle}
                                    color="primary"
                                >
                                    Battery
                                </Typography>
                            </Grid>
                            <Grid item>
                                <BatteryFullIcon color="secondary" />
                            </Grid>
                        </Grid>
                        <Typography variant="h6">{battery}%</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                    <Paper className={classes.summaryCard}>
                        <Typography
                            color="primary"
                            variant="h5"
                            className={classes.summaryTitle}
                        >
                            Data Summary
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table
                                className={classes.table}
                                aria-label="simple table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Result</TableCell>
                                        <TableCell align="right">
                                            Date and Time
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rawDataSummary.map(row => (
                                        <TableRow key={row.id}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {classify(row.result)}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Moment>
                                                    {row.created_at}
                                                </Moment>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Paper className={classes.summaryCard}>
                        <Typography
                            color="primary"
                            variant="h5"
                            className={classes.summaryTitle}
                        >
                            Condition Summary
                        </Typography>
                        <Doughnut
                            data={{
                                labels: [
                                    "NOR",
                                    "PVC",
                                    "PAB",
                                    "RBB",
                                    "LBB",
                                    "APC",
                                    "VFW",
                                    "VEB"
                                ],
                                datasets: [
                                    {
                                        data: classifiedDataSummary,
                                        backgroundColor: [
                                            "#00a152",
                                            "#b28900",
                                            "#1c54b2",
                                            "#ab003c",
                                            "#00a0b2",
                                            "#ef9a9a",
                                            "#7e57c2",
                                            "#2196f3"
                                        ]
                                    }
                                ]
                            }}
                            options={{
                                legend: {
                                    position: "bottom"
                                }
                            }}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Template>
    );
}

if (document.getElementById("dashboard")) {
    ReactDOM.render(<Dashboard />, document.getElementById("dashboard"));
}
