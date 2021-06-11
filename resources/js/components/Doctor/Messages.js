import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/Doctor";
import Cust_Table from "../App/Table";

import Classify from "../App/Classify";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

import TimelineIcon from "@material-ui/icons/Timeline";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import DateRangeIcon from "@material-ui/icons/DateRange";

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

export default function Messages() {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();
    const [classifiedData, setClassifiedData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Axios.get("/api/abnormal", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        })
            .then(response => {
                let buffer = [];
                response.data.data.map(d => {
                    buffer.push({
                        id: d.user.id,
                        column1: d.user.name,
                        column2: Classify(d.classified.result),
                        column3: d.classified.created_at
                    });
                });

                console.log(buffer);
                setClassifiedData(buffer);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return (
            <Template title={"User ECG Anomaly Report"}>
                <LinearProgress />
            </Template>
        );
    else
        return (
            <Template title={"User ECG Anomaly Report"}>
                <Cust_Table
                    column={4}
                    data={classifiedData}
                    button={[
                        { text: <TimelineIcon />, link: "/doctor/ecg/" },
                        {
                            text: <DonutLargeIcon />,
                            link: "/doctor/classified/"
                        },
                        {
                            text: <DateRangeIcon />,
                            link: "/doctor/history/"
                        }
                    ]}
                    columns={["Name", "Result", "Date and Time", "View"]}
                />
            </Template>
        );
}

if (document.getElementById("doctor-messages")) {
    ReactDOM.render(<Messages />, document.getElementById("doctor-messages"));
}
