import React from "react";
import {FormControlLabel, FormGroup, Paper} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import RestService from "../../service/RestService";


export default function SettingsPage(props) {
    const [checked, setChecked] = React.useState(props.theme === 'dark');

    const handleChange = (event) => {
        setChecked(event.target.checked);
        props.onThemeChanged(event.target.checked ? 'dark' : 'light')
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid xs>
                    <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                        <FormGroup>
                            <FormControlLabel control={
                                <Switch
                                    checked={checked}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            }
                                              label="Dark theme"/>
                        </FormGroup>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}
