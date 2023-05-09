import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {MainPageFormFields} from "../MainPage";
import {OperationTypes} from "../../../model/operationTypes";
import {cIcons} from "../../../model/currencies";
import I18n from "../../../i18n/I18n";
import Divider from "@mui/material/Divider";
import {Stack} from "@mui/material";

export default function StepOperationTransferReview(props) {
    const isCommission = props.isCommission();
    const isRate = props.isRate();
    const resultAmount = props.resultAmount();

    const handleChange = (prop) => (event) => {
        props.onFieldChange(prop, event.target.value)
    };

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item container direction="column" xs={12}>
                    <Grid container>
                        <React.Fragment>
                            <Grid item xs={6}>
                                <Typography sx={{fontWeight: 'bold'}} gutterBottom>Operation type</Typography>
                                <Divider sx={{my: 1}}/>
                                <Stack direction={"row"} sx={{p: 0}}>
                                    <Typography sx={{fontWeight: 'bold', mr: 0.5, mb: 0}} gutterBottom>
                                        From
                                    </Typography>
                                    <Typography variant="body1" color={"text.secondary"} sx={{mb: 0}}>
                                        {props.values[MainPageFormFields.fromAccount].name}
                                    </Typography>
                                </Stack>
                                <Divider sx={{my: 1}}/>
                                {isCommission &&
                                    <Typography sx={{fontWeight: 'bold'}} gutterBottom>
                                        Commission
                                    </Typography>
                                }
                                {isRate &&
                                    <Typography sx={{fontWeight: 'bold'}} gutterBottom>
                                        Rate for 1 {props.values[MainPageFormFields.fromAccount].balance.currency}
                                    </Typography>
                                }
                                <Stack direction={"row"} spacing={0.5}>
                                    <Typography sx={{fontWeight: 'bold'}} gutterBottom>
                                        To
                                    </Typography>
                                    <Typography variant="body1" color={"text.secondary"}>
                                        {props.values[MainPageFormFields.toAccount].name}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography gutterBottom color={"info.light"}>
                                    <I18n>
                                        {props.values[MainPageFormFields.type]}
                                    </I18n>
                                </Typography>
                                <Divider sx={{my: 1}}/>
                                <Typography gutterBottom>
                                    {`${props.values[MainPageFormFields.amount]}${cIcons[props.values[MainPageFormFields.fromAccount].balance.currency]}`}
                                </Typography>
                                <Divider sx={{my: 1}}/>
                                {isCommission &&
                                    <Typography gutterBottom>
                                        {props.values[MainPageFormFields.commission]}{cIcons[props.values[MainPageFormFields.fromAccount].balance.currency]}
                                    </Typography>
                                }
                                {isRate &&
                                    <Typography gutterBottom>
                                        {props.values[MainPageFormFields.rate]}{cIcons[props.values[MainPageFormFields.toAccount].balance.currency]}
                                    </Typography>
                                }
                                <Typography gutterBottom>
                                    {`${resultAmount}${cIcons[props.values[MainPageFormFields.toAccount].balance.currency]}`}
                                </Typography>
                            </Grid>
                        </React.Fragment>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}