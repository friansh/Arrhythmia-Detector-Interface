import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/User";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { Line } from "react-chartjs-2";
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

export default function Raw(props) {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();

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

    const [yChart, setYChart] = useState([]);
    const [xChart, setXChart] = useState([]);

    useEffect(() => {
        Axios.get(`/api/data/classified/raw/${props.classifiedId}`, {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        })
            .then(response => {
                let rawTime = [];

                for (let i = 0; i < response.data.ecg.length; i++) {
                    rawTime.push(i + 1);
                }
                setYChart(response.data.ecg);
                setXChart(rawTime);

                setSegmentAnalysis({
                    rr: {
                        val: response.data.analysis.rr,
                        stdev: response.data.analysis.rr_stdev
                    },
                    pr: {
                        val: response.data.analysis.pr,
                        stdev: response.data.analysis.pr_stdev
                    },
                    qs: {
                        val: response.data.analysis.qs,
                        stdev: response.data.analysis.qs_stdev
                    },
                    qt: {
                        val: response.data.analysis.qt,
                        stdev: response.data.analysis.qt_stdev
                    },
                    st: {
                        val: response.data.analysis.st,
                        stdev: response.data.analysis.st_stdev
                    }
                });

                setHeartrate(response.data.analysis.heartrate);
                setClassificationResult(
                    response.data.analysis.classification_result
                );
            })
            .finally(() => setLoading(false));
    }, []);

    const [loading, setLoading] = useState(true);

    return (
        <Template title={"Electrocardiogram Data"}>
            {loading ? <LinearProgress /> : null}

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

let userEcg = document.getElementById("ecg");
if (userEcg) {
    ReactDOM.render(
        <Raw classifiedId={userEcg.dataset.classifiedId} />,
        userEcg
    );
}
