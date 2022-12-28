import axios from 'axios'
import {OperationTypes} from "../model/operationTypes";
import {Currencies} from "../model/currencies";
import {Paths} from "../model/paths";

const API_URL = process.env.REACT_APP_BACKEND_URI + "/api"
const AUTH_URL = process.env.REACT_APP_BACKEND_URI + "/auth"

const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
const TOKEN_SESSION_ATTRIBUTE_NAME = 'jwtToken'

const THEME_ATTRIBUTE_NAME = 'themeMode'
class RestService {

    executeJwtAuthenticationService(username, password) {
        return axios.post(`${AUTH_URL}/login`, {
            username,
            password
        })
    }

    executeRegisterService(values) {
        return axios.post(`${AUTH_URL}/register`, values)
    }

    executeApiAddNew(values) {
        return axios.post(`${API_URL}/subscription`, values)
    }

    executeApiGetAll(withStatus) {
        return axios.get(`${API_URL}/subscription?withStatus=` + withStatus)
    }

    executeApiDelete(id) {
        return axios.delete(`${API_URL}/subscription/` + id)
    }

    executeApiUserInfo() {
        return axios.get(`${API_URL}/user`)
    }

    executeSearch(type, value) {
        return axios.get(`${API_URL}/search?type=` + type + `&value=` + value)
    }

    executeCount() {
        return axios.get(`${API_URL}/count`)
    }

    executeApiSaveUserInfo(values) {
        return axios.post(`${API_URL}/user`, values)
    }

    registerSuccessfulLoginForJwt(username, token) {
        localStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username)
        localStorage.setItem(TOKEN_SESSION_ATTRIBUTE_NAME, token)
    }

    createJWTToken(token) {
        return 'Bearer ' + token
    }

    logout() {
        localStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
        document.location.href = Paths.SIGN_IN.path
    }

    isUserLoggedIn() {
        let user = localStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) return false
        return true
    }

    getTheme() {
        console.log("getTheme")
        let theme = localStorage.getItem(THEME_ATTRIBUTE_NAME)
        if (theme === null) return 'light'
        return theme
    }

    setTheme(theme) {
        console.log("setTheme theme = " + theme)
        localStorage.setItem(THEME_ATTRIBUTE_NAME, theme)
    }

    //TODO API CALL
    changeCurrentGroup(groupId) {
        console.log("changeCurrentGroup group = " + groupId)

    }

    //TODO API CALL
    deleteGroup(groupId) {
        console.log("deleteGroup group = " + groupId)
    }

    //TODO API CALL
    getGroups() {
        console.log("getGroups")
        return [
            {
                id: 45,
                name: 'Family',
                isCurrent: true,
                users: ["ivanov"],
                balance: {
                    amount: Math.floor(Math.random() * 400),
                    currency: 'USD',
                    lastUpdate: '2022-12-12T16:22:00Z'
                }
            },
            {
                id: 46,
                name: 'Private',
                isCurrent: false,
                users: ["ivanov", "petrov"],
                balance: {
                    amount: Math.floor(Math.random() * 400),
                    currency: 'GEL',
                    lastUpdate: '2022-12-12T16:22:00Z'
                }
            }
        ]
    }

    //TODO API CALL
    getOperationHistory(groupId) {
        console.log("getOperationHistory group = " + groupId)
        if (groupId == null) {
            return []
        }
        return [
            {id: 1, type: OperationTypes.IN, amount: 173.12, currency: Currencies.GEL, category: 'Home'},
            {id: 2, type: OperationTypes.OUT, amount: 33, currency: Currencies.GEL, category: 'Home'},
            {id: 3, type: OperationTypes.IN, amount: 123123, currency: Currencies.USD, category: 'Home'},
            {id: 4, type: OperationTypes.OUT, amount: 2000, currency: Currencies.USD, category: 'Home'},
            {id: 5, type: OperationTypes.OUT, amount: 1, currency: Currencies.RUB, category: 'Home'},
            {id: 6, type: OperationTypes.IN, amount: 90, currency: Currencies.EUR, category: 'Home'},
            {id: 7, type: OperationTypes.IN, amount: 3, currency: Currencies.USD, category: 'Home'},
            {id: 8, type: OperationTypes.OUT, amount: 234, currency: Currencies.EUR, category: 'Home'},
            {id: 9, type: OperationTypes.OUT, amount: 2.3332, currency: Currencies.USD, category: 'Home'},
        ];
    }

    //TODO API CALL
    getCategories(groupId) {
        console.log("getCategories group = " + groupId)
        if (groupId == null) {
            return []
        }
        return [
            {
                id: 10,
                name: "Food",
                type: OperationTypes.OUT
            },
            {
                id: 12,
                name: "Restaurant",
                type: OperationTypes.OUT
            },
            {
                id: 13,
                name: "House",
                type: OperationTypes.OUT
            },
            {
                id: 14,
                name: "Salary",
                type: OperationTypes.IN
            },
            {
                id: 15,
                name: "Investment",
                type: OperationTypes.IN
            },
        ]
    }

    //TODO API CALL
    getAccounts(groupId) {
        console.log("getAccounts group = " + groupId)
        if (groupId == null) {
            return []
        }
        return [
            {
                id: 20,
                name: "Cash",
                balance: {
                    amount: Math.floor(Math.random() * 400),
                    currency: 'GEL',
                    lastUpdate: '2022-12-01T13:14:00Z'
                }
            },
            {
                id: 23,
                name: "Card",
                balance: {
                    amount: Math.floor(Math.random() * 400),
                    currency: 'USD',
                    lastUpdate: '2022-12-12T16:22:00Z'
                }
            }
        ]
    }

    getLoggedInUserName() {
        let user = localStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) return ''
        return user
    }

    setupAxiosInterceptors() {
        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = this.createJWTToken(localStorage.getItem(TOKEN_SESSION_ATTRIBUTE_NAME))
                }
                return config
            }
        )
        axios.interceptors.response.use(
            (response) => {
                if (response.status !== 401) {

                }
                return response;
            },
            error => {
                if (error.response.status === 401) {
                    this.logout()
                } else {
                    return Promise.reject(error)
                }
            });
    }
}

export default new RestService()