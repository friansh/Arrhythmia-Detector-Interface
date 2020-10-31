import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/User";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";

import { Line } from "react-chartjs-2";
import Axios from "axios";
import { useCookies } from "react-cookie";

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

export default function Raw() {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();

    const [yChart, setYChart] = useState([]);
    const [xChart, setXChart] = useState([]);

    useEffect(() => {
        Axios.get("/api/data/raw", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        })
            .then(response => {
                let rawData = [];
                let rawTime = [];
                response.data.map(d => {
                    rawData.push(d.data);
                    rawTime.push(moment(d.created_at).format("h:mm:ss"));
                });
                setYChart(rawData);
                setXChart(rawTime);
            })
            .finally(loadDone);
    }, []);

    // setTimeout(
    //     Axios.get("/api/data/raw", {
    //         headers: {
    //             Authorization: "Bearer " + cookies.token
    //         }
    //     }).then(response => {
    //         let rawData = [];
    //         let rawTime = [];
    //         response.data.map(d => {
    //             rawData.push(d.data);
    //             rawTime.push(moment(d.created_at).format("h:mm:ss"));
    //         });
    //         setYChart(rawData);
    //         setXChart(rawTime);
    //     }),
    //     1000
    // );

    const [loading, setLoading] = useState(true);

    const loadDone = () => {
        setLoading(false);
    };

    if (loading)
        return (
            <Template>
                <LinearProgress />
            </Template>
        );
    else
        return (
            <Template title={"Raw Data"}>
                {/* <Typography variant="h4">User Raw Data</Typography>
            <Paper style={{ padding: 12, marginBottom: 12 }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" href="/user">
                        Dashboard
                    </Link>
                    <Typography color="textPrimary">User Raw Data</Typography>
                </Breadcrumbs>
            </Paper> */}
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

if (document.getElementById("raw")) {
    ReactDOM.render(<Raw />, document.getElementById("raw"));
}
