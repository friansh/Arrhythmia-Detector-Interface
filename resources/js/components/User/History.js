import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/User";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

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

    function classify(num) {
        switch (num) {
            case 0:
                return "Normal (NOR)";

            case 1:
                return "Premature Ventricular Contraction Beat (PVC)";

            case 2:
                return "Paced Beat (PAB)";

            case 3:
                return "Right Bundle Branch Block Beat (RBB)";

            case 4:
                return "Left Bundle Branch Block Beat (LBB)";

            case 5:
                return "Atrial Premature Contraction Beat (APC)";

            case 6:
                return "Ventricular Flutter Wave (VFW)";

            case 7:
                return "Premature Ventricular Contraction Beat (VEB)";

            default:
                return "Unknown";
        }
    }

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
        }).then(response => {
            let eventBuffer = [];
            response.data.map(data => {
                let startTime = new Date(data.created_at);
                startTime.setHours(startTime.getHours() - 1);
                eventBuffer.push({
                    id: data.id,
                    title: classify(data.result),
                    start: 0,
                    start: startTime,
                    end: new Date(data.created_at)
                });
            });
            console.log(eventBuffer);
            setEvents(eventBuffer);
        });
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
