<template>
    <div class="form-login page-register">
        <o-notification v-if="success" variant="success" :closable="false">
            {{ $t(success) }}
        </o-notification>

        <o-notification v-if="error" variant="danger" :closable="false">
            {{ $t(error) }}
        </o-notification>

        <ValidationObserver ref="observer" slim>
            <form v-if="!success" method="post" @submit.prevent>
                <o-validated-field
                    v-model="username"
                    name="username"
                    type="text"
                    :label="$t('user.username')"
                    rules="required"
                />

                <o-validated-field
                    v-model="email"
                    name="email"
                    type="email"
                    :label="$t('user.email')"
                    rules="required|email"
                />

                <o-validated-field
                    v-model="password1"
                    vid="password1"
                    name="password1"
                    type="password"
                    :label="$t('user.password')"
                    rules="required"
                />

                <o-validated-field
                    v-model="password2"
                    name="password2"
                    type="password"
                    :label="$t('user.password_again')"
                    rules="required|confirmed:password1"
                />
                <div class="field">
                    <div class="control">
                        <o-button
                            :disabled="isLoading"
                            variant="dark is-fullwidth"
                            @click="onSubmit"
                        >
                            {{ $t('user.do_register') }}
                        </o-button>
                    </div>
                </div>
            </form>
        </ValidationObserver>

        <div class="has-text-centered" style="margin-top: 20px">
            {{ $t('user.already_got_an_account') }}
            <nuxt-link v-if="displayType === 'page'" to="/login">
                {{ $t('user.do_login') }}
            </nuxt-link>
            <a v-if="displayType === 'modal'" @click="() => setLoginActiveComponent('login')">
                {{ $t('user.do_login') }}
            </a>
        </div>
    </div>
</template>

<script>
import { extend, ValidationObserver } from 'vee-validate'
import { required, email, confirmed } from 'vee-validate/dist/rules'
import { mapActions } from 'vuex'
import OValidatedField from '~/components/form/OValidatedField.vue'

extend('email', email)
extend('required', required)
extend('confirmed', confirmed)

export default {
    components: {
        ValidationObserver,
        OValidatedField
    },
    props: {
        displayType: {
            type: String,
            default: 'page'
        },
        afterSuccessCallback: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            username: '',
            email: '',
            password1: '',
            password2: '',
            success: null,
            error: null,
            isLoading: false
        }
    },
    methods: {
        ...mapActions(['setIsLoginOpen', 'setLoginActiveComponent']),
        onSubmit() {
            this.error = null
            this.$refs.observer.validate().then((success) => {
                if (!success) {
                    this.$oruga.notification.open({
                        message: this.$t('validation.form_validation_error'),
                        variant: 'danger'
                    })
                    return
                }
                this.register()
            })
        },
        async register() {
            try {
                this.isLoading = true
                /*
                this.$axios.setToken(false)
                await this.$axios.post('auth/local/register', {
                    username: this.username,
                    email: this.email,
                    password: this.password1
                }) */

                await this.$strapi.register({
                    email: this.email,
                    username: this.username,
                    password: this.password1
                })

                this.success = 'user.register_success_message'
            } catch (e) {
                if (e.response && e.response.data) {
                    this.error = e.response.data.message[0].messages[0].message
                } else {
                    this.error = e
                }
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>
