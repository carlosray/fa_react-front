import React from 'react';
import PageNotFound from '../assets/img/404-error.png';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

class NotFoundPage extends React.Component {
    render() {
        return <Grid container spacing={2}>
            <Grid item xs={12}>
                <p style={{textAlign: "center"}}>
                    <img src={PageNotFound} alt={"Page not found"}/>
                </p>
                <p style={{textAlign: "center"}}>
                    <Button href={"/"}>
                        Go to home
                    </Button>
                </p>
            </Grid>
        </Grid>;
    }
}

export default NotFoundPage;