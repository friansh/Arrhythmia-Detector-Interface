import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Cust_Alert(props) {
    const [open, setOpen] = React.useState(props.open);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={props.duration}
            onClose={handleClose}
        >
            <Alert onClose={handleClose} severity={props.severity}>
                {props.children}
            </Alert>
        </Snackbar>
    );
}
