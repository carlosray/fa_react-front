import React from "react";
import {FormControl, InputLabel, Select, Switch, TableCell, TextField} from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from "@mui/material/Unstable_Grid2";
import CommonEditTable from "../../components/CommonEditTable";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import {AvailableCurrencies, cIcons} from "../../model/currencies";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import RestService from "../../service/RestService";
import {Severities} from "../../model/severities";
import ValidatorService from "../../service/ValidatorService";


export default function GroupPage(props) {

    const [isOpenChangeAlert, setIsOpenChangeAlert] = React.useState(null) //group or null
    const [isLoading, setIsLoading] = React.useState(false)
    const handleClickOpenChangeAlert = (group) => (event) => {
        if (group.id !== props.currentGroup?.id) {
            setIsOpenChangeAlert(group);
        }
    };

    const handleCloseChangeAlert = (isChange) => (event) => {
        if (isChange && isOpenChangeAlert.id !== props.currentGroup?.id) {
            props.onGroupChange(isOpenChangeAlert.id)
        }
        setIsOpenChangeAlert(null);
    };

    const handleSave = (group) => {
        setIsLoading(true)
        if (group.id) {
            RestService.updateGroup(group.id, group.name, group.description, group.currency)
                .then((r) => {
                    const response = r.data
                    props.onGroupUpdate(response, group.setCurrent)
                    props.alert("Group updated", `Group ${response.name} successfully updated`, Severities.SUCCESS)
                })
                .catch((e) => {
                    props.alert("Failed to update group", RestService.getErrorMessage(e))
                })
                .finally(() => {
                    setIsLoading(false)
                })
        } else {
            RestService.createGroup(group.name, group.description, group.currency)
                .then((r) => {
                    const response = r.data
                    props.onGroupCreate(response, group.setCurrent)
                    props.alert("Group created", `Group ${response.name} successfully created`, Severities.SUCCESS)
                })
                .catch((e) => {
                    props.alert("Failed to create group", RestService.getErrorMessage(e))
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    };

    const handleDelete = (group) => {
        setIsLoading(true)
        RestService.deleteGroup(group.id)
            .then((r) => {
                props.onDeleteGroup()
                props.alert("Group deleted", `Group ${group.name} deleted`, Severities.INFO)
            })
            .catch((e) => {
                props.alert("Failed to delete group", RestService.getErrorMessage(e))
            })
            .finally(() => {
                setIsLoading(false)
            })
    };

    const validate = (field, value) => {
        switch (field) {
            case 'name':
                return ValidatorService.validateSpecified(field, value);
            case 'description':
                return ValidatorService.validateSpecified(field, value);
            case 'currency':
                return ValidatorService.validateSpecified(field, value);
            default:
                return [];
        }
    }

    const toFlatten = (g) => {
        return {
            id: g.id,
            name: g.name,
            description: g.description,
            setCurrent: false,
            users: g.users,
            amount: g.balance.amount,
            currency: g.balance.currency,
            lastUpdate: g.balance.lastUpdate
        }
    }

    const fromFlatten = (g) => {
        return {
            id: g.id,
            name: g.name,
            description: g.description,
            users: g.users,
            balance: {
                amount: g.amount,
                currency: g.currency,
                lastUpdate: g.lastUpdate
            }
        }
    }

    return (
        <>
            <Grid container spacing={2}>
                <CommonEditTable
                    isLoading={isLoading || props.isLoading}
                    title={"Group"}
                    columns={[
                        <TableCell key={1}>Name</TableCell>,
                        <TableCell key={2} align="right">Balance</TableCell>,
                        <TableCell key={3} align="right">Currency</TableCell>,
                        <TableCell key={4} align="right">Is Selected</TableCell>
                    ]}
                    values={props.groups.map(toFlatten)}
                    row={(g) => (
                        <>
                            <TableCell component="th" scope="row">
                                {g.name}
                            </TableCell>
                            <TableCell align="right">
                                {g.amount}{cIcons[g.currency]}
                            </TableCell>
                            <TableCell align="right">
                                {g.currency}
                            </TableCell>
                            <TableCell align="right">
                                <IconButton color="success" aria-label="is current"
                                            onClick={handleClickOpenChangeAlert(g)}>
                                    {g.id === props.currentGroup?.id ? (
                                        <RadioButtonCheckedIcon/>
                                    ) : (
                                        <RadioButtonUncheckedIcon/>
                                    )}
                                </IconButton>
                            </TableCell>
                        </>
                    )}
                    form={(values, errors, handleChange) => (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField id="name"
                                           label="Name"
                                           variant="standard"
                                           error={errors?.name && errors.name.length !== 0}
                                           helperText={errors?.name ? errors.name.join('. ') : ''}
                                           value={values?.name ? values?.name : ''}
                                           onChange={handleChange('name')}/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField id="description"
                                           label="Description"
                                           variant="standard"
                                           error={errors?.description && errors.description.length !== 0}
                                           helperText={errors?.description ? errors.description.join('. ') : ''}
                                           value={values?.description ? values?.description : ''}
                                           onChange={handleChange('description')}/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="standard">
                                    <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={values?.currency ? values.currency : ''}
                                        error={errors?.currency && errors.currency.length !== 0}
                                        label="Currency"
                                        onChange={handleChange('currency')}
                                    >
                                        {AvailableCurrencies.map((c) => <MenuItem key={c}
                                                                                  value={c}>{c}</MenuItem>)}
                                    </Select>
                                    <FormHelperText error={errors?.currency && errors.currency.length !== 0}>
                                        {errors?.currency ? errors.currency.join('. ') : ''}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{mt: 3}}>
                                <FormControlLabel
                                    control={<Switch onChange={handleChange('setCurrent')}/>}
                                    label="Set current"/>

                            </Grid>
                        </Grid>
                    )}
                    onDelete={handleDelete}
                    onSave={handleSave}
                    validate={validate}
                    validationProps={['name', 'description', 'currency']}
                />
                <Dialog
                    open={isOpenChangeAlert !== null}
                    onClose={handleCloseChangeAlert(false)}
                    aria-labelledby="change-alert-dialog-title"
                    aria-describedby="change-alert-dialog-description"
                >
                    <DialogTitle id="change-alert-dialog-title">
                        {"Change group?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="change-alert-dialog-description">
                            Are you sure you want to change the group to <b>{isOpenChangeAlert?.name}</b>?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseChangeAlert(false)} variant="outlined">No</Button>
                        <Button onClick={handleCloseChangeAlert(true)} autoFocus variant="contained">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </>
    );
}
