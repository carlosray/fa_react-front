import React, {useEffect} from "react";
import {Backdrop, Box, CircularProgress, FormControl, InputLabel, Select, TableCell, TextField} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CommonEditTable from "../../components/CommonEditTable";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import {AvailableCurrencies, cIcons, Currencies} from "../../model/currencies";
import MenuItem from "@mui/material/MenuItem";
import RestService from "../../service/RestService";
import {Severities} from "../../model/severities";


export default function AccountsPage(props) {
    const [accounts, setAccounts] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        if (props.group) {
            setIsLoading(true)
            RestService.getAccounts(props.group.id)
                .then(r => {
                    const returnedAccounts = r.data
                    setAccounts(returnedAccounts.map(toFlatten))
                })
                .catch((e) => {
                    props.alert("Failed to load accounts", RestService.getErrorMessage(e))
                })
                .finally(() => {
                    setIsLoading(false)
                });
        }
    }, [props.group]);

    const handleSave = (account) => {
        if (account.id) {
            setIsLoading(true)
            RestService.updateAccount(props.group.id, account.id, account.name, account.currency)
                .then(r => {
                    const newElement = r.data
                    for (let i = 0; i < accounts.length; i++) {
                        if (accounts[i].id == newElement.id) {
                            accounts[i] = toFlatten(newElement)
                        }
                    }
                    props.alert("Account updated", `Account ${account.name} updated`, Severities.INFO)
                })
                .catch((e) => {
                    props.alert("Failed to update account", RestService.getErrorMessage(e))
                })
                .finally(() => {
                    setIsLoading(false)
                })
        } else {
            setIsLoading(true)
            RestService.createAccount(props.group.id, account.name, account.currency)
                .then(r => {
                    const joined = accounts.concat(toFlatten(r.data));
                    setAccounts(joined)
                    props.alert("Account created", `Account ${account.name} created`, Severities.INFO)
                })
                .catch((e) => {
                    props.alert("Failed to create account", RestService.getErrorMessage(e))
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    };

    const handleDelete = (account) => {
        setIsLoading(true)
        RestService.deleteAccount(props.group.id, account.id)
            .then((r) => {
                const index = accounts.indexOf(account);
                if (index > -1) {
                    const n = accounts
                    n.splice(index, 1);
                    setAccounts(n)
                    props.alert("Account deleted", `Account ${account.name} deleted`, Severities.INFO)
                }
            })
            .catch((e) => {
                props.alert("Failed to delete account", RestService.getErrorMessage(e))
            })
            .finally(() => {
                setIsLoading(false)
            })
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
                    isLoading={isLoading}
                    title={"Account"}
                    columns={[
                        <TableCell key={1}>Name</TableCell>,
                        <TableCell key={2} align="right">Balance</TableCell>,
                        <TableCell key={3} align="right">Currency</TableCell>
                    ]}
                    values={accounts}
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
