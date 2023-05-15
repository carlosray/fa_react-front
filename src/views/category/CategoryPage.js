import React, {useEffect} from "react";
import {Box, FormControl, InputLabel, Select, TableCell, TextField} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CommonEditTable from "../../components/CommonEditTable";
import RestService from "../../service/RestService";
import I18n from "../../i18n/I18n";
import MenuItem from "@mui/material/MenuItem";
import {OperationTypes} from "../../model/operationTypes";
import {Severities} from "../../model/severities";
import ValidatorService from "../../service/ValidatorService";
import FormHelperText from "@mui/material/FormHelperText";


export default function CategoryPage(props) {
    const [categories, setCategories] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false)

    useEffect(() => {
        if (props.group) {
            setIsLoading(true)
            RestService.getCategories(props.group.id)
                .then(r => {
                    setCategories(r.data)
                })
                .catch((e) => {
                    props.alert("Failed to load categories", RestService.getErrorMessage(e))
                })
                .finally(() => {
                    setIsLoading(false)
                });
        }
    }, [props.group]);

    const handleSave = (category) => {
        if (category.id) {
            setIsLoading(true)
            RestService.updateCategory(props.group.id, category.id, category.name, category.type)
                .then(r => {
                    const newElement = r.data
                    for (let i = 0; i < categories.length; i++) {
                        if (categories[i].id == newElement.id) {
                            categories[i] = newElement
                        }
                    }
                    props.alert("Category updated", `Category ${category.name} updated`, Severities.INFO)
                })
                .catch((e) => {
                    props.alert("Failed to update category", RestService.getErrorMessage(e))
                })
                .finally(() => {
                    setIsLoading(false)
                })
        } else {
            setIsLoading(true)
            RestService.createCategory(props.group.id, category.name, category.type)
                .then(r => {
                    const joined = categories.concat(r.data);
                    setCategories(joined)
                    props.alert("Category created", `Category ${category.name} created`, Severities.INFO)
                })
                .catch((e) => {
                    props.alert("Failed to create category", RestService.getErrorMessage(e))
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    };

    const handleDelete = (category) => {
        setIsLoading(true)
        RestService.deleteCategory(props.group.id, category.id)
            .then((r) => {
                const index = categories.indexOf(category);
                if (index > -1) {
                    const n = categories
                    n.splice(index, 1);
                    setCategories(n)
                    props.alert("Category deleted", `Category ${category.name} deleted`, Severities.INFO)
                }
            })
            .catch((e) => {
                props.alert("Failed to delete category", RestService.getErrorMessage(e))
            })
            .finally(() => {
                setIsLoading(false)
            })
    };

    const validate = (field, value) => {
        switch (field) {
            case 'name':
                return ValidatorService.validateSpecified(field, value);
            case 'type':
                return ValidatorService.validateSpecified(field, value);
            default:
                return [];
        }
    }

    return (
        <>
            <Grid container spacing={2}>
                <CommonEditTable
                    isLoading={isLoading}
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
                                       error={errors?.name && errors.name.length !== 0}
                                       helperText={errors?.name ? errors.name.join('. ') : ''}
                                       onChange={handleChange('name')}/>
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    error={errors?.type && errors.type.length !== 0}
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
                                <FormHelperText error={errors?.type && errors.type.length !== 0}>
                                    {errors?.type ? errors.type.join('. ') : ''}
                                </FormHelperText>
                            </FormControl>

                        </Box>
                    )}
                    onDelete={handleDelete}
                    onSave={handleSave}
                    validate={validate}
                    validationProps={['name', 'type']}
                />
            </Grid>
        </>
    );
}
