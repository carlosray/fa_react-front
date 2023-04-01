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

const theme = createTheme();

export default function SignIn(props) {
    const [form, setForm] = React.useState({
        email: '',
        password: '',
        remember: false
    })

    const [errors, setErrors] = React.useState({
        email: [],
        password: [],
    })

    const [loggedIn, setLoggedIn] = React.useState(false)

    const handleChange = (event) => {
        const field = event.target.name
        const value = field === 'remember' ? event.target.checked : event.target.value
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
            default:
                return [];
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const emailValidation = validate('email', form.email)
        const pwdValidation = validate('password', form.password)

        setErrors({
            email: emailValidation,
            password: pwdValidation
        })
        if (emailValidation.length === 0 && pwdValidation.length === 0) {
            RestService.login(form.email, form.password)
                .then(() => setLoggedIn(true))
                .catch((e) => {
                    props.alert("Failed to login", RestService.getErrorMessage(e))
                })
        }
    };

    return (
        <ThemeProvider theme={theme}>
            {(loggedIn || RestService.isUserLoggedIn()) && <Redirect to={Paths.MAIN.path}/>}
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
                        Sign in
                    </Typography>
                    <Box component="form" noValidate sx={{mt: 1}}>
                        <TextField
                            error={errors.email.length !== 0}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            onChange={handleChange}
                            autoComplete="email"
                            autoFocus
                            helperText={errors.email.join('. ')}
                        />
                        <TextField
                            error={errors.password.length !== 0}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            onChange={handleChange}
                            id="password"
                            autoComplete="current-password"
                            helperText={errors.password.join('. ')}
                        />
                        <FormControlLabel
                            control={<Checkbox name="remember" value="remember" color="primary"
                                               onChange={handleChange}/>}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            onClick={handleSubmit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href={Paths.SIGN_UP.path} variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}