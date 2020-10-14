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

import Axios from "axios";
import { useCookies } from "react-cookie";

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

export default function Classified(props) {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();

    const [classifiedData, setClassifiedData] = useState([]);
    const [patientName, setPatientName] = useState();
    const [patientAddress, setPatientAddress] = useState();

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

    useEffect(() => {
        console.log(props.userId);
        Axios.get("/api/data/classified/" + props.userId, {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(response => {
            console.log(response.data.data);
            setClassifiedData(response.data.data);
            setPatientName(
                response.data.user.first_name +
                    " " +
                    response.data.user.last_name
            );
            setPatientAddress(
                response.data.user.address +
                    " " +
                    response.data.user.city +
                    " " +
                    response.data.user.province +
                    " " +
                    response.data.user.country
            );
        });
    }, []);

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
                <Typography variant="h5">{patientName}</Typography>
                <Typography variant="subtitle2">{patientAddress}</Typography>
            </Paper>
            <Paper style={{ padding: 12 }}>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
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
                                        {classify(row.result)}
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
