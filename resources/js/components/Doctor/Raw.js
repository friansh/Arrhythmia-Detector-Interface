import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/Doctor";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import { Line } from "react-chartjs-2";
import Axios from "axios";
import { useCookies } from "react-cookie";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

import moment from "moment";

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

export default function Raw(props) {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();

    const [yChart, setYChart] = useState([]);
    const [xChart, setXChart] = useState([]);

    const [patientName, setPatientName] = useState();
    const [patientAddress, setPatientAddress] = useState();

    useEffect(() => {
        Axios.get("/api/data/raw/" + props.userId, {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(response => {
            let rawData = [];
            let rawTime = [];
            response.data.data.map(d => {
                rawData.push(d.data);
                rawTime.push(moment(d.created_at).format("h:mm:ss"));
            });
            setPatientName(
                response.data.user.first_name +
                    " " +
                    response.data.user.last_name
            );
            setPatientAddress(
                response.data.user.address +
                    " " +
                    response.data.user.city +
                    " " +
                    response.data.user.province +
                    " " +
                    response.data.user.country
            );
            setYChart(rawData);
            setXChart(rawTime);
        });
    }, []);

    return (
        <Template title={"Raw Data"}>
            <Typography
                variant="h4"
                align={"center"}
                style={{ marginBottom: 12 }}
            >
                User Raw Data
            </Typography>
            <Paper style={{ padding: 12, marginBottom: 12 }}>
                <Typography variant="h5">{patientName}</Typography>
                <Typography variant="subtitle2">{patientAddress}</Typography>
            </Paper>
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
        </Template>
    );
}

let doctorRaw = document.getElementById("doctor-raw");
if (doctorRaw) {
    ReactDOM.render(<Raw userId={doctorRaw.dataset.userId} />, doctorRaw);
}
