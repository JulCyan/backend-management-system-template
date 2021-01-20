import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'language'
export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language: string) => Cookies.set(languageKey, language)

// User
const tokenKey = 'token'
const expires = 1 / 12 // 天
export const getToken = () => Cookies.get(tokenKey)
export const setToken = (token: string) => Cookies.set(tokenKey, token, { expires })
export const removeToken = () => Cookies.remove(tokenKey)
