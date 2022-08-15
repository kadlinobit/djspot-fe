import { defineStore } from 'pinia'

// interface State {
//     isSidebarOpen: boolean
//     isPlaylistOpen: boolean
//     isLoginOpen: boolean
//     isBottomBarOpen: boolean
//     loginActiveComponent: string
// }

// export const useMainStore = defineStore('main', {
//     state: (): State => ({
//         isSidebarOpen: false,
//         isPlaylistOpen: false,
//         isLoginOpen: false,
//         isBottomBarOpen: true,
//         loginActiveComponent: 'login'
//     }),

//     actions: {
//         toggleIsBottomBarOpen() {
//             this.isBottomBarOpen = !this.isBottomBarOpen
//         },
//         setIsBottomBarOpen(value: boolean) {
//             this.isBottomBarOpen = value
//         }
//     }
// })

export const useMainStore = defineStore('main', () => {
    const isSidebarOpen = ref<boolean>(false)
    const isPlaylistOpen = ref<boolean>(false)
    const isLoginOpen = ref<boolean>(false)
    const isBottomBarOpen = ref<boolean>(true)
    const loginActiveComponent = ref<string>('login')

    // ACTIONS
    function toggleIsBottomBarOpen() {
        isBottomBarOpen.value = !isBottomBarOpen.value
    }
    function setIsBottomBarOpen(value: boolean) {
        isBottomBarOpen.value = value
    }

    function toggleIsPlaylistOpen() {
        isPlaylistOpen.value = !isPlaylistOpen.value
    }

    function setIsPlaylistOpen(value: boolean) {
        isPlaylistOpen.value = value
    }

    function toggleIsLoginOpen() {
        isLoginOpen.value = !isLoginOpen.value
    }

    function setIsLoginOpen(value: boolean) {
        isLoginOpen.value = value
    }

    function setLoginActiveComponent(value: string) {
        loginActiveComponent.value = value
    }

    return {
        isSidebarOpen,
        isPlaylistOpen,
        isLoginOpen,
        isBottomBarOpen,
        loginActiveComponent,

        // ACTIONS
        toggleIsBottomBarOpen,
        setIsBottomBarOpen,
        toggleIsPlaylistOpen,
        setIsPlaylistOpen,
        toggleIsLoginOpen,
        setIsLoginOpen,
        setLoginActiveComponent
    }
})
