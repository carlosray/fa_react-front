import * as React from 'react';
import Grid from '@mui/material/Grid';
import {FormControl, FormHelperText, Input, InputAdornment, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {cIcons} from "../../../model/currencies";
import {MainPageFormFields} from "../MainPage";

export default function StepOperationTransfer(props) {
    const handleChange = (prop) => (event) => {
        props.onFieldChange(prop, event.target.value)
    };

    const AccountField = (pprops) => {
        return <FormControl fullWidth>
            <InputLabel
                id="account-select-label">{pprops.type} Account</InputLabel>
            <Select
                error={pprops.errors.length > 0}
                labelId="account-select-label"
                id="account-select"
                value={pprops.value ? pprops.value : ''}
                label="Account"
                onChange={handleChange(pprops.field)}
            >
                {props.accountOptions && props.accountOptions.map((a) => (
                    <MenuItem key={a.id} value={a}>{a.name} {a.balance.amount}{cIcons[a.balance.currency]}</MenuItem>
                ))}
            </Select>
            {pprops.errors.length > 0 && <FormHelperText error={true}>{pprops.errors.join('. ')}</FormHelperText>}
        </FormControl>
    }

    return (
        <React.Fragment>
            <Grid container spacing={3} justifyContent="space-evenly">
                <Grid item xs={12} sm={5}>
                    <AccountField type={"From"}
                                  field={MainPageFormFields.fromAccount}
                                  value={props.fromAccount}
                                  errors={props.errors.fromAccount}/>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <AccountField type={"To"}
                                  field={MainPageFormFields.toAccount}
                                  value={props.toAccount}
                                  errors={props.errors.toAccount}/>
                </Grid>
                <Grid item xs={8} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                        <Input
                            error={props.errors.amount.length > 0}
                            id="standard-adornment-amount"
                            onChange={handleChange(MainPageFormFields.amount)}
                            startAdornment={<InputAdornment
                                position="start">{cIcons[props.fromAccount?.balance?.currency]}</InputAdornment>}
                            inputProps={{type: 'number'}}
                            value={props.amount}
                        />
                        {props.errors.amount.length > 0 && <FormHelperText error={true}>{props.errors.amount.join('. ')}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={4} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="standard-adornment-commission">Commission</InputLabel>
                        <Input
                            error={props.errors.commission.length > 0}
                            id="standard-adornment-commission"
                            onChange={handleChange(MainPageFormFields.commission)}
                            startAdornment={<InputAdornment
                                position="start">{cIcons[props.fromAccount?.balance?.currency]}</InputAdornment>}
                            inputProps={{type: 'number'}}
                            value={props.commission}
                        />
                        {props.errors.commission.length > 0 && <FormHelperText error={true}>{props.errors.commission.join('. ')}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={4}>
                    <FormControl fullWidth
                                 disabled={props.fromAccount?.balance?.currency === props.toAccount?.balance?.currency}>
                        <InputLabel htmlFor="standard-adornment-rate">
                            Rate for 1 {props.fromAccount?.balance?.currency}
                        </InputLabel>
                        <Input
                            error={props.errors.rate.length > 0}
                            id="standard-adornment-rate"
                            onChange={handleChange(MainPageFormFields.rate)}
                            startAdornment={<InputAdornment
                                position="start">{cIcons[props.toAccount?.balance?.currency]}</InputAdornment>}
                            inputProps={{type: 'number'}}
                            value={props.fromAccount?.balance?.currency === props.toAccount?.balance?.currency ? 1 : props.rate}
                        />
                        {props.errors.rate.length > 0 && <FormHelperText error={true}>{props.errors.rate.join('. ')}</FormHelperText>}
                    </FormControl>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}