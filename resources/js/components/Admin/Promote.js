import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/Admin";
import { useCookies } from "react-cookie";

import Paper from "@material-ui/core/Paper";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import LinearProgress from "@material-ui/core/LinearProgress";

import Axios from "axios";

export default function Promote(props) {
    const [cookies, setCookie] = useCookies();

    const [applicants, setApplicants] = useState([
        {
            id: null,
            str_number: null,
            city: null,
            user: {
                first_name: null,
                last_name: null
            }
        }
    ]);

    useEffect(() => {
        Axios.get("/api/admin/applicant", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        })
            .then(response => {
                setApplicants(response.data.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const verifyCandidate = () => {
        Axios.post(
            "/api/admin/promote/" + candidate.user_id,
            {},
            {
                headers: {
                    Authorization: "Bearer " + cookies.token
                }
            }
        ).then(response => {
            console.log(response.data);
            if (response.data.status) location.reload();
        });
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = candidate => {
        setCandidate(candidate);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [candidate, setCandidate] = useState({
        str_number: null,
        name: null,
        user_id: null
    });

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

    const handleRejectDialogOpen = candidate => {
        setCandidate(candidate);
        setRejectDialogOpen(true);
    };

    const handleRejectDialogClose = () => {
        setRejectDialogOpen(false);
    };

    const rejectApplicant = () => {
        Axios.post(
            "/api/admin/doctor/" + candidate.user_id,
            {
                _method: "DELETE"
            },
            {
                headers: {
                    Authorization: "Bearer " + cookies.token
                }
            }
        ).then(response => {
            console.log(response.data);
            if (response.data.status) location.reload();
        });
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
            <Template title="Verify Doctor Applicant">
                <Paper style={{ padding: 12 }}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>STR Number</TableCell>
                                    <TableCell>File Number</TableCell>
                                    <TableCell align="right">City</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {applicants.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.user.first_name +
                                                " " +
                                                row.user.last_name}
                                        </TableCell>
                                        <TableCell>{row.str_number}</TableCell>
                                        <TableCell>{row.file_number}</TableCell>
                                        <TableCell align="right">
                                            {row.city}
                                        </TableCell>
                                        <TableCell>
                                            <ButtonGroup
                                                variant="contained"
                                                color="primary"
                                            >
                                                <Button
                                                    onClick={() =>
                                                        handleClickOpen({
                                                            str_number:
                                                                row.str_number,
                                                            name:
                                                                row.user
                                                                    .first_name +
                                                                " " +
                                                                row.user
                                                                    .last_name,
                                                            user_id: row.user.id
                                                        })
                                                    }
                                                >
                                                    <CheckIcon />
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    onClick={() =>
                                                        handleRejectDialogOpen({
                                                            str_number:
                                                                row.str_number,
                                                            name:
                                                                row.user
                                                                    .first_name +
                                                                " " +
                                                                row.user
                                                                    .last_name,
                                                            user_id: row.user.id
                                                        })
                                                    }
                                                >
                                                    <ClearIcon />
                                                </Button>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle id="alert-dialog-title">
                        Are you sure?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You are going to promote {candidate.name} with STR
                            number {candidate.str_number} to be a doctor role
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={verifyCandidate}
                            color="primary"
                            autoFocus
                        >
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={rejectDialogOpen}
                    onClose={handleRejectDialogClose}
                >
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You are going to reject {candidate.name} (
                            {candidate.str_number}) doctor applicants. This
                            action is irreversible.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleRejectDialogClose}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button color="primary" onClick={rejectApplicant}>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Template>
        );
}

if (document.getElementById("promote")) {
    ReactDOM.render(<Promote />, document.getElementById("promote"));
}
