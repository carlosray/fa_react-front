import React, {useEffect} from "react";
import {Paper} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import OperationsHistory from "./sub/OperationsHistory";
import Chart from "./sub/Chart";
import Balance from "./sub/Balance";
import RestService from "../../service/RestService";


export default function StatisticPage(props) {
    const [accounts, setAccounts] = React.useState();
    const [categories, setCategories] = React.useState();

    useEffect(() => {
        if (props.group) {
            const returnedCategories = RestService.getCategories(props.group.id);
            const returnedAccounts = RestService.getAccounts(props.group.id);

            setCategories(returnedCategories)
            setAccounts(returnedAccounts)
        }
    }, [props.group]);

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={5} lg={4}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                            overflow: 'auto'
                        }}
                    >
                        <Balance title="Total Balance" accounts={accounts} total={props.group.balance}/>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={7} lg={8}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                    >
                        <Chart/>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <OperationsHistory group={props.group}/>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}
