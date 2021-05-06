import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/Doctor";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

import RefreshIcon from "@material-ui/icons/Refresh";

import Axios from "axios";
import moment from "moment";
import { Line } from "react-chartjs-2";
import { useCookies } from "react-cookie";

import MomentUtils from "@date-io/moment";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardTimePicker
} from "@material-ui/pickers";

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

export default function Raw(props) {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();

    const [yChart, setYChart] = useState([]);
    const [xChart, setXChart] = useState([]);

    const [patientName, setPatientName] = useState();
    const [patientAddress, setPatientAddress] = useState();
    const [patientAge, setPatientAge] = useState();
    const [patientGender, setPatientGender] = useState();

    const [loading, setLoading] = useState(true);

    const [date, setDate] = useState(() => {
        let dateW = new Date();
        return moment(dateW).format("YYYY-MM-DD");
    });

    const [startTime, setStartTime] = useState(() => {
        let startTimeW = new Date();
        startTimeW.setMinutes(startTimeW.getMinutes() - 10);

        return moment(startTimeW).format("HH:mm:ss");
    });

    const [endTime, setEndTime] = useState(() => {
        let endTimeW = new Date();

        return moment(endTimeW).format("HH:mm:ss");
    });

    useEffect(() => {
        loadECGData();
    }, []);

    const loadECGData = () => {
        console.log(
            `/api/data/raw/${props.userId}?date=${date}&start_time=${startTime}&end_time=${endTime}`
        );
        Axios.get(
            `/api/data/raw/${props.userId}?date=${date}&start_time=${startTime}&end_time=${endTime}`,
            {
                headers: {
                    Authorization: "Bearer " + cookies.token
                }
            }
        )
            .then(response => {
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

                let rawData = [];
                let rawTime = [];
                response.data.data.map(d => {
                    rawData.push(d.data);
                    rawTime.push(moment(d.created_at).format("HH:mm:ss"));
                });
                setYChart(rawData);
                setXChart(rawTime);
            })
            .finally(() => setLoading(false));
    };

    const handleStartTimeChange = time => {
        setStartTime(moment(time).format("HH:mm:ss"));
    };

    const handleEndTimeChange = time => {
        setEndTime(moment(time).format("HH:mm:ss"));
    };

    const handleDateChange = date => {
        setDate(moment(date).format("YYYY-MM-DD"));
    };

    return (
        <Template title={"User ECG"}>
            <Typography
                variant="h4"
                align={"center"}
                style={{ marginBottom: 12 }}
            >
                User Electrocardiogram Data
            </Typography>
            {loading ? null : (
                <Paper style={{ padding: 12, marginBottom: 12 }}>
                    <Typography variant="h5">
                        {patientName} ({patientGender}, {patientAge} years old)
                    </Typography>
                    <Typography variant="subtitle2">
                        {patientAddress}
                    </Typography>
                </Paper>
            )}
            <Paper style={{ padding: 12, marginBottom: 10 }}>
                <Typography variant="subtitle1">Select time window:</Typography>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                        format="DD/MM/yyyy"
                        margin="dense"
                        label="Date"
                        style={{ marginRight: 10 }}
                        value={new Date(date)}
                        onChange={handleDateChange}
                    />
                    <KeyboardTimePicker
                        margin="dense"
                        label="Start Time"
                        views={["hours", "minutes", "seconds"]}
                        format="HH:mm:ss"
                        style={{ marginRight: 10 }}
                        value={new Date(`2000-01-01:${startTime}`)}
                        onChange={handleStartTimeChange}
                    />
                    <KeyboardTimePicker
                        margin="dense"
                        label="End Time"
                        views={["hours", "minutes", "seconds"]}
                        format="HH:mm:ss"
                        value={new Date(`2000-01-01:${endTime}`)}
                        onChange={handleEndTimeChange}
                    />
                </MuiPickersUtilsProvider>
                <div
                    style={{
                        height: "100%",
                        display: "flex",
                        alignContent: "flex-end"
                    }}
                >
                    <Button
                        startIcon={<RefreshIcon />}
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginTop: 10 }}
                        onClick={loadECGData}
                    >
                        Refresh
                    </Button>
                </div>
            </Paper>
            {loading ? (
                <LinearProgress />
            ) : (
                <Paper style={{ padding: 12 }}>
                    <Line
                        data={{
                            labels: xChart,
                            datasets: [
                                {
                                    data: yChart,
                                    lineTension: 0,
                                    borderColor: "#ba000d",
                                    fill: false
                                }
                            ]
                        }}
                        options={{
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: "ECG Raw Data History"
                            },
                            // scales: {
                            //     xAxes: [
                            //         {
                            //             ticks: {
                            //                 display: false
                            //             }
                            //         }
                            //     ]
                            // },
                            elements: {
                                point: {
                                    radius: 0
                                }
                            }
                        }}
                    />
                </Paper>
            )}
        </Template>
    );
}

let doctorRaw = document.getElementById("doctor-raw");
if (doctorRaw) {
    ReactDOM.render(<Raw userId={doctorRaw.dataset.userId} />, doctorRaw);
}
