import * as React from 'react';
import Grid from '@mui/material/Grid';
import {FormControl, FormHelperText, Input, InputAdornment, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {cIcons} from "../../../model/currencies";
import {MainPageFormFields} from "../MainPage";
import {OperationTypes} from "../../../model/operationTypes";
export default function StepOperationGeneralInfo(props) {
    const handleChange = (prop) => (event) => {
        props.onFieldChange(prop, event.target.value)
    };

    const AccountField = () => {
        return <FormControl fullWidth>
            <InputLabel
                id="account-select-label">{props.type === OperationTypes.IN ? "To" : "From"} Account</InputLabel>
            <Select
                error={props.errors.account.length > 0}
                labelId="account-select-label"
                id="account-select"
                value={props.account ? props.account : ''}
                label="Account"
                onChange={handleChange(MainPageFormFields.account)}
            >
                {props.accountOptions && props.accountOptions.map((a) => (
                    <MenuItem key={a.id} value={a}>{a.name} {a.balance.amount}{cIcons[a.balance.currency]}</MenuItem>
                ))}
            </Select>
            {props.errors.account.length > 0 && <FormHelperText error={true}>{props.errors.account.join('. ')}</FormHelperText>}
        </FormControl>
    }

    const CategoryField = () => {
        return <FormControl fullWidth>
            <InputLabel
                id="category-select-label">{props.type === OperationTypes.IN ? "From" : "To"} Category</InputLabel>
            <Select
                error={props.errors.category.length > 0}
                labelId="category-select-label"
                id="category-select"
                value={props.category ? props.category : ''}
                label="Category"
                onChange={handleChange(MainPageFormFields.category)}
            >
                {props.categoryOptions && props.categoryOptions
                    .filter((a) => a.type === props.type)
                    .map((a, i) => (
                        <MenuItem key={a.id} value={a}>{a.name}</MenuItem>
                    ))}
            </Select>
            {props.errors.category.length > 0 && <FormHelperText error={true}>{props.errors.category.join('. ')}</FormHelperText>}
        </FormControl>
    }

    return (
        <React.Fragment>
            <Grid container spacing={3} justifyContent="space-evenly">
                <Grid item xs={12} sm={5}>
                    {props.type === OperationTypes.OUT ? <AccountField/> : <CategoryField/>}
            </Grid>
            <Grid item xs={12} sm={5}>
                {props.type === OperationTypes.OUT ? <CategoryField/> : <AccountField/>}
            </Grid>
            <Grid item xs={8} sm={4}>
                <FormControl fullWidth >
                    <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                    <Input
                        error={props.errors.amount.length > 0}
                        id="standard-adornment-amount"
                        onChange={handleChange(MainPageFormFields.amount)}
                        startAdornment={<InputAdornment
                            position="start">{cIcons[props.account?.balance?.currency]}</InputAdornment>}
                        inputProps={{type: 'number'}}
                        value={props.amount}
                    />
                    {props.errors.amount.length > 0 && <FormHelperText error={true}>{props.errors.amount.join('. ')}</FormHelperText>}
                </FormControl>
            </Grid>
        </Grid>
</React.Fragment>
)
    ;
}
