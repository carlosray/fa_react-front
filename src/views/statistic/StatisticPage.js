import React, {useEffect} from "react";
import {Backdrop, CircularProgress, Paper} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import OperationsHistory from "./sub/OperationsHistory";
import Chart from "./sub/Chart";
import Balance from "./sub/Balance";
import RestService from "../../service/RestService";


export default function StatisticPage(props) {
    const [accounts, setAccounts] = React.useState();
    const [categories, setCategories] = React.useState();
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        if (props.group) {
            setIsLoading(true)
            const cp = RestService.getCategories(props.group.id)
                .catch((e) => {
                    props.alert("Failed to load categories", RestService.getErrorMessage(e))
                })
            const ap = RestService.getAccounts(props.group.id)
                .catch((e) => {
                    props.alert("Failed to load accounts", RestService.getErrorMessage(e))
                })
            Promise.all([cp, ap])
                .then((r) => {
                    const returnedCategories = r[0].data
                    const returnedAccounts = r[1].data
                    setCategories(returnedCategories)
                    setAccounts(returnedAccounts)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [props.group]);

    return (
        <>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={isLoading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
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
                    <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                        <OperationsHistory group={props.group}/>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}
