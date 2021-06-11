import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { useCookies } from "react-cookie";

import Template from "../App/Template/Admin";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

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

import RefreshIcon from "@material-ui/icons/Refresh";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";

import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SearchIcon from "@material-ui/icons/Search";

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

    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewDialogLoading, setViewDialogLoading] = useState(true);
    const [doctorView, setDoctorView] = useState({
        qualification: "",
        str_number: "",
        file_number: "",
        city: ""
    });

    const [dataPerPage, setDataPerPage] = useState(20);
    const [activePage, setActivePage] = useState();

    const [searchFirstName, setSearchFirstName] = useState("");
    const [searchLastName, setSearchLastName] = useState("");

    useEffect(() => {
        loadActiveDoctor(1);
    }, []);

    const loadActiveDoctor = page => {
        setLoading(true);
        Axios.get(
            `/api/admin/doctor?data_per_page=${dataPerPage}&page=${page}`,
            {
                headers: {
                    Authorization: "Bearer " + cookies.token
                }
            }
        )
            .then(response => {
                setDoctor(response.data);
            })
            .finally(() => {
                setLoading(false);
            });
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

    const searchDoctor = (firstName, lastName) => {
        Axios.get(
            `/api/admin/doctor/search?data_per_page=${dataPerPage}&first_name=${firstName}&last_name=${lastName}`,
            {
                headers: {
                    Authorization: `Bearer ${cookies.token}`
                }
            }
        ).then(response => {
            if (!firstName && !lastName) setDataPerPage(20);
            else setDataPerPage(100);
            setDoctor(response.data);
        });
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

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleDeleteDialogOpen = data => {
        setDoctorDelete(data);
        setDeleteDialogOpen(true);
    };

    const handleViewDialogClose = () => {
        setViewDialogOpen(false);
        setViewDialogLoading(true);
    };

    const handleDataPerPageChange = event => {
        setDataPerPage(event.target.value);
    };

    const handleDataPerPageSet = event => {
        event.preventDefault();
        setActivePage(1);
        loadActiveDoctor(1);
    };

    const handleBeforePaginationClick = () => {
        let activePageAfter = activePage - 1;
        setActivePage(activePageAfter);
        loadActiveDoctor(activePageAfter);
    };

    const handleNextPaginationClick = () => {
        let activePageAfter = activePage + 1;
        setActivePage(activePageAfter);
        loadActiveDoctor(activePageAfter);
    };

    const handleFirstPaginationClick = () => {
        setActivePage(1);
        loadActiveDoctor(1);
    };

    const handleLastPaginationClick = page => {
        setActivePage(page);
        loadActiveDoctor(page);
    };

    const handleSearchFirstNameChange = event => {
        setSearchFirstName(event.target.value);
        searchDoctor(event.target.value, searchLastName);
    };

    const handleSearchLastNameChange = event => {
        setSearchLastName(event.target.value);
        searchDoctor(searchFirstName, event.target.value);
    };

    return (
        <Template title="Manage Doctor">
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
                            <form>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    onChange={handleDataPerPageChange}
                                    value={dataPerPage}
                                    style={{
                                        marginLeft: 5,
                                        maxWidth: "75px"
                                    }}
                                />
                                <IconButton
                                    color="primary"
                                    onClick={handleDataPerPageSet}
                                    type="submit"
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </form>
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
                                    handleLastPaginationClick(doctor.last_page)
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
                            Showing page {doctor.current_page} from total{" "}
                            {doctor.last_page} pages with {doctor.per_page} data
                            per page and listing data {doctor.from} to{" "}
                            {doctor.to} from total {doctor.total} data.
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
                                <TableCell>Name</TableCell>
                                <TableCell>Qualification</TableCell>
                                <TableCell>STR Number</TableCell>
                                <TableCell>File Number</TableCell>
                                <TableCell align="right">City</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {doctor.data.map(row => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.first_name + " " + row.last_name}
                                    </TableCell>
                                    <TableCell>{row.qualification}</TableCell>
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
                                                            row.first_name +
                                                            " " +
                                                            row.last_name
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
                        You are going to revoke{" "}
                        <b>{doctorDelete.name}&apos;s</b> doctor status. This
                        action is irreversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} color="primary">
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
