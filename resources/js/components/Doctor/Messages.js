import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/Doctor";
import Cust_Table from "../App/Table";

import Classify from "../App/Classify";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import TimelineIcon from "@material-ui/icons/Timeline";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";

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

    useEffect(() => {
        Axios.get("/api/abnormal", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(response => {
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
        });
    }, []);

    return (
        <Template title={"User EKG Anomaly Report"}>
            <Paper style={{ padding: 12 }}>
                <Cust_Table
                    column={4}
                    data={classifiedData}
                    button={[
                        { text: <TimelineIcon />, link: "/doctor/ecg/" },
                        {
                            text: <DonutLargeIcon />,
                            link: "/doctor/classified/"
                        }
                    ]}
                    columns={["Name", "Result", "Date and Time", "View"]}
                />
            </Paper>
        </Template>
    );
}

if (document.getElementById("doctor-messages")) {
    ReactDOM.render(<Messages />, document.getElementById("doctor-messages"));
}
