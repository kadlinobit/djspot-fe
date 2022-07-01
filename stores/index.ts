import { defineStore } from 'pinia'

interface State {
    isSidebarOpen: boolean
    isPlaylistOpen: boolean
    isLoginOpen: boolean
    isBottomBarOpen: boolean
    loginActiveComponent: string
}

export const useMainStore = defineStore('main', {
    state: (): State => ({
        isSidebarOpen: false,
        isPlaylistOpen: false,
        isLoginOpen: false,
        isBottomBarOpen: true,
        loginActiveComponent: 'login'
    })
})
