import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/User";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useCookies } from "react-cookie";
import Axios from "axios";

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

export default function History() {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();
    const [events, setEvents] = useState([
        {
            id: 11,
            title: "Birthday Party",
            start: new Date(2020, 8, 7, 16, 0, 0),
            end: new Date(2020, 8, 7, 17, 0, 0)
        }
    ]);

    useEffect(() => {
        Axios.get("/api/data/classified", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        })
            .then(response => {
                let eventBuffer = [];
                response.data.map(data => {
                    if (data.result != 0) {
                        let startTime = new Date(data.created_at);
                        startTime.setMinutes(startTime.getMinutes() - 10);
                        eventBuffer.push({
                            id: data.id,
                            title: data.classification_result,
                            start: startTime,
                            end: new Date(data.created_at)
                        });
                    }
                });
                console.log(eventBuffer);
                setEvents(eventBuffer);
            })
            .finally(loadDone);
    }, []);

    // const events = [
    //     {
    //         id: 0,
    //         title: "Board meeting",
    //         start: new Date(2018, 0, 29, 9, 0, 0),
    //         end: new Date(2018, 0, 29, 13, 0, 0)
    //     },
    //     {
    //         id: 1,
    //         title: "MS training",
    //         start: new Date(2020, 8, 7, 14, 0, 0),
    //         end: new Date(2020, 8, 7, 15, 0, 0)
    //     },
    //     {
    //         id: 2,
    //         title: "Team lead meeting",
    //         start: new Date(2020, 8, 7, 15, 0, 0),
    //         end: new Date(2020, 8, 7, 16, 0, 0)
    //     },
    //     {
    //         id: 11,
    //         title: "Birthday Party",
    //         start: new Date(2020, 8, 7, 16, 0, 0),
    //         end: new Date(2020, 8, 7, 17, 0, 0)
    //     }
    // ];

    const localizer = momentLocalizer(moment);

    const [loading, setLoading] = useState(true);

    const loadDone = () => {
        setLoading(false);
    };

    if (loading)
        return (
            <Template title={"Detection History"}>
                <LinearProgress />
            </Template>
        );
    else
        return (
            <Template title={"Detection History"}>
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

if (document.getElementById("history")) {
    ReactDOM.render(<History />, document.getElementById("history"));
}
