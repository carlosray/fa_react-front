import React, {useEffect} from "react";
import {Backdrop, CircularProgress, Paper, Step, StepLabel, Stepper} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import StepOperationGeneralInfo from "./step/StepOperationGeneralInfo";
import StepOperationReview from "./step/StepOperationReview";
import StepOperationType from "./step/StepOperationType";
import {OperationTypes} from "../../model/operationTypes";
import RestService from "../../service/RestService";
import Title from "../../components/Title";
import StepOperationTransfer from "./step/StepOperationTransfer";
import StepOperationTransferReview from "./step/StepOperationTransferReview";
import ValidatorService from "../../service/ValidatorService";

export const MainPageFormFields = {
    type: 'type',
    amount: 'amount',
    account: 'account',
    category: 'category',
    fromAccount: 'fromAccount',
    toAccount: 'toAccount',
    commission: 'commission',
    rate: 'rate'
}

export default function MainPage(props) {

    const [activeStep, setActiveStep] = React.useState(0);
    const [categories, setCategories] = React.useState([]);
    const [accounts, setAccounts] = React.useState([]);
    const [isCreating, setIsCreating] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [errors, setErrors] = React.useState({
        account: [],
        fromAccount: [],
        toAccount: [],
        category: [],
        amount: [],
        commission: [],
        rate: []
    })

    const [values, setValues] = React.useState({
        type: OperationTypes.OUT,
        amount: 0,
        category: {},
        account: {},
        commission: 0,
        rate: 1,
        fromAccount: {},
        toAccount: {}
    });

    useEffect(() => {
        if (props.group) {
            setIsLoading(true)
            let categoriesLoading = true
            let accountsLoading = true
            RestService.getCategories(props.group.id)
                .then(r => {
                    const returnedCategories = r.data
                    setCategories(returnedCategories)
                    setValues({
                        ...values,
                        category: returnedCategories.find((c) => c.type === values.type),
                    })
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
                    setValues({
                        ...values,
                        account: returnedAccounts[0],
                        amount: returnedAccounts[0] ? returnedAccounts[0].balance.amount < 100 ? returnedAccounts[0].balance.amount : 100 : 0,
                        fromAccount: returnedAccounts[0],
                        toAccount: returnedAccounts[1],
                    })
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

    const handleChange = (prop, value) => {
        if (prop === MainPageFormFields.type) {
            setValues({
                ...values,
                [prop]: value,
                [MainPageFormFields.category]: categories.find((c) => c.type === value)
            });
        } else {
            setValues({...values, [prop]: value});
        }

        const newErrors = JSON.parse(JSON.stringify(errors))
        validate(prop, value, newErrors)
        setErrors(newErrors);
    };

    const validate = (field, value, newErrors) => {
        switch (field) {
            case MainPageFormFields.category:
                newErrors[field] = ValidatorService.validateCategory(value);
                break
            case MainPageFormFields.type:
                newErrors[MainPageFormFields.amount] = []
                newErrors[MainPageFormFields.account] = []
                newErrors[MainPageFormFields.category] = []
                newErrors[MainPageFormFields.fromAccount] = []
                newErrors[MainPageFormFields.toAccount] = []
                newErrors[MainPageFormFields.commission] = []
                newErrors[MainPageFormFields.rate] = []
                break
            case MainPageFormFields.account:
                newErrors[field] = ValidatorService.validateAccount(value);
                if (values.type === OperationTypes.OUT) {
                    newErrors[MainPageFormFields.amount] = ValidatorService.validateAmount(values.amount, value?.balance?.amount ? value?.balance?.amount : 0);
                }
                break
            case MainPageFormFields.amount:
                if (values.type === OperationTypes.OUT) {
                    newErrors[field] = ValidatorService.validateAmount(value, values.account?.balance?.amount ? values.account?.balance?.amount : 0);
                } else if (values.type === OperationTypes.TRANSFER) {
                    newErrors[field] = ValidatorService.validateAmount(value, values.fromAccount?.balance?.amount ? values.fromAccount?.balance?.amount : 0);
                    newErrors[MainPageFormFields.commission] = ValidatorService.validateCommission(values.commission, value, values.fromAccount?.balance?.amount ? values.fromAccount?.balance?.amount : 0);
                }
                break
            case MainPageFormFields.fromAccount:
                newErrors[field] = ValidatorService.validateAccount(value);
                newErrors[MainPageFormFields.amount] = ValidatorService.validateAmount(values.amount, value?.balance?.amount ? value?.balance?.amount : 0);
                newErrors[MainPageFormFields.commission] = ValidatorService.validateCommission(values.commission, values.amount, value?.balance?.amount ? value?.balance?.amount : 0);
                newErrors[MainPageFormFields.toAccount] = ValidatorService.validateAccountTo(value, values.toAccount);

                break
            case MainPageFormFields.toAccount:
                newErrors[field] = ValidatorService.validateAccountTo(values.fromAccount, value);
                break
            case MainPageFormFields.rate:
                newErrors[field] = ValidatorService.validateRate(value);
                break
            case MainPageFormFields.commission:
                newErrors[field] = ValidatorService.validateCommission(value, values.amount, values.fromAccount?.balance?.amount ? values.fromAccount?.balance?.amount : 0);
                break
        }
    }

    const validateAll = (fields, newErrors) => {
        Object.entries(errors).map((e) => e[0]).forEach((field) => {
            if (fields.indexOf(field) >= 0) {
                validate(field, values[field], newErrors)
            }
        })
    }

    const handleNext = () => {
        const newErrors = JSON.parse(JSON.stringify(errors))
        const fields = getStepValidationFields(activeStep)
        validateAll(fields, newErrors)
        setErrors(newErrors)
        if (Object.entries(newErrors).filter(([e, v],) => v.length > 0 && fields.indexOf(e) >= 0).length === 0) {
            if (activeStep === steps.length - 1) {
                setIsCreating(true)

                setTimeout(function () {
                    setIsCreating(false)
                }, 3000);

            }
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const steps = ['Type', 'General', 'Review'];

    function getStepValidationFields(step) {
        switch (step) {
            case 0:
                return [MainPageFormFields.type]
            case 1:
                return values.type === OperationTypes.TRANSFER
                    ? [MainPageFormFields.amount, MainPageFormFields.fromAccount, MainPageFormFields.toAccount, MainPageFormFields.commission, MainPageFormFields.rate]
                    : [MainPageFormFields.account, MainPageFormFields.category, MainPageFormFields.amount]
            case 2:
                return []
            default:
                throw new Error('Unknown step');
        }
    }

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <StepOperationType
                    type={values.type}
                    onFieldChange={(prop, value) => handleChange(prop, value)}/>;
            case 1:
                return values.type === OperationTypes.TRANSFER ?
                    <StepOperationTransfer
                        type={values.type}
                        amount={values.amount}
                        fromAccount={values.fromAccount}
                        toAccount={values.toAccount}
                        rate={values.rate}
                        commission={values.commission}
                        accountOptions={accounts}
                        errors={errors}
                        onFieldChange={(prop, value) => handleChange(prop, value)}/>
                    :
                    <StepOperationGeneralInfo
                        type={values.type}
                        amount={values.amount}
                        account={values.account}
                        accountOptions={accounts}
                        category={values.category}
                        categoryOptions={categories.filter((c) => c.type === values.type)}
                        errors={errors}
                        onFieldChange={(prop, value) => handleChange(prop, value)}/>;
            case 2:
                return values.type === OperationTypes.TRANSFER ?
                    <StepOperationTransferReview values={values}/>
                    :
                    <StepOperationReview values={values}/>;
            default:
                throw new Error('Unknown step');
        }
    }

    return (
        <>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={isLoading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Grid container spacing={2}>
                <Grid xs>
                    <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                        <Title>
                            New operation
                        </Title>
                        <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography variant="h5" gutterBottom>
                                    Thank you
                                </Typography>
                                {isCreating ? (
                                    <CircularProgress/>
                                ) : (
                                    <Typography variant="subtitle1">
                                        Operation saved, number is #2001539.
                                    </Typography>
                                )
                                }
                                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button href={"/main"} disabled={isCreating}>
                                        One more operation
                                    </Button>
                                </Box>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {getStepContent(activeStep)}
                                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                    {activeStep !== 0 && (
                                        <Button onClick={handleBack} sx={{mt: 3, ml: 1}}>
                                            Back
                                        </Button>
                                    )}

                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{mt: 3, ml: 1}}
                                    >
                                        {activeStep === steps.length - 1 ? 'Create operation' : 'Next'}
                                    </Button>
                                </Box>
                            </React.Fragment>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}
