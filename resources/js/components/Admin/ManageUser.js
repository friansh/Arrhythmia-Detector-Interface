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
import MomentUtils from "@date-io/moment";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from "@material-ui/pickers";

export default function ManageUser() {
    const [cookies, setCookie] = useCookies();
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({});

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userDelete, setUserDelete] = useState({
        id: null,
        first_name: null,
        last_name: null,
        birthday: null
    });

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleDeleteDialogOpen = data => {
        setUserDelete(data);
        setDeleteDialogOpen(true);
    };

    const handleDeleteUser = () => {
        Axios.post(
            "/api/admin/user/" + userDelete.id,
            {
                _method: "DELETE"
            },
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
    const [userEdit, setUserEdit] = useState({
        first_name: "",
        last_name: "",
        address: "",
        zip_code: "",
        city: "",
        province: "",
        country: "",
        birthday: null
    });

    const handleViewDialogClose = () => {
        setViewDialogOpen(false);
        setViewDialogLoading(true);
    };

    const handleViewDialogOpen = data => {
        Axios.get("/api/admin/user/" + data.id, {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(response => {
            setUserEdit(response.data);
            setViewDialogLoading(false);
        });
        setViewDialogOpen(true);
    };

    useEffect(() => {
        Axios.get("/api/user", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(response => {
            setUser(response.data);
            setLoading(false);
        });
    }, []);

    if (loading)
        return (
            <Template title="Manage User">
                <LinearProgress />
            </Template>
        );
    else
        return (
            <Template title="Manage User">
                <Paper style={{ padding: 12 }}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Birthday</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell align="right">Address</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {user.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.first_name}
                                        </TableCell>
                                        <TableCell>{row.last_name}</TableCell>
                                        <TableCell>
                                            {row.birthday.split(" ")[0]}
                                        </TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell align="right">
                                            {row.address}
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
                                                                row.first_name +
                                                                " " +
                                                                row.last_name,
                                                            birthday: row.birthday.split(
                                                                " "
                                                            )[0]
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
                            You are going to delete user {userDelete.name} (
                            {userDelete.birthday}). This action is irreversible.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleDeleteDialogClose}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button color="primary" onClick={handleDeleteUser}>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={viewDialogOpen} onClose={handleViewDialogClose}>
                    {viewDialogLoading ? <LinearProgress /> : null}
                    <DialogTitle>View User Detail</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            The user detailed information is shown below.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="First Name"
                            type="text"
                            value={userEdit.first_name}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Last Name"
                            type="text"
                            value={userEdit.last_name}
                            fullWidth
                        />
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Birthday"
                                format="MMMM Do YYYY"
                                value={userEdit.birthday}
                                onChange={() => {}}
                            />
                        </MuiPickersUtilsProvider>
                        <TextField
                            margin="dense"
                            label="Address"
                            type="text"
                            value={userEdit.address}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Zip Code"
                            type="text"
                            value={userEdit.zip_code}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="City"
                            type="text"
                            value={userEdit.city}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Province"
                            type="text"
                            value={userEdit.province}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            label="Country"
                            type="text"
                            value={userEdit.country}
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

if (document.getElementById("admin-manage-user")) {
    ReactDOM.render(
        <ManageUser />,
        document.getElementById("admin-manage-user")
    );
}
