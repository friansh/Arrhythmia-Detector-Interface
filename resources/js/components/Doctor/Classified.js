import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/Doctor";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Moment from "react-moment";
import Typography from "@material-ui/core/Typography";

import LinearProgress from "@material-ui/core/LinearProgress";

import Axios from "axios";
import { useCookies } from "react-cookie";

import Classify from "../App/Classify";

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

function calculateAge(birthday) {
    // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function Classified(props) {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();

    const [classifiedData, setClassifiedData] = useState([]);
    const [patientName, setPatientName] = useState();
    const [patientAddress, setPatientAddress] = useState();
    const [patientAge, setPatientAge] = useState();
    const [patientGender, setPatientGender] = useState();

    useEffect(() => {
        console.log(props.userId);
        Axios.get("/api/data/classified/" + props.userId, {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        })
            .then(response => {
                setClassifiedData(response.data.data);

                const user = response.data.user;
                setPatientName(`${user.first_name} ${user.last_name}`);
                setPatientAddress(
                    `${user.address} ${user.city} ${user.province} ${user.country}`
                );
                setPatientAge(calculateAge(new Date(user.birthday)));
                setPatientGender(() => {
                    if (user.gender == 1) return "Male";
                    return "Female";
                });

                setClassifiedData(response.data.data);
            })
            .finally(loadDone);
    }, []);

    const [loading, setLoading] = useState(true);

    const loadDone = () => {
        setLoading(false);
    };

    if (loading)
        return (
            <Template>
                <LinearProgress />
            </Template>
        );
    else
        return (
            <Template title={"Classifier Result"} doctor={true}>
                <Typography
                    variant="h4"
                    align={"center"}
                    style={{ marginBottom: 12 }}
                >
                    User Classified Data
                </Typography>
                <Paper style={{ padding: 12, marginBottom: 12 }}>
                    <Typography variant="h5">
                        {patientName} ({patientGender}, {patientAge} years old)
                    </Typography>
                    <Typography variant="subtitle2">
                        {patientAddress}
                    </Typography>
                </Paper>
                <Paper style={{ padding: 12 }}>
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
                                {classifiedData.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {Classify(row.result)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Moment>{row.created_at}</Moment>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Template>
        );
}

let doctorClassified = document.getElementById("doctor-classified");
if (doctorClassified) {
    ReactDOM.render(
        <Classified userId={doctorClassified.dataset.userId} />,
        doctorClassified
    );
}
