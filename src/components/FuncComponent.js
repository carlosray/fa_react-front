import React from "react";
import {useEffect} from "react";

export default function FuncComponent(props) {

    useEffect(() => {
        props.onInit()
    });

    return <></>;
}