import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/Doctor";
import Cust_Table from "../App/Table";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import RefreshIcon from "@material-ui/icons/Refresh";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";

import LinearProgress from "@material-ui/core/LinearProgress";

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

function calculateAge(birthday) {
    // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function Classified(props) {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();

    const [classifiedData, setClassifiedData] = useState({ data: [] });
    const [patientName, setPatientName] = useState();
    const [patientAddress, setPatientAddress] = useState();
    const [patientAge, setPatientAge] = useState();
    const [patientGender, setPatientGender] = useState();

    const [dataPerPage, setDataPerPage] = useState(20);
    const [activePage, setActivePage] = useState();

    const [loading, setLoading] = useState(true);
    const [firstLoading, setFirstLoading] = useState(true);

    useEffect(() => {
        loadActiveClassifieds(1, true);
    }, []);

    const loadActiveClassifieds = (page, first) => {
        setLoading(true);
        Axios.get(
            `/api/data/classified/${props.userId}?data_per_page=${dataPerPage}&page=${page}`,
            {
                headers: {
                    Authorization: "Bearer " + cookies.token
                }
            }
        )
            .then(response => {
                setClassifiedData(response.data.data);
                const user = response.data.user;
                setPatientName(`${user.first_name} ${user.last_name}`);
                setPatientAddress(
                    `${user.address} ${user.city} ${user.province} ${user.country}`
                );
                setPatientAge(calculateAge(new Date(user.birthday)));
                setPatientGender(() => {
                    if (user.gender == 1) return "Male";
                    return "Female";
                });
            })
            .finally(() => {
                setLoading(false);
                if (first) setFirstLoading(false);
            });
    };

    const handleDataPerPageChange = event => {
        setDataPerPage(event.target.value);
    };

    const handleDataPerPageSet = () => {
        setActivePage(1);
        loadActiveClassifieds(1);
    };

    const handleBeforePaginationClick = () => {
        let activePageAfter = activePage - 1;
        setActivePage(activePageAfter);
        loadActiveClassifieds(activePageAfter);
    };

    const handleNextPaginationClick = () => {
        let activePageAfter = activePage + 1;
        setActivePage(activePageAfter);
        loadActiveClassifieds(activePageAfter);
    };

    const handleFirstPaginationClick = () => {
        setActivePage(1);
        loadActiveClassifieds(1);
    };

    const handleLastPaginationClick = page => {
        setActivePage(page);
        loadActiveClassifieds(page);
    };

    return (
        <Template title={"User Classified History"} doctor={true}>
            <Paper style={{ padding: 12, marginBottom: 12 }}>
                {firstLoading ? null : (
                    <React.Fragment>
                        <Typography variant="h6">
                            {patientName} ({patientGender}, {patientAge} years
                            old)
                        </Typography>
                        <Typography variant="body2">
                            {patientAddress}
                        </Typography>
                    </React.Fragment>
                )}
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
                                    handleLastPaginationClick(
                                        classifiedData.last_page
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
                            Showing page {classifiedData.current_page} from
                            total {classifiedData.last_page} pages with{" "}
                            {classifiedData.per_page} data per page and listing
                            data {classifiedData.from} to {classifiedData.to}{" "}
                            from total {classifiedData.total} data.
                        </Typography>
                    </div>
                </Grid>
            </Grid>

            {loading ? (
                <LinearProgress />
            ) : (
                <Cust_Table column={2} data={classifiedData.data} />
            )}
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
