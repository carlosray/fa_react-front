import React, {useEffect} from "react";
import {Box, FormControl, InputLabel, Select, TableCell, TextField} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CommonEditTable from "../../components/CommonEditTable";
import RestService from "../../service/RestService";
import I18n from "../../i18n/I18n";
import MenuItem from "@mui/material/MenuItem";
import {OperationTypes} from "../../model/operationTypes";


export default function CategoryPage(props) {
    const [categories, setCategories] = React.useState([]);

    useEffect(() => {
        if (props.group) {
            const returnedCategories = RestService.getCategories(props.group.id);
            setCategories(returnedCategories)
        }
    }, [props.group]);

    const handleSave = (category) => {
        console.log("Category saved: " + JSON.stringify(category));
    };

    const handleDelete = (category) => {
        console.log("Category deleted: " + JSON.stringify(category));
    };

    return (
        <>
            <Grid container spacing={2}>
                <CommonEditTable
                    isLoading={false}
                    title={"Category"}
                    columns={[
                        <TableCell key={1}>Name</TableCell>,
                        <TableCell key={2} align="right">Type</TableCell>,
                    ]}
                    values={categories}
                    row={(v) => (
                        <>
                            <TableCell component="th" scope="row">
                                {v.name}
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                                <I18n>{v.type}</I18n>
                            </TableCell>
                        </>
                    )}
                    form={(values, errors, handleChange) => (
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': {m: 1, width: '25ch'},
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField id="name"
                                       label="Name"
                                       variant="standard"
                                       value={values?.name ? values?.name : ''}
                                       onChange={handleChange('name')}/>
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={values?.type ? values.type : ''}
                                    label="Currency"
                                    onChange={handleChange('type')}
                                >
                                    <MenuItem key={OperationTypes.IN} value={OperationTypes.IN}>
                                        <I18n>{OperationTypes.IN}</I18n>
                                    </MenuItem>
                                    <MenuItem key={OperationTypes.OUT} value={OperationTypes.OUT}>
                                        <I18n>{OperationTypes.OUT}</I18n>
                                    </MenuItem>
                                </Select>
                            </FormControl>

                        </Box>
                    )}
                    onDelete={handleDelete}
                    onSave={handleSave}
                />
            </Grid>
        </>
    );
}
