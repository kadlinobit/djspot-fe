<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-4 is-offset-4">
                    <h2 class="title has-text-centered">{{ $t('user.login') }}</h2>

                    <b-notification v-if="success" type="is-success" :closable="false">
                        {{ $t(success) }}
                    </b-notification>

                    <b-notification v-if="error" type="is-danger" :closable="false">
                        {{ $t(error) }}
                    </b-notification>

                    <ValidationObserver ref="observer" slim>
                        <form @submit.prevent>
                            <b-validated-field
                                v-model="email"
                                name="email"
                                type="email"
                                :label="$t('user.email')"
                                rules="required|email"
                            />
                            <b-validated-field
                                v-model="password"
                                name="password"
                                type="password"
                                :label="$t('user.password')"
                                rules="required"
                            />
                            <div class="field">
                                <div class="control">
                                    <b-button
                                        :loading="isLoading"
                                        type="is-dark is-fullwidth"
                                        @click="onSubmit"
                                    >
                                        {{ $t('user.do_login') }}
                                    </b-button>
                                </div>
                            </div>
                        </form>
                    </ValidationObserver>
                    <div class="has-text-centered" style="margin-top: 20px">
                        <p>
                            {{ $t('user.dont_have_an_account') }}
                            <nuxt-link to="/register">{{ $t('user.do_register') }}</nuxt-link>
                        </p>
                        <p>
                            <nuxt-link to="/forgot-password">
                                {{ $t('user.forgot_password') }}?
                            </nuxt-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- <b-loading v-model="isLoading" :can-cancel="true" /> -->
    </section>
</template>

<script>
import { extend, ValidationObserver } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import BValidatedField from '~/components/form/BValidatedField.vue'

extend('email', email)
extend('required', required)

export default {
    components: {
        ValidationObserver,
        BValidatedField
    },
    plugins: ['vee-validate'],
    middleware: ['guest'],
    asyncData(context) {
        let success = null
        if (context.route.query.success) {
            success = context.route.query.success
        }

        return {
            success
        }
    },
    data() {
        return {
            email: '',
            password: '',
            error: null,
            isLoading: false
        }
    },
    methods: {
        onSubmit() {
            this.error = null
            this.success = null
            this.$refs.observer.validate().then((success) => {
                if (!success) {
                    this.$buefy.toast.open({
                        message: this.$t('validation.form_validation_error'),
                        type: 'is-danger'
                    })
                    return
                }
                this.login()
            })
        },
        async login() {
            try {
                this.isLoading = true
                /*
                await this.$auth.loginWith('local', {
                    data: {
                        identifier: this.email,
                        password: this.password
                    }
                }) */
                await this.$strapi.login({ identifier: this.email, password: this.password })
                this.$router.push('/')
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
