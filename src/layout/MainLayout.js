import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MainPage from "../views/main/MainPage";
import {Backdrop, CircularProgress, CssBaseline} from "@mui/material";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from "@mui/material/Toolbar";
import NotFoundPage from "../views/NotFoundPage";
import Container from "@mui/material/Container";
import RestService from "../service/RestService";
import StatisticPage from "../views/statistic/StatisticPage";
import CategoryPage from "../views/category/CategoryPage";
import SettingsPage from "../views/settings/SettingsPage";
import {Paths} from "../model/paths";
import AccountsPage from "../views/accounts/AccountsPage";
import GroupPage from "../views/group/GroupPage";
import FuncComponent from "../components/FuncComponent";
import NoGroupTypography from "../components/NoGroupTypography";

class MainLayout extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            currentGroup: '',
            groups: [],
            mode: 'light',
            groupsIsLoading: false
        }

        this.changeCurrentGroup = this.changeCurrentGroup.bind(this)
        this.onGroupCreate = this.onGroupCreate.bind(this)
        this.onGroupUpdate = this.onGroupUpdate.bind(this)
        this.setupGroupsState = this.setupGroupsState.bind(this)
        this.onDeleteGroup = this.onDeleteGroup.bind(this)
        this.onModeChanged = this.onModeChanged.bind(this)
        this.updateGroupBalance = this.updateGroupBalance.bind(this)
    }

    setupGroupsState() {
        this.setState({
            groupsIsLoading: true
        })
        RestService.getGroups()
            .then((r) => {
                const c = RestService.getCurrentGroupId();
                console.log(c)
                const groups = r.data;
                let currentGroup = groups.find((g) => g.id == c);
                // if (currentGroup === undefined && groups?.length > 0) {
                //     console.log(currentGroup)
                //     currentGroup = groups[0];
                // }
                groups.sort(this.compare)
                this.setState({
                    currentGroup: currentGroup,
                    groups: groups
                })
            })
            .catch((e) => {
                this.props.alert("Failed to load groups", RestService.getErrorMessage(e))
            })
            .finally(() => {
                this.setState({
                    groupsIsLoading: false
                })
            });
    }

    compare(a, b) {
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }
        return 0;
    }

    componentDidMount() {
        this.setupGroupsState()
        this.setState({
            mode: RestService.getTheme()
        })
    }

    changeCurrentGroup(groupId) {
        RestService.setCurrentGroupId(groupId)
        this.setupGroupsState()
    }

    updateGroupBalance(balance) {
        this.state.currentGroup.balance = balance
    }

    onDeleteGroup() {
        this.setupGroupsState()
    }

    onGroupCreate(group, setCurrent) {
        let cGroup = this.state.currentGroup;
        if (setCurrent && group?.id != this.state.currentGroup?.id) {
            RestService.setCurrentGroupId(group.id)
            cGroup = group
        }
        const joined = this.state.groups.concat(group);
        this.setState({
            currentGroup: cGroup,
            groups: joined
        })
    }

    onGroupUpdate(group, setCurrent) {
        if (setCurrent && group?.id != this.state.currentGroup?.id) {
            RestService.setCurrentGroupId(group.id)
            this.setState({
                currentGroup: group
            })
        }
        const newGroups = new Array(this.state.groups.length)
        let changed = false
        this.state.groups.forEach((s, i) => {
            newGroups[i] = s
            if (newGroups[i].id === group.id) {
                newGroups[i] = group
                changed = true
            }
        })
        if (changed) {
            this.setState({
                groups: newGroups
            })
        }

    }

    onModeChanged(theme) {
        this.setState({
            mode: theme
        })
        RestService.setTheme(theme)
    }

    render() {
        return (
            <>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={this.state.groupsIsLoading}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
                <ThemeProvider theme={createTheme({
                    palette: {
                        mode: this.state.mode,
                    }
                })}>
                    <Box sx={{display: 'flex'}}>
                        <CssBaseline/>
                        <Sidebar currentGroup={this.state.currentGroup?.name}
                                 balance={this.state.currentGroup?.balance}
                                 onUpdateClick={() => this.setupGroupsState()}/>
                        <Box
                            component="main"
                            sx={{
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'light'
                                        ? theme.palette.grey[100]
                                        : theme.palette.grey[900],
                                flexGrow: 1,
                                height: '100vh',
                                overflow: 'auto',
                            }}
                        >
                            <Toolbar/>
                            <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                                <Switch>
                                    <Route path="/" exact>
                                        <Redirect to={Paths.MAIN.path}/>
                                    </Route>
                                    <Route path={Paths.MAIN.path} exact>
                                        {this.state.currentGroup
                                            ? <MainPage group={this.state.currentGroup} alert={this.props.alert}
                                                        updateGroupBalance={this.updateGroupBalance}/>
                                            : <NoGroupTypography/>}
                                    </Route>
                                    <Route path={Paths.STATISTIC.path} exact>
                                        {this.state.currentGroup
                                            ? <StatisticPage group={this.state.currentGroup} alert={this.props.alert}/>
                                            : <NoGroupTypography/>}
                                    </Route>
                                    <Route path={Paths.CATEGORIES.path} exact>
                                        {this.state.currentGroup
                                            ? <CategoryPage group={this.state.currentGroup} alert={this.props.alert}/>
                                            : <NoGroupTypography/>}
                                    </Route>
                                    <Route path={Paths.ACCOUNTS.path} exact>
                                        {this.state.currentGroup
                                            ? <AccountsPage group={this.state.currentGroup} alert={this.props.alert}/>
                                            : <NoGroupTypography/>}
                                    </Route>
                                    <Route path={Paths.GROUPS.path} exact>
                                        <GroupPage currentGroup={this.state.currentGroup}
                                                   groups={this.state.groups}
                                                   onGroupCreate={this.onGroupCreate}
                                                   onGroupUpdate={this.onGroupUpdate}
                                                   onGroupChange={this.changeCurrentGroup}
                                                   onDeleteGroup={this.onDeleteGroup}
                                                   alert={this.props.alert}
                                                   isLoading={this.state.groupsIsLoading}
                                        />
                                    </Route>
                                    <Route path={Paths.SETTINGS.path} exact>
                                        <SettingsPage theme={this.state.mode} onThemeChanged={this.onModeChanged}/>
                                    </Route>
                                    <Route path={Paths.LOGOUT.path} exact>
                                        <FuncComponent onInit={RestService.logout}/>
                                    </Route>
                                    <Route path="*" component={NotFoundPage}/>
                                </Switch>
                            </Container>
                        </Box>
                    </Box>
                </ThemeProvider>
            </>
        );
    }
}

export default MainLayout;