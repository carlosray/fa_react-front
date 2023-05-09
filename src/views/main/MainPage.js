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
import {Severities} from "../../model/severities";

export const MainPageFormFields = {
    type: 'type',
    amount: 'amount',
    account: 'account',
    category: 'category',
    fromAccount: 'fromAccount',
    toAccount: 'toAccount',
    commission: 'commission',
    rate: 'rate',
    description: 'description'
}

export default function MainPage(props) {

    const [activeStep, setActiveStep] = React.useState(0);
    const [categories, setCategories] = React.useState([]);
    const [accounts, setAccounts] = React.useState([]);
    const [isCreating, setIsCreating] = React.useState(false);
    const [creatingError, setCreatingError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [resultOpId, setResultOpId] = React.useState(null);

    const [errors, setErrors] = React.useState({
        account: [],
        fromAccount: [],
        toAccount: [],
        category: [],
        amount: [],
        commission: [],
        rate: [],
        description: []
    })

    const [values, setValues] = React.useState({
        type: OperationTypes.OUT,
        amount: 1,
        category: {},
        account: {},
        commission: 0,
        rate: 1,
        fromAccount: {},
        toAccount: {},
        description: ""
    });

    useEffect(() => {
        if (props.group) {
            setIsLoading(true)
            const cp = RestService.getCategories(props.group.id)
                .catch((e) => {
                    props.alert("Failed to load categories", RestService.getErrorMessage(e))
                })
            const ap = RestService.getAccounts(props.group.id)
                .catch((e) => {
                    props.alert("Failed to load accounts", RestService.getErrorMessage(e))
                })
            Promise.all([cp, ap])
                .then((r) => {
                    const returnedCategories = r[0].data
                    const returnedAccounts = r[1].data
                    setCategories(returnedCategories)
                    setAccounts(returnedAccounts)
                    setValues({
                        ...values,
                        category: returnedCategories.find((c) => c.type === values.type),
                        account: returnedAccounts[0],
                        amount: returnedAccounts[0] ? returnedAccounts[0].balance.amount < 100 ? returnedAccounts[0].balance.amount : 100 : 0,
                        fromAccount: returnedAccounts[0],
                        toAccount: returnedAccounts[1],
                    })
                })
                .finally(() => {
                    setIsLoading(false)
                })
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
                if (!value || parseInt(value) <= 0) {
                    newErrors[field] = ["Amount must be greater than 0"]
                } else if (values.type === OperationTypes.OUT) {
                    newErrors[field] = ValidatorService.validateAmount(value, values.account?.balance?.amount ? values.account?.balance?.amount : 0);
                } else if (values.type === OperationTypes.TRANSFER) {
                    newErrors[field] = ValidatorService.validateAmount(value, values.fromAccount?.balance?.amount ? values.fromAccount?.balance?.amount : 0);
                    newErrors[MainPageFormFields.commission] = ValidatorService.validateCommission(values.commission, value, values.fromAccount?.balance?.amount ? values.fromAccount?.balance?.amount : 0);
                } else {
                    newErrors[field] = []
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
                createOperation()
            }
            setActiveStep(activeStep + 1);
        }
    };

    const createOperation = () => {
        setIsCreating(true)
        setCreatingError("")
        RestService.createOperation(getOperationDetail(), values.description, props.group.id)
            .then(r => {
                const o = r.data
                setResultOpId(o.id)
                props.alert("Operation created", `Operation number ${o.id} successfully created`, Severities.SUCCESS)
                tryUpdateBalance(new Date(), 0, 3)
            })
            .catch((e) => {
                const msg = RestService.getErrorMessage(e)
                props.alert("Failed create operation", msg)
                setCreatingError(msg)
            })
            .finally(() => {
                setIsCreating(false)
            })
    };

    const tryUpdateBalance = (now, i, max) => {
        if (i < max) {
            setTimeout(function () {
                console.log("tryUpdateBalance #" + i + 1)
                RestService.getGroupBalance(props.group.id)
                    .then((r) => {
                        const b = r.data
                        if (b.balance.lastUpdate < now) {
                            tryUpdateBalance(now, i + 1, max)
                        } else  {
                            props.updateGroupBalance(b.balance)
                        }
                    })
                    .catch((e) => {
                        console.log("Error updating group balance: " + RestService.getErrorMessage(e))
                    })
            }, 1000);
        }
    }

    const isCommission = () => {
        return values[MainPageFormFields.commission] !== null && values[MainPageFormFields.commission] > 0;
    };

    const isRate = () => {
        return values[MainPageFormFields.fromAccount].balance.currency !== values[MainPageFormFields.toAccount].balance.currency;
    };
    const getResultAmount = () => {
        return (values[MainPageFormFields.amount] - (isCommission() ? values[MainPageFormFields.commission] : 0)) * (isRate() ? values[MainPageFormFields.rate] : 1)
    };

    const getOperationDetail = () => {
        switch (values.type) {
            case OperationTypes.IN:
                return {
                    type: OperationTypes.IN,
                    fromCategory: values.category.id,
                    toAccount: values.account.id,
                    amount: values.amount
                }
            case OperationTypes.OUT:
                return {
                    type: OperationTypes.OUT,
                    fromAccount: values.account.id,
                    toCategory: values.category.id,
                    amount: values.amount
                }
            case OperationTypes.TRANSFER:
                return {
                    type: OperationTypes.TRANSFER,
                    fromAccount: values.fromAccount.id,
                    toAccount: values.toAccount.id,
                    amount: values.amount,
                    commission: values.commission,
                    rate: values.rate,
                    resultAmount: getResultAmount()
                }
            default:
                throw new Error('Unknown type ' + values.type);
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
                    <StepOperationTransferReview values={values}
                                                 isCommission={isCommission}
                                                 isRate={isRate}
                                                 resultAmount={getResultAmount}
                                                 onFieldChange={(prop, value) => handleChange(prop, value)}/>
                    :
                    <StepOperationReview values={values} onFieldChange={(prop, value) => handleChange(prop, value)}/>;
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
                                    {creatingError ? "Error" : "Thank you"}
                                </Typography>
                                {isCreating ? (
                                    <CircularProgress/>
                                ) : creatingError ? (
                                    <Typography variant="subtitle1">
                                        {creatingError}
                                    </Typography>
                                ) : (
                                    <Typography variant="subtitle1">
                                        Operation saved, number is {resultOpId}.
                                    </Typography>
                                )
                                }
                                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                    {creatingError ? (
                                        <Button disabled={isCreating} onClick={createOperation}>
                                            Try again
                                        </Button>
                                    ) : (
                                        <Button href={"/main"} disabled={isCreating}>
                                            One more operation
                                        </Button>
                                    )
                                    }
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
