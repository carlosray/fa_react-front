import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MainPage from "../views/main/MainPage";
import {CssBaseline} from "@mui/material";
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
            mode: 'light'
        }

        this.changeCurrentGroup = this.changeCurrentGroup.bind(this)
        this.setupGroupsState = this.setupGroupsState.bind(this)
        this.onDeleteGroup = this.onDeleteGroup.bind(this)
        this.onModeChanged = this.onModeChanged.bind(this)
    }

    setupGroupsState() {
        const groups = RestService.getGroups();
        const currentGroup = groups.find((g) => g.isCurrent);

        this.setState({
            currentGroup: currentGroup,
            groups: groups
        })
    }

    componentDidMount() {
        this.setupGroupsState()
        this.setState({
            mode: RestService.getTheme()
        })
    }

    changeCurrentGroup(group) {
        RestService.changeCurrentGroup(group.id)
        this.setupGroupsState()
        //TODO DELETE
        this.setState({
            currentGroup: group
        })
    }

    onDeleteGroup(group) {
        RestService.deleteGroup(group.id)
        this.setupGroupsState()
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
                                            ? <MainPage group={this.state.currentGroup}/>
                                            : <NoGroupTypography/>}
                                    </Route>
                                    <Route path={Paths.STATISTIC.path} exact>
                                        {this.state.currentGroup
                                            ? <StatisticPage group={this.state.currentGroup}/>
                                            : <NoGroupTypography/>}
                                    </Route>
                                    <Route path={Paths.CATEGORIES.path} exact>
                                        {this.state.currentGroup
                                            ? <CategoryPage group={this.state.currentGroup}/>
                                            : <NoGroupTypography/>}
                                    </Route>
                                    <Route path={Paths.ACCOUNTS.path} exact>
                                        {this.state.currentGroup
                                            ? <AccountsPage group={this.state.currentGroup}/>
                                            : <NoGroupTypography/>}
                                    </Route>
                                    <Route path={Paths.GROUPS.path} exact>
                                        <GroupPage currentGroup={this.state.currentGroup}
                                                   groups={this.state.groups}
                                                   onGroupChange={this.changeCurrentGroup}
                                                   onDeleteGroup={this.onDeleteGroup}/>
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