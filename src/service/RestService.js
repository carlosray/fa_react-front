import axios, {AxiosResponse} from 'axios'
import {OperationTypes} from "../model/operationTypes";
import {Currencies} from "../model/currencies";
import {Paths} from "../model/paths";

const API_URL = process.env.REACT_APP_BACKEND_URI || '/api'

const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
const ACCESS_TOKEN_ATTRIBUTE_NAME = 'accessToken'
const REFRESH_TOKEN_ATTRIBUTE_NAME = 'refreshToken'
const CURRENT_GROUP = 'currentGroup'

const THEME_ATTRIBUTE_NAME = 'themeMode'

class RestService {

    login(username, password): Promise<AxiosResponse> {
        return axios.post(`${API_URL}/auth/login`,
            {
                "login": username,
                "password": password
            }
        )
            .then((r) => {
                this.registerSuccessfulLoginForJwt(r.data["accessToken"], r.data["refreshToken"], username)
                return r
            })
    }

    tryRefresh(): Promise<AxiosResponse> {
        return axios.put(`${API_URL}/auth/refresh`,
            {
                "accessToken": localStorage.getItem(ACCESS_TOKEN_ATTRIBUTE_NAME),
                "refreshToken": localStorage.getItem(REFRESH_TOKEN_ATTRIBUTE_NAME)
            }
        ).then((r) => {
            this.setTokens(r.data["accessToken"], r.data["refreshToken"])
            return r
        })
    }

    registerSuccessfulLoginForJwt(accessToken, refreshToken, username) {
        localStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username)
        this.setTokens(accessToken, refreshToken)
    }

    setTokens(accessToken, refreshToken) {
        console.log("setTokens")
        localStorage.setItem(ACCESS_TOKEN_ATTRIBUTE_NAME, accessToken)
        localStorage.setItem(REFRESH_TOKEN_ATTRIBUTE_NAME, refreshToken)
    }

    createJWTToken(token) {
        return 'Bearer ' + token
    }

    register(form): Promise<AxiosResponse> {
        return axios.post(`${API_URL}/auth/register`,
            {
                login: form.email,
                email: form.email,
                password: form.password,
                firstName: form.firstName,
                lastName: form.lastName,
                marketing: form.marketing
            })
    }

    logout() {
        localStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
        localStorage.removeItem(REFRESH_TOKEN_ATTRIBUTE_NAME);
        localStorage.removeItem(ACCESS_TOKEN_ATTRIBUTE_NAME);
        document.location.href = Paths.SIGN_IN.path
    }

    isUserLoggedIn() {
        let user = localStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        return user !== null;
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
    deleteGroup(groupId): Promise<AxiosResponse> {
        console.log("deleteGroup")
        return axios.delete(`${API_URL}/groups/${groupId}`)
    }

    createGroup(name, description, currency): Promise<AxiosResponse> {
        console.log("createGroup")
        return axios.post(`${API_URL}/groups`,
            {
                name: name,
                description: description,
                currency: currency,
                users: []
            })
    }

    getGroups(): Promise<AxiosResponse> {
        console.log("getGroups")
        return axios.get(`${API_URL}/groups`)
    }

    getCurrentGroupId() {
        console.log("getCurrentGroupId")
        return localStorage.getItem(CURRENT_GROUP)
    }

    setCurrentGroupId(groupId) {
        console.log("setCurrentGroupId")
        return localStorage.setItem(CURRENT_GROUP, groupId)
    }

    //TODO API CALL
    getOperationHistory(groupId): Promise<AxiosResponse> {
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
    getCategories(groupId): Promise<AxiosResponse> {
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
    getAccounts(groupId): Promise<AxiosResponse> {
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
                    config.headers.Authorization = this.createJWTToken(localStorage.getItem(ACCESS_TOKEN_ATTRIBUTE_NAME))
                }
                return config
            },
            (error) => {
                return Promise.reject(error);
            }
        )
        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            error => {
                if (error.config.url === API_URL + "/auth/refresh") {
                    this.logout()
                    return Promise.reject(error)
                } else if (error.response && error.response.status === 401 && !error?.config?._isRetry) {
                    return this.tryRefresh()
                        .then(() => {
                            return axios.request({
                                ...error.config,
                                headers: error.config.headers.toJSON(),
                                _isRetry: true
                            })
                        })
                } else {
                    return Promise.reject(error)
                }
            });
    }

    getErrorMessage(error) {
        if (error) {
            if (error.response && error.response.data) {
                const payload = error.response.data
                if (payload.message) {
                    return payload.message
                } else if (payload.error) {
                    return payload.error
                } else if (payload.detail) {
                    return payload.detail
                } else if (payload.status) {
                    return payload.status
                }
            } else if (error.message) {
                return error.message
            }
        }
        return "Unknown error"
    }
}

export default new RestService()