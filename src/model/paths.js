import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import BarChartIcon from "@mui/icons-material/BarChart";
import CategoryIcon from "@mui/icons-material/Category";
import GroupsIcon from "@mui/icons-material/Groups";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import * as React from "react";

export const Paths = {
    MAIN: {
        index: 1,
        path: '/main',
        name: 'New Operation',
        icon: <CurrencyExchangeIcon/>
    },
    STATISTIC: {
        index: 2,
        path: '/statistic',
        name: 'Statistic',
        icon: <BarChartIcon/>
    },
    CATEGORIES: {
        index: 3,
        path: '/categories',
        name: 'Categories',
        icon: <CategoryIcon/>
    },
    ACCOUNTS: {
        index: 4,
        path: '/accounts',
        name: 'Accounts',
        icon: <AccountBalanceWalletIcon/>
    },
    GROUPS: {
        index: 5,
        path: '/groups',
        name: 'Groups',
        icon: <GroupsIcon/>
    },
    SETTINGS: {
        index: 6,
        path: '/settings',
        name: 'Settings',
        icon: <SettingsIcon/>
    },
    LOGOUT: {
        index: 7,
        path: '/logout',
        name: 'Log out',
        icon: <LogoutIcon/>
    },
    SIGN_IN: {
        index: 8,
        path: '/login',
        name: 'Sign In',
    },
    SIGN_UP: {
        index: 9,
        path: '/register',
        name: 'Sign Up',
    }
}