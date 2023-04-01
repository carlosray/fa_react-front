import React, {useEffect} from "react";
import {Box, FormControl, InputLabel, Select, TableCell, TextField} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CommonEditTable from "../../components/CommonEditTable";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import {AvailableCurrencies, cIcons, Currencies} from "../../model/currencies";
import MenuItem from "@mui/material/MenuItem";
import RestService from "../../service/RestService";


export default function AccountsPage(props) {
    const [accounts, setAccounts] = React.useState([])

    useEffect(() => {
        if (props.group) {
            const returnedAccounts = RestService.getAccounts(props.group.id);
            setAccounts(returnedAccounts)
        }
    }, [props.group]);

    const handleSave = (account) => {
        console.log("Account saved: " + JSON.stringify(fromFlatten(account)));
    };

    const handleDelete = (account) => {
        console.log("Account deleted: " + JSON.stringify(account));
    };

    const toFlatten = (a) => {
        return {
            id: a.id,
            name: a.name,
            amount: a.balance.amount,
            currency: a.balance.currency,
            lastUpdate: a.balance.lastUpdate
        }
    }

    const fromFlatten = (a) => {
        return {
            id: a.id,
            name: a.name,
            balance: {
                amount: a.amount,
                currency: a.currency,
                lastUpdate: a.lastUpdate
            }
        }
    }

    return (
        <>
            <Grid container spacing={2}>
                <CommonEditTable
                    isLoading={false}
                    title={"Account"}
                    columns={[
                        <TableCell key={1}>Name</TableCell>,
                        <TableCell key={2} align="right">Balance</TableCell>,
                        <TableCell key={3} align="right">Currency</TableCell>
                    ]}
                    values={accounts.map(toFlatten)}
                    row={(v) => (
                        <>
                            <TableCell component="th" scope="row">
                                {v.name}
                            </TableCell>

                            <TableCell
                                align="right">{v.amount}{cIcons[v.currency]}</TableCell>
                            <TableCell align="right">
                                {v.currency}
                            </TableCell>
                        </>
                    )}
                    form={(values, errors, handleChange) => (
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': {m: 1, width: '25ch'},
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField id="name"
                                       label="Name"
                                       variant="standard"
                                       value={values?.name ? values?.name : ''}
                                       onChange={handleChange('name')}/>

                            <FormControl fullWidth>
                                <InputLabel id="users-select-label">Users</InputLabel>
                                <Select
                                    labelId="users-select-label"
                                    id="users-select"
                                    label="Users"
                                    onChange={handleChange('users')}
                                    disabled
                                    value={''}
                                    variant="standard"
                                >
                                    {/*{group.users?.map((u) => <MenuItem value={u}>u</MenuItem>)}*/}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={values?.currency ? values.currency : ''}
                                    label="Currency"
                                    onChange={handleChange('currency')}
                                >
                                    {AvailableCurrencies.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                    onDelete={handleDelete}
                    onSave={handleSave}
                />
            </Grid>
        </>
    );
}
