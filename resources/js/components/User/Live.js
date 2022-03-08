import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import Template from "../App/Template/User";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

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
    },
    table: {
        minWidth: 650
    }
}));

export default function LivePage(props) {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();

    const [yChart, setYChart] = useState([]);
    const [xChart, setXChart] = useState([]);

    const [segmentAnalysis, setSegmentAnalysis] = useState({
        rr: {
            val: 0,
            stdev: 0
        },
        pr: {
            val: 0,
            stdev: 0
        },
        qs: {
            val: 0,
            stdev: 0
        },
        qt: {
            val: 0,
            stdev: 0
        },
        st: {
            val: 0,
            stdev: 0
        }
    });

    const [heartrate, setHeartrate] = useState(0);
    const [classificationResult, setClassificationResult] = useState(
        "unknown data"
    );

    useEffect(() => {
        const socket = io.connect("https://live-socket.ecgunpad.com");
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
        socket.on("ecganalysis", data => {
            const ecgAnalysis = JSON.parse(data);
            setSegmentAnalysis({
                rr: {
                    val: ecgAnalysis.rr_avg,
                    stdev: ecgAnalysis.rr_dev
                },
                pr: {
                    val: ecgAnalysis.pr_avg,
                    stdev: ecgAnalysis.pr_dev
                },
                qs: {
                    val: ecgAnalysis.qs_avg,
                    stdev: ecgAnalysis.qs_dev
                },
                qt: {
                    val: ecgAnalysis.qt_avg,
                    stdev: ecgAnalysis.qt_dev
                },
                st: {
                    val: ecgAnalysis.st_avg,
                    stdev: ecgAnalysis.st_dev
                }
            });
            setHeartrate(ecgAnalysis.heart_rate);
            setClassificationResult(ecgAnalysis.classification_result);
        });
    }, []);

    return (
        <Template title={"Live ECG"}>
            <Paper style={{ padding: 12, marginBottom: 20 }}>
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
            <TableContainer component={Paper} style={{ marginBottom: 20 }}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Segment</TableCell>
                            <TableCell align="right">Interval (ms)</TableCell>
                            <TableCell align="right">Stdev</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                RR
                            </TableCell>
                            <TableCell align="right">
                                {segmentAnalysis.rr.val}
                            </TableCell>
                            <TableCell align="right">
                                {segmentAnalysis.rr.stdev}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                PR
                            </TableCell>
                            <TableCell align="right">
                                {segmentAnalysis.pr.val}
                            </TableCell>
                            <TableCell align="right">
                                {segmentAnalysis.pr.stdev}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                QS
                            </TableCell>
                            <TableCell align="right">
                                {segmentAnalysis.qs.val}
                            </TableCell>
                            <TableCell align="right">
                                {segmentAnalysis.qs.stdev}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                QT
                            </TableCell>
                            <TableCell align="right">
                                {segmentAnalysis.qt.val}
                            </TableCell>
                            <TableCell align="right">
                                {segmentAnalysis.qt.stdev}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                ST
                            </TableCell>
                            <TableCell align="right">
                                {segmentAnalysis.st.val}
                            </TableCell>
                            <TableCell align="right">
                                {segmentAnalysis.st.stdev}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Parameter</TableCell>
                            <TableCell align="right">Result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Heartrate
                            </TableCell>
                            <TableCell align="right">{heartrate}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Classification Result
                            </TableCell>
                            <TableCell align="right">
                                {classificationResult}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Template>
    );
}

if (document.getElementById("live")) {
    ReactDOM.render(<LivePage />, document.getElementById("live"));
}
