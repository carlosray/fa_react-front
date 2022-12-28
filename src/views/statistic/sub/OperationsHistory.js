import React, {useEffect} from "react";
import Title from "../../../components/Title";
import {
    DataGrid,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarFilterButton
} from '@mui/x-data-grid';
import {OperationTypes} from "../../../model/operationTypes";
import RestService from "../../../service/RestService";

const columns = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'type', type: 'singleSelect', valueOptions: Object.values(OperationTypes), headerName: 'Type', width: 90},
    {field: 'amount', type: 'number', headerName: 'Amount', width: 130},
    {field: 'currency', headerName: 'Currency', width: 130},
    {field: 'category', headerName: 'Category', width: 130},
];


export default function OperationsHistory(props) {
    const [rows, setRows] = React.useState([])

    useEffect(() => {
        if (props.group) {
            const returnedRows = RestService.getOperationHistory(props.group.id);
            setRows(returnedRows)
        }
    }, [props.group]);

    return (
        <React.Fragment>
            <Title>Operations History</Title>
            <div style={{height: 400, width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    components={{
                        Toolbar: CustomToolbar,
                    }}
                    initialState={{
                        sorting: {
                            sortModel: [{field: 'rating', sort: 'desc'}],
                        },
                    }}

                />
            </div>
        </React.Fragment>
    );
}

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton/>
            <GridToolbarFilterButton/>
            <GridToolbarExport/>
        </GridToolbarContainer>
    );
}
