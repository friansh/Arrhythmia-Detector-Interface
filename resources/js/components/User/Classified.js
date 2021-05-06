import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Template from "../App/Template/User";
import Cust_Table from "../App/Table";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import LinearProgress from "@material-ui/core/LinearProgress";

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

export default function Classified() {
    const classes = useStyles();
    const theme = useTheme();

    const [cookies, setCookie] = useCookies();
    const [classifiedData, setClassifiedData] = useState([]);

    useEffect(() => {
        Axios.get("/api/data/classified", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        })
            .then(response => {
                setClassifiedData(response.data);
            })
            .finally(loadDone);
    }, []);

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
            <Template title={"Classifier Result"}>
                <Paper style={{ padding: 12 }}>
                    <Cust_Table column={2} data={classifiedData} />
                </Paper>
            </Template>
        );
}

if (document.getElementById("classified")) {
    ReactDOM.render(<Classified />, document.getElementById("classified"));
}
