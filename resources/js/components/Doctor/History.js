import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/Doctor";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useCookies } from "react-cookie";
import Axios from "axios";
import Classify from "../App/Classify";

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

export default function History(props) {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();
    const [events, setEvents] = useState([]);
    const [patientName, setPatientName] = useState();
    const [patientAddress, setPatientAddress] = useState();
    const [patientAge, setPatientAge] = useState();
    const [patientGender, setPatientGender] = useState();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(`/api/data/classified/${props.userId}`);
        Axios.get(`/api/data/classified/${props.userId}`, {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        })
            .then(response => {
                let eventBuffer = [];
                response.data.data.map(data => {
                    if (data.result != 0) {
                        let startTime = new Date(data.created_at);
                        startTime.setHours(startTime.getHours() - 1);
                        eventBuffer.push({
                            id: data.id,
                            title: Classify(data.result),
                            start: startTime,
                            end: new Date(data.created_at)
                        });
                    }
                });
                setEvents(eventBuffer);

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
            .finally(() => setLoading(false));
    }, []);

    const localizer = momentLocalizer(moment);

    if (loading)
        return (
            <Template title={"User Detection History"}>
                <LinearProgress />
            </Template>
        );
    else
        return (
            <Template title={"User Detection History"}>
                <Paper style={{ padding: 12, marginBottom: 12 }}>
                    <Typography variant="h6">
                        {patientName} ({patientGender}, {patientAge} years old)
                    </Typography>
                    <Typography variant="body2">{patientAddress}</Typography>
                </Paper>
                <Paper style={{ padding: 12 }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                    />
                </Paper>
            </Template>
        );
}

let doctorHistory = document.getElementById("doctor-history");
if (doctorHistory) {
    ReactDOM.render(
        <History userId={doctorHistory.dataset.userId} />,
        doctorHistory
    );
}
