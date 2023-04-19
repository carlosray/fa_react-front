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
            let categoriesLoading = true
            let accountsLoading = true
            RestService.getCategories(props.group.id)
                .then(r => {
                    const returnedCategories = r.data
                    setCategories(returnedCategories)
                })
                .catch((e) => {
                    props.alert("Failed to load categories", RestService.getErrorMessage(e))
                })
                .finally(() => {
                    categoriesLoading = false
                    setIsLoading(categoriesLoading || accountsLoading)
                })

            RestService.getAccounts(props.group.id)
                .then(r => {
                    const returnedAccounts = r.data
                    setAccounts(returnedAccounts)
                })
                .catch((e) => {
                    props.alert("Failed to load accounts", RestService.getErrorMessage(e))
                })
                .finally(() => {
                    accountsLoading = false
                    setIsLoading(categoriesLoading || accountsLoading)
                });
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
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <OperationsHistory group={props.group}/>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}
