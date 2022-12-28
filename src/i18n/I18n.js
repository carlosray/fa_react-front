import * as React from 'react';
import {Translations} from "./translations/en";
import PropTypes from "prop-types";

function I18n(props) {
    return (
        <>{i18n(props.children)}</>
    );
}

 I18n.propTypes = {
    children: PropTypes.node,
};

export default I18n;

export const i18n = (s) => {
    return Translations[s]
}