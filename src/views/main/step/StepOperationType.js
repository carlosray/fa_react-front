import * as React from 'react';
import {useEffect} from 'react';
import Grid from '@mui/material/Grid';
import {FormControl, InputLabel, Select, Skeleton} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {MainPageFormFields} from "../MainPage";
import {OperationTypes} from "../../../model/operationTypes";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import I18n from "../../../i18n/I18n";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import MultipleStopIcon from '@mui/icons-material/MultipleStop';

export default function StepOperationType(props) {

    const [isLoading, setIsLoading] = React.useState(true)

    const handleChange = (prop) => (event) => {
        props.onFieldChange(prop, event.target.value)
    };

    useEffect(() => {
        if (isLoading && props.type) {
            setIsLoading(false)
        }
    }, [props.type]);

    return (
        <React.Fragment>
            <Grid container spacing={3} justifyContent="space-evenly">
                <Grid item xs={12} sm={6}>
                    {
                        isLoading ? (
                            <Skeleton variant="rectangular" width={100} height={50}/>
                        ) : (
                            <FormControl fullWidth>
                                <InputLabel id="type-select-label">Type</InputLabel>
                                <Select
                                    labelId="type-select-label"
                                    id="type-select"
                                    value={props.type}
                                    label="Type"
                                    onChange={handleChange(MainPageFormFields.type)}
                                >
                                    <MenuItem value={OperationTypes.IN}>
                                        <ControlPointIcon color={"success"} sx={{mr: 0.5}}/>
                                        <I18n>{OperationTypes.IN}</I18n>
                                    </MenuItem>
                                    <MenuItem value={OperationTypes.OUT}>
                                        <RemoveCircleOutlineIcon color={"error"} sx={{mr: 0.5}}/>
                                        <I18n>{OperationTypes.OUT}</I18n>
                                    </MenuItem>
                                    <MenuItem value={OperationTypes.TRANSFER}>
                                        <MultipleStopIcon color={"info"} sx={{mr: 0.5}}/>
                                        <I18n>{OperationTypes.TRANSFER}</I18n>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        )
                    }
                </Grid>
            </Grid>
        </React.Fragment>
    );
}