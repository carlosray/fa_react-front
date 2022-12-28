import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from "../../../components/Title";
import {cIcons} from "../../../model/currencies";
import {parseUtcDateAtSystemOffset} from "../../../time/TimeUtils";
import {ListItem} from "@mui/material";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";


export default function Balance(props) {
    return (
        <React.Fragment>
            <Title>{props.title}</Title>
            <Typography component="p" variant="h4">
                {props.total?.amount}{cIcons[props.total?.currency]}
            </Typography>
            <List dense={true} sx={{pb: 0}}>
                {props.accounts && props.accounts.map((a) =>
                    <ListItem key={a.id} sx={{pl: 0, ml: 0, pb: 0}}>
                        <ListItemText
                            primary={<strong>{a.name}: {a.balance.amount}{cIcons[a.balance.currency]}</strong>}
                            secondary={parseUtcDateAtSystemOffset(a.balance.lastUpdate).format('lll')}
                        />
                    </ListItem>
                )}
            </List>
        </React.Fragment>
    );
}