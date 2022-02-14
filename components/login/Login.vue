<template>
    <div class="form-login page-login">
        <o-notification v-if="success" variant="success" :closable="false">
            {{ $t(success) }}
        </o-notification>

        <o-notification v-if="error" variant="danger" :closable="false">
            {{ $t(error) }}
        </o-notification>

        <ValidationObserver ref="observer" slim>
            <form @submit.prevent>
                <o-validated-field
                    v-model="email"
                    name="email"
                    type="email"
                    :label="$t('user.email')"
                    rules="required|email"
                />
                <o-validated-field
                    v-model="password"
                    name="password"
                    type="password"
                    :label="$t('user.password')"
                    rules="required"
                />
                <div class="field">
                    <div class="control">
                        <o-button
                            :disabled="isLoading"
                            variant="dark is-fullwidth"
                            @click="onSubmit"
                        >
                            {{ $t('user.do_login') }}
                        </o-button>
                    </div>
                </div>
            </form>
        </ValidationObserver>
        <div class="has-text-centered" style="margin-top: 20px">
            <p>
                {{ $t('user.dont_have_an_account') }}
                <nuxt-link v-if="displayType === 'page'" to="/register">
                    {{ $t('user.do_register') }}
                </nuxt-link>
                <a
                    v-if="displayType === 'modal'"
                    @click="() => setLoginActiveComponent('register')"
                >
                    {{ $t('user.do_register') }}
                </a>
            </p>
            <p>
                <nuxt-link v-if="displayType === 'page'" to="/forgot-password">
                    {{ $t('user.forgot_password') }}?
                </nuxt-link>
                <a
                    v-if="displayType === 'modal'"
                    @click="() => setLoginActiveComponent('forgot-password')"
                >
                    {{ $t('user.forgot_password') }}?
                </a>
            </p>
        </div>
    </div>
</template>

<script>
import { extend, ValidationObserver } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import { mapActions } from 'vuex'
import OValidatedField from '~/components/form/OValidatedField.vue'

extend('email', email)
extend('required', required)

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
            email: '',
            password: '',
            error: null,
            success: null,
            isLoading: false
        }
    },
    fetch() {
        if (this.$nuxt.context.route.query.success) {
            this.success = this.$nuxt.context.route.query.success
        }
    },
    methods: {
        ...mapActions(['setIsLoginOpen', 'setLoginActiveComponent']),
        onSubmit() {
            this.error = null
            this.success = null
            this.$refs.observer.validate().then((success) => {
                if (!success) {
                    this.$oruga.notification.open({
                        message: this.$t('validation.form_validation_error'),
                        variant: 'danger'
                    })
                    return
                }
                this.login()
            })
        },
        async login() {
            try {
                this.isLoading = true

                await this.$auth.loginWith('local', {
                    data: {
                        email: this.email,
                        password: this.password
                    }
                })
                this.afterSuccessCallback()
            } catch (e) {
                this.error = e.response.data.errors[0].message
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>
