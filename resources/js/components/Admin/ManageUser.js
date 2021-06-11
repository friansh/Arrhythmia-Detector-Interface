import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { useCookies } from "react-cookie";

import Template from "../App/Template/Admin";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import RefreshIcon from "@material-ui/icons/Refresh";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SearchIcon from "@material-ui/icons/Search";

import LinearProgress from "@material-ui/core/LinearProgress";

import Axios from "axios";
import MomentUtils from "@date-io/moment";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from "@material-ui/pickers";

export default function ManageUser() {
    const [cookies, setCookie] = useCookies();
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState([]);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userDelete, setUserDelete] = useState({
        id: null,
        first_name: null,
        last_name: null,
        birthday: null
    });

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

    const [dataPerPage, setDataPerPage] = useState(20);
    const [activePage, setActivePage] = useState();

    const [searchFirstName, setSearchFirstName] = useState("");
    const [searchLastName, setSearchLastName] = useState("");

    useEffect(() => {
        loadActiveUsers(1);
    }, []);

    const loadActiveUsers = page => {
        setLoading(true);
        Axios.get(`/api/user?data_per_page=${dataPerPage}&page=${page}`, {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(response => {
            setUser(response.data);
            setLoading(false);
        });
    };

    const searchUser = (firstName, lastName) => {
        Axios.get(
            `/api/admin/user/search?data_per_page=${dataPerPage}&first_name=${firstName}&last_name=${lastName}`,
            {
                headers: {
                    Authorization: `Bearer ${cookies.token}`
                }
            }
        ).then(response => {
            if (!firstName && !lastName) setDataPerPage(20);
            else setDataPerPage(100);
            setUser(response.data);
        });
    };

    const handleDeleteUser = () => {
        Axios.delete("/api/admin/user/" + userDelete.id, {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        })
            .then(response => {
                if (response.data.status) location.reload();
            })
            .catch(error => console.error(error.response));
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

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleDeleteDialogOpen = data => {
        setUserDelete(data);
        setDeleteDialogOpen(true);
    };

    const handleViewDialogClose = () => {
        setViewDialogOpen(false);
        setViewDialogLoading(true);
    };

    const handleDataPerPageChange = event => {
        setDataPerPage(event.target.value);
    };

    const handleDataPerPageSet = () => {
        setActivePage(1);
        loadActiveUsers(1);
    };

    const handleBeforePaginationClick = () => {
        let activePageAfter = activePage - 1;
        setActivePage(activePageAfter);
        loadActiveUsers(activePageAfter);
    };

    const handleNextPaginationClick = () => {
        let activePageAfter = activePage + 1;
        setActivePage(activePageAfter);
        loadActiveUsers(activePageAfter);
    };

    const handleFirstPaginationClick = () => {
        setActivePage(1);
        loadActiveUsers(1);
    };

    const handleLastPaginationClick = page => {
        setActivePage(page);
        loadActiveUsers(page);
    };

    const handleSearchFirstNameChange = event => {
        setSearchFirstName(event.target.value);
        searchUser(event.target.value, searchLastName);
    };

    const handleSearchLastNameChange = event => {
        setSearchLastName(event.target.value);
        searchUser(searchFirstName, event.target.value);
    };

    return (
        <Template title="Manage User">
            <Paper style={{ padding: 12, marginBottom: 10 }}>
                <form>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={2}>
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    alignItems: "center"
                                }}
                            >
                                <SearchIcon style={{ marginRight: 5 }} />
                                <Typography variant="subtitle2">
                                    Search for user
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="First name"
                                variant="outlined"
                                size="small"
                                onChange={handleSearchFirstNameChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Last name"
                                variant="outlined"
                                size="small"
                                onChange={handleSearchLastNameChange}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Grid container style={{ marginTop: 10, marginBottom: 10 }}>
                <Grid item xs={12} md={4}>
                    <Paper style={{ padding: 10 }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%"
                            }}
                        >
                            <Typography variant="subtitle1">
                                Data per page:
                            </Typography>
                            <TextField
                                variant="outlined"
                                size="small"
                                type="number"
                                onChange={handleDataPerPageChange}
                                value={dataPerPage}
                                style={{ marginLeft: 5, maxWidth: "75px" }}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleDataPerPageSet}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={12} md style={{ marginTop: 10 }}>
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "flex-end"
                        }}
                    >
                        <ButtonGroup
                            size="small"
                            variant="contained"
                            color="primary"
                        >
                            <Button onClick={handleFirstPaginationClick}>
                                <FirstPageIcon />
                            </Button>
                            <Button onClick={handleBeforePaginationClick}>
                                <NavigateBeforeIcon />
                            </Button>
                            <Button onClick={handleNextPaginationClick}>
                                <NavigateNextIcon />
                            </Button>

                            <Button
                                onClick={() =>
                                    handleLastPaginationClick(user.last_page)
                                }
                            >
                                <LastPageIcon />
                            </Button>
                        </ButtonGroup>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "flex-end",
                            marginTop: 5
                        }}
                    >
                        <Typography variant="caption">
                            Showing page {user.current_page} from total{" "}
                            {user.last_page} pages with {user.per_page} data per
                            page and listing data {user.from} to {user.to} from
                            total {user.total} data.
                        </Typography>
                    </div>
                </Grid>
            </Grid>
            {loading ? (
                <LinearProgress />
            ) : (
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
                            {user.data.map(row => (
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
                                                        email: row.email
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
            )}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are going to delete user{" "}
                        <b>
                            {userDelete.name} ({userDelete.email})
                        </b>
                        . This action is irreversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} color="primary">
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
