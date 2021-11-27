<template>
    <o-modal
        trap-focus
        :destroy-on-hide="false"
        width="400px"
        content-class="modal-content"
        aria-role="dialog"
        aria-label="Login modal"
        aria-modal
        :active="isLoginOpen"
        @close="() => setIsLoginOpen(false)"
    >
        <template #default>
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <h4 class="title is-4">
                        {{ $t(`user.${loginActiveComponent}`.replace('-', '_')) }}
                    </h4>
                </header>
                <section class="modal-card-body">
                    <component
                        :is="loginActiveComponent"
                        display-type="modal"
                        :after-success-callback="afterSuccessCallbackFunction"
                    />
                </section>
                <footer class="modal-card-foot"></footer>
            </div>
        </template>
    </o-modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Login from './Login.vue'
import ForgotPassword from './ForgotPassword.vue'
import Register from './Register.vue'

export default {
    components: {
        Login,
        ForgotPassword,
        Register
    },
    computed: {
        ...mapGetters(['isLoginOpen', 'loginActiveComponent']),
        afterSuccessCallbackFunction() {
            let callbackFunction
            switch (this.loginActiveComponent) {
                case 'login':
                    callbackFunction = () => {
                        if (this.$route.path === '/login') {
                            this.$router.push('/')
                        }
                        this.setIsLoginOpen(false)
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
    },
    methods: {
        ...mapActions(['setIsLoginOpen'])
    }
}
</script>
