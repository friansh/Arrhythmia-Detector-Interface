import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/User";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

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

export default function Classified() {
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
        Axios.get("/api/data/classified", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(response => {
            console.log(response.data);
            setClassifiedData(response.data);
        });
    }, []);

    return (
        <Template title={"Classifier Result"}>
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

if (document.getElementById("classified")) {
    ReactDOM.render(<Classified />, document.getElementById("classified"));
}
