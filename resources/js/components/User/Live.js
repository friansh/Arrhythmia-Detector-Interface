import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import Template from "../App/Template/User";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";

import { Line } from "react-chartjs-2";
import io from "socket.io-client";

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

export default function LivePage(props) {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();

    const [yChart, setYChart] = useState([]);
    const [xChart, setXChart] = useState([]);

    useEffect(() => {
        const socket = io.connect("http://localhost:7999");
        console.log("connected to socket io");
        socket.on("ceksocketio", data => {
            const ecgData = JSON.parse(data);
            setYChart(ecgData);

            let index = [];
            for (let i = 0; i < ecgData.length; i++) {
                index.push(i + 1);
            }

            setXChart(index);
            console.log(ecgData);
        });
    }, []);

    return (
        <Template title={"Live ECG"}>
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
                            text: "ECG Data Graph"
                        },
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

if (document.getElementById("live")) {
    ReactDOM.render(<LivePage />, document.getElementById("live"));
}
