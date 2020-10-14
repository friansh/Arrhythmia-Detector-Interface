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

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import Moment from "react-moment";

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

export default function Messages() {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();
    const [classifiedData, setClassifiedData] = useState([]);

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
        Axios.get("/api/abnormal", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(response => {
            console.log(response.data.data);
            setClassifiedData(response.data.data);
        });
    }, []);

    return (
        <Template title={"User EKG Anomaly Report"}>
            <Paper style={{ padding: 12 }}>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Result</TableCell>
                                <TableCell align="right">
                                    Date and Time
                                </TableCell>
                                <TableCell>View</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {classifiedData.map(row => (
                                <TableRow key={row.classified.id}>
                                    <TableCell component="th" scope="row">
                                        {row.user.name}
                                    </TableCell>
                                    <TableCell>
                                        {classify(row.classified.result)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Moment>
                                            {row.classified.created_at}
                                        </Moment>
                                    </TableCell>
                                    <TableCell>
                                        <ButtonGroup
                                            variant="contained"
                                            color="primary"
                                            aria-label="contained primary button group"
                                        >
                                            <Button
                                                onClick={() =>
                                                    (window.location.href =
                                                        "/doctor/raw/" +
                                                        row.user.id)
                                                }
                                            >
                                                Raw
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    (window.location.href =
                                                        "/doctor/classified/" +
                                                        row.user.id)
                                                }
                                            >
                                                Classifieds
                                            </Button>
                                        </ButtonGroup>
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

if (document.getElementById("doctor-messages")) {
    ReactDOM.render(<Messages />, document.getElementById("doctor-messages"));
}
