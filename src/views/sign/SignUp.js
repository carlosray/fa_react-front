import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import RestService from "../../service/RestService";
import {Redirect} from "react-router-dom";
import {Paths} from "../../model/paths";
import ValidatorService from "../../service/ValidatorService";
import {Severities} from "../../model/severities";

const theme = createTheme();

export default function SignUp(props) {
    const [form, setForm] = React.useState({
        email: '',
        password: '',
        lastName: '',
        firstName: '',
        marketing: false
    })

    const [errors, setErrors] = React.useState({
        email: [],
        password: [],
        firstName: []
    })

    const handleChange = (event) => {
        const field = event.target.name
        const value = field === 'marketing' ? event.target.checked : event.target.value
        const validation = validate(field, value)

        setForm({...form, [field]: value})
        setErrors({...errors, [field]: validation})
    }

    const validate = (field, value) => {
        switch (field) {
            case 'email':
                return ValidatorService.validateEmail(value);
            case 'password':
                return ValidatorService.validatePwd(value);
            case 'firstName':
                return ValidatorService.validateFirstName(value);
            default:
                return [];
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const emailValidation = validate('email', form.email)
        const pwdValidation = validate('password', form.password)
        const firstNameValidation = validate('firstName', form.firstName)

        setErrors({
            email: emailValidation,
            password: pwdValidation,
            firstName: firstNameValidation
        })
        if (emailValidation.length === 0 && pwdValidation.length === 0 && firstNameValidation.length === 0) {
            RestService.register(form)
                .then(r => {
                    props.alert("Registered", `User with login ${r.data.login} is registered`, Severities.SUCCESS, 2000, () => {
                        document.location.href = Paths.SIGN_IN.path
                    })

                })
                .catch(e => {
                    props.alert("Failed to register", RestService.getErrorMessage(e))
                })
        }
    };

    return (
        <ThemeProvider theme={theme}>
            {RestService.isUserLoggedIn() && <Redirect to={Paths.MAIN.path}/>}
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={errors.firstName.length !== 0}
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    onChange={handleChange}
                                    autoFocus
                                    helperText={errors.firstName.join('. ')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    onChange={handleChange}
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={errors.email.length !== 0}
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    onChange={handleChange}
                                    autoComplete="email"
                                    helperText={errors.email.join('. ')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={errors.password.length !== 0}
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    helperText={errors.password.join('. ')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox name="marketing" color="primary"
                                                       onChange={handleChange}/>}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            onClick={handleSubmit}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href={Paths.SIGN_IN.path} variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}