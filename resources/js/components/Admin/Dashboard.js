import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/Admin";
import { useCookies } from "react-cookie";
import Axios from "axios";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";

import LinearProgress from "@material-ui/core/LinearProgress";

import { Bar } from "react-chartjs-2";

export default function Dashboard(props) {
    const [cookies, setCookie] = useCookies();

    const [user, setUser] = useState({
        first_name: null,
        last_name: null,
        address: null,
        city: null,
        province: null,
        country: null,
        last_ip: null
    });

    const [summary, setSummary] = useState({
        user: null,
        doctor: null,
        applicant: null
    });

    useEffect(() => {
        Axios.get("/api/admin/dashboard", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(response => {
            setUser(response.data.user);
            setSummary(response.data.summary);
            setLoading(false);
        });
    }, []);

    const [loading, setLoading] = useState(true);

    if (loading)
        return (
            <Template>
                <LinearProgress />
            </Template>
        );
    else
        return (
            <Template fullName={name}>
                <Grid container spacing={2}>
                    <Grid item md={9} style={{ marginBottom: 12 }}>
                        <Typography variant="h5">
                            {user.first_name + " " + user.last_name}
                            <SupervisorAccountIcon />
                        </Typography>
                        <TableContainer
                            component={Paper}
                            style={{ marginBottom: 12 }}
                        >
                            <Table size="small" aria-label="a dense table">
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
                                            Address
                                        </TableCell>
                                        <TableCell align="right">
                                            {user.address}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            City
                                        </TableCell>
                                        <TableCell align="right">
                                            {user.city}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            Province
                                        </TableCell>
                                        <TableCell align="right">
                                            {user.province}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key="Berlaku Sampai">
                                        <TableCell component="th" scope="row">
                                            Country
                                        </TableCell>
                                        <TableCell align="right">
                                            {user.country}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            Last IP
                                        </TableCell>
                                        <TableCell align="right">
                                            {user.last_ip}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={3}>
                                <Paper>
                                    <Bar
                                        height={400}
                                        data={{
                                            labels: [
                                                "All User",
                                                "Doctor",
                                                "Doctor Applicants"
                                            ],
                                            datasets: [
                                                {
                                                    label: "Person",
                                                    data: [
                                                        summary.user,
                                                        summary.doctor,
                                                        summary.applicants
                                                    ],
                                                    backgroundColor: [
                                                        "rgba(255, 99, 132, 0.2)",
                                                        "rgba(54, 162, 235, 0.2)",
                                                        "rgba(255, 206, 86, 0.2)"
                                                    ],
                                                    borderColor: [
                                                        "rgba(255,99,132,1)",
                                                        "rgba(54, 162, 235, 1)",
                                                        "rgba(255, 206, 86, 1)"
                                                    ],
                                                    borderWidth: 1
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
                                                text: "User Status Summary"
                                            }
                                        }}
                                    />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6} lg={3}>
                                <Paper style={{ padding: 12 }}>
                                    <Typography variant="h6">
                                        Registered User
                                    </Typography>
                                    <Typography variant="body1" align="right">
                                        {summary.user} User
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6} lg={3}>
                                <Paper style={{ padding: 12 }}>
                                    <Typography variant="h6">
                                        Verified Doctor
                                    </Typography>
                                    <Typography variant="body1" align="right">
                                        {summary.doctor} User
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6} lg={3}>
                                <Paper style={{ padding: 12 }}>
                                    <Typography variant="h6">
                                        Doctor Applicants
                                    </Typography>

                                    <Typography variant="body1" align="right">
                                        {summary.applicants} User
                                    </Typography>
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
                            Admin role can do this action:
                            <ul>
                                <li>Manage user (search, update, delete)</li>
                                <li>See the doctor applicants table</li>
                                <li>Grant the doctor applicant</li>
                                <li>Revoke users doctor role</li>
                                <li>Do all the doctor role can do</li>
                            </ul>
                        </Typography>
                    </Grid>
                </Grid>
            </Template>
        );
}

if (document.getElementById("admin-dashboard")) {
    ReactDOM.render(<Dashboard />, document.getElementById("admin-dashboard"));
}
