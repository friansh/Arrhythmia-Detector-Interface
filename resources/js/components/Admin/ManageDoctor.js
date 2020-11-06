import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { useCookies } from "react-cookie";

import Template from "../App/Template/Admin";

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

import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";

import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";

import Axios from "axios";

export default function ManageDoctor(props) {
    const [cookies, setCookie] = useCookies();
    const [loading, setLoading] = useState(true);

    const [doctor, setDoctor] = useState({});

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [doctorDelete, setDoctorDelete] = useState({
        id: null,
        name: null
    });

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleDeleteDialogOpen = data => {
        setDoctorDelete(data);
        setDeleteDialogOpen(true);
    };

    const demoteDoctor = () => {
        Axios.post(
            "/api/admin/demote/" + doctorDelete.id,
            {},
            {
                headers: {
                    Authorization: "Bearer " + cookies.token
                }
            }
        ).then(response => {
            if (response.data.status) location.reload();
        });
    };

    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewDialogLoading, setViewDialogLoading] = useState(true);
    const [doctorView, setDoctorView] = useState({
        qualification: "",
        str_number: "",
        file_number: "",
        city: ""
    });

    const handleViewDialogClose = () => {
        setViewDialogOpen(false);
        setViewDialogLoading(true);
    };

    const handleViewDialogOpen = data => {
        Axios.get("/api/admin/doctor/" + data.id, {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(response => {
            setDoctorView(response.data);
            setViewDialogLoading(false);
        });
        setViewDialogOpen(true);
    };

    useEffect(() => {
        Axios.get("/api/admin/doctor", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        })
            .then(response => {
                setDoctor(response.data.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading)
        return (
            <Template title="Manage Doctor">
                <LinearProgress />
            </Template>
        );
    else
        return (
            <Template title="Manage Doctor">
                <Paper style={{ padding: 12 }}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Qualification</TableCell>
                                    <TableCell>STR Number</TableCell>
                                    <TableCell>File Number</TableCell>
                                    <TableCell align="right">City</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {doctor.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.user.first_name +
                                                " " +
                                                row.user.last_name}
                                        </TableCell>
                                        <TableCell>
                                            {row.qualification}
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
                                                size="small"
                                            >
                                                <Button
                                                    onClick={() =>
                                                        handleViewDialogOpen({
                                                            id: row.id
                                                        })
                                                    }
                                                >
                                                    <VisibilityIcon />
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    onClick={() =>
                                                        handleDeleteDialogOpen({
                                                            id: row.id,
                                                            name:
                                                                row.user
                                                                    .first_name +
                                                                " " +
                                                                row.user
                                                                    .last_name
                                                        })
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                >
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You are going to invoke {doctorDelete.name}&apos;s
                            doctor status. This action is irreversible.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleDeleteDialogClose}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button color="primary" onClick={demoteDoctor}>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={viewDialogOpen} onClose={handleViewDialogClose}>
                    {viewDialogLoading ? <LinearProgress /> : null}
                    <DialogTitle>View Doctor Detail</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            The doctor detailed information is shown below.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Qualification"
                            type="text"
                            value={doctorView.qualification}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="STR Number"
                            type="text"
                            value={doctorView.str_number}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="File Number"
                            type="text"
                            value={doctorView.file_number}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="City"
                            type="text"
                            value={doctorView.city}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleViewDialogClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Template>
        );
}

if (document.getElementById("admin-manage-doctor")) {
    ReactDOM.render(
        <ManageDoctor />,
        document.getElementById("admin-manage-doctor")
    );
}
