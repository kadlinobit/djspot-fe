<template>
    <o-modal
        trap-focus
        :destroy-on-hide="false"
        width="400px"
        content-class="modal-content"
        aria-role="dialog"
        aria-label="Login modal"
        aria-modal
        :active="mainStore.isLoginOpen"
        @close="() => (mainStore.isLoginOpen = false)"
    >
        <template #default>
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <h4 class="title is-4">
                        {{
                            $t(
                                `user.${mainStore.loginActiveComponent}`.replace(
                                    '-',
                                    '_'
                                )
                            )
                        }}
                    </h4>
                </header>
                <section class="modal-card-body">
                    <component
                        :is="mainStore.loginActiveComponent"
                        display-type="modal"
                        :after-success-callback="afterSuccessCallbackFunction"
                    />
                </section>
                <footer class="modal-card-foot"></footer>
            </div>
        </template>
    </o-modal>
</template>

<script setup lang="ts">
import Login from './Login.vue'
import ForgotPassword from './ForgotPassword.vue'
import Register from './Register.vue'
import { useMainStore } from '~/stores'

const { $auth, $oruga, $route } = useNuxtApp()
const mainStore = useMainStore()

function afterSuccessCallbackFunction() {
    let callbackFunction
    switch (mainStore.loginActiveComponent) {
        case 'login':
            callbackFunction = () => {
                if (this.$route.path === '/login') {
                    this.$router.push('/')
                }
                this.setIsLoginOpen(false)
                this.$oruga.notification.open({
                    message: this.$t('user.login_success'),
                    variant: 'success'
                })
            }
            break
        case 'forgot-password':
            callbackFunction = () => {}
            break
        case 'register':
            callbackFunction = () => {}
            break
    }
    return callbackFunction
}
</script>
