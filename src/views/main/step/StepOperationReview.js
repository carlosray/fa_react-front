import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {MainPageFormFields} from "../MainPage";
import {OperationTypes} from "../../../model/operationTypes";
import {cIcons} from "../../../model/currencies";
import I18n from "../../../i18n/I18n";
import Divider from "@mui/material/Divider";

export default function StepOperationReview(props) {
    const isIncome = props.values[MainPageFormFields.type] === OperationTypes.IN;

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item container direction="column" xs={12}>
                    <Grid container>
                        <React.Fragment>
                            <Grid item xs={6}>
                                <Typography sx={{fontWeight: 'bold'}} gutterBottom>Operation type</Typography>
                                <Divider sx={{my: 1}}/>
                                <Typography sx={{fontWeight: 'bold'}} gutterBottom>Amount</Typography>
                                <Typography
                                    sx={{fontWeight: 'bold'}}
                                    gutterBottom>{isIncome ? "To account" : "From account"}</Typography>
                                <Typography sx={{fontWeight: 'bold'}} gutterBottom>{isIncome ? "From category" : "To category"}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom
                                            color={isIncome ? "success.main" : "error.main"}>
                                    <I18n>
                                        {props.values[MainPageFormFields.type]}
                                    </I18n>
                                </Typography>
                                <Divider sx={{my: 1}}/>
                                <Typography
                                    gutterBottom>{`${props.values[MainPageFormFields.amount]}${cIcons[props.values[MainPageFormFields.account].balance.currency]}`}</Typography>
                                <Typography gutterBottom>{props.values[MainPageFormFields.account].name}</Typography>
                                <Typography gutterBottom>{props.values[MainPageFormFields.category].name}</Typography>
                            </Grid>
                        </React.Fragment>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}