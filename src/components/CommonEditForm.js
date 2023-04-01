import React, {useEffect} from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {Box} from "@mui/material";
import Button from "@mui/material/Button";
import Title from "./Title";

export default function CommonEditForm(props) {

    const [values, setValues] = React.useState(props.initialObj);
    const [errors, setErrors] = React.useState({})

    useEffect(() => {
        setValues(props.initialObj)
    }, [props.initialObj]);

    const handleChange = (prop) => (event) => {
        const validation = props.validate ? props.validate(prop, event.target.value) : []

        setValues({...values, [prop]: event.target.value});
        setErrors({...errors, [prop]: validation});
    };

    const handleSave = () => {
        props.onSave(values)
    };

    const handleCancel = () => {
        props.onCancel(values)
    };

    return (
        <>
            <Grid container spacing={2}>
                <Title>
                    {props.initialObj
                        ? (<p> Edit {props.title.toLowerCase()} <b>{props.initialObj?.name}</b></p>)
                        : `New ${props.title.toLowerCase()}`}
                </Title>
                <Grid xs={12}>
                    {props.form(values, errors, handleChange)}
                    <Box>
                        <Button onClick={handleCancel} sx={{mt: 3, ml: 1}}>
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleSave}
                            sx={{mt: 3, ml: 1}}
                        >
                            {values?.id ? 'Save changes' : `Save new ${props.title.toLowerCase()}`}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
