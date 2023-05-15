import React from "react";
import {Backdrop, CircularProgress, Paper, Stack, TableCell, TableHead} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import AddIcon from '@mui/icons-material/Add';
import IconButton from "@mui/material/IconButton";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Title from "./Title";
import PropTypes from "prop-types";
import CommonEditForm from "./CommonEditForm";


export default function CommonEditTable(props) {

    const [isCreating, setIsCreating] = React.useState(false)
    const [isEdit, setIsEdit] = React.useState(null) //object or null
    const [isOpenDeleteAlert, setIsOpenDeleteAlert] = React.useState(null) //object or null

    //delete dialog
    const handleClickOpenDeleteAlert = (obj) => (event) => {
        setIsOpenDeleteAlert(obj);
    };

    const handleCloseDeleteAlert = (isDelete) => (event) => {
        if (isDelete) {
            props.onDelete(isOpenDeleteAlert)
        }
        setIsOpenDeleteAlert(null);
    };

    //edit
    const handleClickEdit = (obj) => (event) => {
        if (isEdit && isEdit.id === obj.id) {
            setIsEdit(null);
        } else {
            setIsEdit(obj)
        }
    };

    //save
    const handleSave = (obj) => {
        props.onSave(obj)
        setIsCreating(null)
        setIsEdit(null)
    };

    const handleCloseSave = (obj) => {
        if (isEdit && obj?.id === isEdit.id) {
            setIsEdit(null)
        } else {
            setIsCreating(null)
        }
    };

    return (
        <>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={props.isLoading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Grid xs>
                <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                    <Title>
                        {props.title}
                    </Title>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {props.columns}
                                    <TableCell align="right">Edit</TableCell>
                                    <TableCell align="right">Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.values.map((v, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >

                                        {props.row(v)}

                                        <TableCell align="right">
                                            <IconButton color="primary" aria-label="edit group"
                                                        onClick={handleClickEdit(v)}>
                                                {isEdit && isEdit?.id === v.id ? (<DoDisturbIcon/>) : (<EditIcon/>)}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton color="error" aria-label="delete group"
                                                        onClick={handleClickOpenDeleteAlert(v)}>
                                                <DeleteForeverIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Dialog
                        open={isOpenDeleteAlert !== null}
                        onClose={handleCloseDeleteAlert(false)}
                        aria-labelledby="delete-alert-dialog-title"
                        aria-describedby="delete-alert-dialog-description"
                    >
                        <DialogTitle id="delete-alert-dialog-title" color={"red"}>
                            {`Delete ${props.title.toLowerCase()}?`}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="delete-alert-dialog-description">
                                Are you sure you want to delete the { props.title.toLowerCase()}
                                <b>{isOpenDeleteAlert?.name}</b>?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteAlert(false)} autoFocus variant="outlined">No</Button>
                            <Button onClick={handleCloseDeleteAlert(true)} variant="contained" color="error">
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Grid item xs={12} sm={5}>
                        <Stack direction="row">
                            <Typography sx={{m: 2}}>
                                Create new {props.title.toLowerCase()}
                            </Typography>
                            <IconButton color="primary" aria-label="Create new"
                                        size="large"
                                        onClick={() => {
                                            setIsCreating(!isCreating)
                                        }}>
                                {isCreating ? (<DoDisturbIcon/>) : (<AddIcon/>)}
                            </IconButton>
                        </Stack>
                    </Grid>
                </Paper>

                {isEdit && (
                    <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                        <Grid container spacing={3}>
                            <CommonEditForm initialObj={isEdit}
                                            title={props.title}
                                            form={props.form}
                                            validate={props.validate}
                                            validationProps={props.validationProps}
                                            onSave={handleSave}
                                            onCancel={handleCloseSave}/>
                        </Grid>
                    </Paper>
                )}

                {isCreating && (
                    <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                        <Grid container spacing={3}>
                            <CommonEditForm initialObj={null}
                                            title={props.title}
                                            form={props.form}
                                            validate={props.validate}
                                            validationProps={props.validationProps}
                                            onSave={handleSave}
                                            onCancel={handleCloseSave}/>
                        </Grid>
                    </Paper>
                )}
            </Grid>
        </>
    );
}

CommonEditTable.propTypes = {
    title: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    columns: PropTypes.array.isRequired,
    values: PropTypes.array.isRequired,
    row: PropTypes.func.isRequired,
    form: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};