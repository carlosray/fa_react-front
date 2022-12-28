import React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import {Paths} from "../model/paths";

export default function NoGroupTypography() {

    return <>
        <Typography component={"h2"}>No group selected. <Link href={Paths.GROUPS.path}>Choose or create</Link></Typography>
    </>;
}