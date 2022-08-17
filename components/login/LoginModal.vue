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
                            $i18n.t(
                                `user.${mainStore.loginActiveComponent}`.replace(
                                    '-',
                                    '_'
                                )
                            )
                        }}
                    </h4>
                </header>
                <section class="modal-card-body">
                    <login
                        v-if="mainStore.loginActiveComponent === 'login'"
                        display-type="modal"
                        @loginSuccess="afterLoginSuccess"
                    />
                    <forgot-password
                        v-else-if="
                            mainStore.loginActiveComponent === 'forgot-password'
                        "
                        display-type="modal"
                    />
                    <register
                        v-else-if="
                            mainStore.loginActiveComponent === 'register'
                        "
                        display-type="modal"
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

const { $auth, $oruga, $i18n } = useNuxtApp()
const mainStore = useMainStore()

const router = useRouter()
const route = useRoute()

function afterLoginSuccess() {
    // if (route.path === '/login') {
    //     router.push('/')
    // }
    mainStore.setIsLoginOpen(false)
    $oruga.notification.open({
        message: $i18n.t('user.login_success'),
        variant: 'success'
    })
}
</script>
