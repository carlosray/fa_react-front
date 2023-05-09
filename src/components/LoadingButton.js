import React from 'react';
import PropTypes from 'prop-types';
import {Check} from "@mui/icons-material";
import {Button, CircularProgress} from "@mui/material";

const LoadingButton = (props) => {
    const {loading, done, ...other} = props;

    if (done) {
        return (
            <Button {...other} disabled>
                <Check/>
            </Button>
        );
    } else if (loading) {
        return (
            <Button {...other}>
                <CircularProgress/>
            </Button>
        );
    } else {
        return (
            <Button {...other} />
        );
    }
}

LoadingButton.defaultProps = {
    loading: false,
    done: false,
};

LoadingButton.propTypes = {
    loading: PropTypes.bool,
    done: PropTypes.bool,
};

export default LoadingButton;