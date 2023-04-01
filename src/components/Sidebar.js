import * as React from 'react';
import {styled} from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SidebarList from "./SidebarList";
import {cIcons} from "../model/currencies";
import {CircularProgress} from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const GroupTitle = (props) =>
    <>{`${props.currentGroup}: `} {!props.refresh ? (`${props.amount}${cIcons[props.currency]}`) : (
        <CircularProgress color="inherit" size={22}/>)}</>

const OPEN_SIDEBAR = "open_sidebar"
class Sidebar extends React.Component {
    constructor(props, context) {
        super(props, context);

        const isOpen = sessionStorage.getItem(OPEN_SIDEBAR)
        if (isOpen === null) {
            sessionStorage.setItem(OPEN_SIDEBAR, window.screen.width > 1000);
        }
        this.state = {
            open: sessionStorage.getItem(OPEN_SIDEBAR) === "true",
            refresh: false
        }
    }

    toggleDrawer = () => {
        const r = sessionStorage.getItem(OPEN_SIDEBAR) !== "true"
        sessionStorage.setItem(OPEN_SIDEBAR, r);
        this.setState({
            open: r
        });
    };

    onUpdateClick = () => {
        this.setState({refresh: true});
        //TODO REMOVE TIMEOUT
        setTimeout(() => {
            this.props.onUpdateClick()
            this.setState({refresh: false})
        }, 1000)

    };

    render() {
        return (
            <>
                <AppBar position="fixed" open={this.state.open} style={{zIndex: 10}}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(this.state.open && {display: 'none'}),
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{flexGrow: 1}}
                        >
                            {this.props.currentGroup !== null && this.props.currentGroup !== undefined &&
                                <GroupTitle currentGroup={this.props.currentGroup}
                                            refresh={this.state.refresh}
                                            amount={this.props.balance?.amount}
                                            currency={this.props.balance?.currency}/>}

                            {this.props.currentGroup !== null && this.props.currentGroup !== undefined && !this.state.refresh &&
                                <IconButton aria-label="update group" color="inherit" onClick={this.onUpdateClick}>
                                    <CachedIcon/>
                                </IconButton>}
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={this.state.open} style={{zIndex: 10}}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={this.toggleDrawer}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </Toolbar>
                    <Divider/>
                    <SidebarList/>
                </Drawer>
            </>
        );
    }
}

export default Sidebar;
