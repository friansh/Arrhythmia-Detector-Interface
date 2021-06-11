import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/Admin";
import { useCookies } from "react-cookie";

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
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";

import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";

import Axios from "axios";

export default function Promote(props) {
    const [cookies, setCookie] = useCookies();

    const [applicants, setApplicants] = useState([]);

    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const [candidate, setCandidate] = useState([]);

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

    const [dataPerPage, setDataPerPage] = useState(20);
    const [activePage, setActivePage] = useState();

    const [searchFirstName, setSearchFirstName] = useState("");
    const [searchLastName, setSearchLastName] = useState("");

    useEffect(() => {
        loadActiveDoctorCandidate(1);
    }, []);

    const loadActiveDoctorCandidate = page => {
        Axios.get(
            `/api/admin/applicant?data_per_page=${dataPerPage}&page=${page}`,
            {
                headers: {
                    Authorization: "Bearer " + cookies.token
                }
            }
        )
            .then(response => {
                setApplicants(response.data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const searchDoctorApplicant = (firstName, lastName) => {
        Axios.get(
            `/api/admin/applicant/search?data_per_page=${dataPerPage}&first_name=${firstName}&last_name=${lastName}`,
            {
                headers: {
                    Authorization: `Bearer ${cookies.token}`
                }
            }
        ).then(response => {
            if (!firstName && !lastName) setDataPerPage(20);
            else setDataPerPage(100);
            setApplicants(response.data);
        });
    };

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
            if (response.data.status) location.reload();
        });
    };

    const rejectApplicant = () => {
        Axios.delete("/api/admin/doctor/" + candidate.user_id, {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(response => {
            if (response.data.status) location.reload();
        });
    };

    const handleClickOpen = candidate => {
        setCandidate(candidate);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRejectDialogOpen = candidate => {
        setCandidate(candidate);
        setRejectDialogOpen(true);
    };

    const handleRejectDialogClose = () => {
        setRejectDialogOpen(false);
    };

    const handleDataPerPageChange = event => {
        setDataPerPage(event.target.value);
    };

    const handleDataPerPageSet = event => {
        event.preventDefault();
        setActivePage(1);
        loadActiveDoctorCandidate(1);
    };

    const handleBeforePaginationClick = () => {
        let activePageAfter = activePage - 1;
        setActivePage(activePageAfter);
        loadActiveDoctorCandidate(activePageAfter);
    };

    const handleNextPaginationClick = () => {
        let activePageAfter = activePage + 1;
        setActivePage(activePageAfter);
        loadActiveDoctorCandidate(activePageAfter);
    };

    const handleFirstPaginationClick = () => {
        setActivePage(1);
        loadActiveDoctorCandidate(1);
    };

    const handleLastPaginationClick = page => {
        setActivePage(page);
        loadActiveDoctorCandidate(page);
    };

    const handleSearchFirstNameChange = event => {
        setSearchFirstName(event.target.value);
        searchDoctorApplicant(event.target.value, searchLastName);
    };

    const handleSearchLastNameChange = event => {
        setSearchLastName(event.target.value);
        searchDoctorApplicant(searchFirstName, event.target.value);
    };

    return (
        <Template title="Verify Doctor Applicant">
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
                                    handleLastPaginationClick(
                                        candidate.last_page
                                    )
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
                            Showing page {candidate.current_page} from total{" "}
                            {candidate.last_page} pages with{" "}
                            {candidate.per_page} data per page and listing data{" "}
                            {candidate.from} to {candidate.to} from total{" "}
                            {candidate.total} data.
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
                                <TableCell>STR Number</TableCell>
                                <TableCell>File Number</TableCell>
                                <TableCell align="right">City</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {applicants.data.map(row => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.first_name} {row.last_name}
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
                                                    handleClickOpen({
                                                        str_number:
                                                            row.str_number,
                                                        name:
                                                            row.first_name +
                                                            " " +
                                                            row.last_name,
                                                        user_id: row.id
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
                                                            row.first_name +
                                                            " " +
                                                            row.last_name,
                                                        user_id: row.id
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
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You are going to promote <b>{candidate.name}</b> with
                        STR number <b>{candidate.str_number}</b> to be a doctor
                        role
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={verifyCandidate} color="primary" autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={rejectDialogOpen} onClose={handleRejectDialogClose}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You are going to reject{" "}
                        <b>
                            {candidate.name} ({candidate.str_number})
                        </b>{" "}
                        doctor applicant. This action is irreversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRejectDialogClose} color="primary">
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
