import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";

import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import DateRangeIcon from "@material-ui/icons/DateRange";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import PersonIcon from "@material-ui/icons/Person";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { CookiesProvider, useCookies } from "react-cookie";

import Axios from "axios";
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: 36
    },
    hide: {
        display: "none"
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap"
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: "hidden",
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9) + 1
        }
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    title: {
        flexGrow: 1
    }
}));

export default function Template(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const bull = <span className={classes.bullet}>•</span>;

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [user, setUser] = useState({
        first_name: null,
        last_name: null,
        role: 0
    });

    const [doctor, setDoctor] = useState(null);
    const [cookies, setCookie] = useCookies();

    const redirectLogin = () => {
        window.location.replace("/login");
    };

    useEffect(() => {
        Axios.get("/api/active", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        })
            .then(response => {
                setUser(response.data.user);
                setDoctor(response.data.doctor);
            })
            .catch(redirectLogin);
    }, []);

    const logout = () => {
        Axios.post(
            "/api/auth/logout",
            {},
            {
                headers: {
                    Authorization: "Bearer " + cookies.token
                }
            }
        ).then(redirectLogin);
    };

    return (
        <CookiesProvider>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open
                    })}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, {
                                [classes.hide]: open
                            })}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            className={classes.title}
                        >
                            {props.title == undefined
                                ? "User Dashboard"
                                : props.title}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open
                        })
                    }}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === "rtl" ? (
                                <ChevronRightIcon />
                            ) : (
                                <ChevronLeftIcon />
                            )}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <ListItem
                            button
                            key={"Dashboard"}
                            onClick={() => (window.location.href = "/user")}
                        >
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Dashboard"} />
                        </ListItem>
                        <React.Fragment>
                            <ListItem
                                button
                                key={"Raw Data"}
                                onClick={() =>
                                    (window.location.href = "/user/ecg")
                                }
                            >
                                <ListItemIcon>
                                    <ShowChartIcon />
                                </ListItemIcon>
                                <ListItemText primary={"ECG Data"} />
                            </ListItem>
                            <ListItem
                                button
                                key={"Classifier Result"}
                                onClick={() =>
                                    (window.location.href = "/user/classified")
                                }
                            >
                                <ListItemIcon>
                                    <DonutLargeIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Classifier Result"} />
                            </ListItem>
                            <ListItem
                                button
                                key={"History"}
                                onClick={() =>
                                    (window.location.href = "/user/history")
                                }
                            >
                                <ListItemIcon>
                                    <DateRangeIcon />
                                </ListItemIcon>
                                <ListItemText primary={"History"} />
                            </ListItem>
                        </React.Fragment>
                    </List>
                    <Divider />

                    <List>
                        {doctor != null && doctor.verified ? (
                            <ListItem
                                button
                                key={"Doctor Panel"}
                                onClick={() =>
                                    (window.location.href = "/doctor")
                                }
                            >
                                <ListItemIcon>
                                    <LocalHospitalIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Doctor Panel"} />
                            </ListItem>
                        ) : null}
                        {user.admin ? (
                            <ListItem
                                button
                                key={"Admin Panel"}
                                onClick={() =>
                                    (window.location.href = "/admin")
                                }
                            >
                                <ListItemIcon>
                                    <SupervisorAccountIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Admin Panel"} />
                            </ListItem>
                        ) : null}

                        <ListItem
                            button
                            onClick={() =>
                                (window.location.href = "/user/profile")
                            }
                        >
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Profile"} />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button onClick={logout}>
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Logout"} />
                        </ListItem>
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {props.children}
                </main>
            </div>
        </CookiesProvider>
    );
}
