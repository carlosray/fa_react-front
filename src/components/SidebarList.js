import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import {Link, useLocation} from "react-router-dom";
import PropTypes from "prop-types";
import {Paths} from "../model/paths";
import Divider from "@mui/material/Divider";
import RestService from "../service/RestService";

const dividerAfter = [4, 5]

export default function SidebarList() {
    const location = useLocation();

    const [selectedIndex, setSelectedIndex] = React.useState(() => {
        const path = location.pathname === '/' ? '/main' : '/' + location.pathname.split('/')[1];
        for (const [, value] of Object.entries(Paths)) {
            if (value.path === path) {
                return value.index
            }
        }

        return -1;
    });

    const handleListItemClick = (index) => {
        setSelectedIndex(index);
    }

    return (
        <>
            <List component="nav">
                {Object.entries(Paths).map(([, p]) =>
                    <React.Fragment key={p.index}>
                        {p.icon && <ListItemLink primary={p.name} to={p.path} icon={p.icon}
                                                 selected={selectedIndex === p.index}
                                                 onClick={(event) => handleListItemClick(p.index)}/>}
                        {dividerAfter.indexOf(p.index) > -1 ? (<Divider sx={{my: 1}}/>) : (<></>)}
                    </React.Fragment>
                )}
                <Divider sx={{my: 1}}/>
                <ListItemText sx={{mx: 2}} primary={RestService.getLoggedInUserName()}/>
            </List>
        </>
    );
}

function ListItemLink(props) {
    const {icon, primary, to, selected, onClick} = props;

    return (
        <li>
            <ListItemButton component={Link} to={to} onClick={onClick} selected={selected}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary}/>
            </ListItemButton>
        </li>
    );
}

ListItemLink.propTypes = {
    icon: PropTypes.element,
    primary: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};