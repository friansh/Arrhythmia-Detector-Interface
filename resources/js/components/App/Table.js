import React from "react";

import Classify from "../App/Classify";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import Paper from "@material-ui/core/Paper";

import Moment from "react-moment";

export default function Cust_Table(props) {
    switch (props.column) {
        case 2:
            return (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Result</TableCell>
                                <TableCell align="right">
                                    Date and Time
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.data.map(row => (
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
            );

        case 4:
            return (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{props.columns[0]}</TableCell>
                                <TableCell>{props.columns[1]}</TableCell>
                                <TableCell align="right">
                                    {props.columns[2]}
                                </TableCell>
                                <TableCell align="right">
                                    {props.columns[3]}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.data.map(row => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.column1}
                                    </TableCell>
                                    <TableCell>{row.column2}</TableCell>
                                    <TableCell align="right">
                                        <Moment>{row.column3}</Moment>
                                    </TableCell>
                                    <TableCell align="right">
                                        <ButtonGroup
                                            variant="contained"
                                            color="primary"
                                        >
                                            <Button
                                                onClick={() =>
                                                    (window.location.href =
                                                        props.button[0].link +
                                                        row.id)
                                                }
                                            >
                                                {props.button[0].text}
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    (window.location.href =
                                                        props.button[1].link +
                                                        row.id)
                                                }
                                            >
                                                {props.button[1].text}
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    (window.location.href =
                                                        props.button[2].link +
                                                        row.id)
                                                }
                                            >
                                                {props.button[2].text}
                                            </Button>
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );

        case 5:
            break;
        default:
            return "Column data null";
    }
}
