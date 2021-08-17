<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-4 is-offset-4">
                    <h2 class="title has-text-centered">{{ $t('user.register') }}</h2>

                    <b-notification v-if="success" type="is-success" :closable="false">
                        {{ $t(success) }}
                    </b-notification>

                    <b-notification v-if="error" type="is-danger" :closable="false">
                        {{ $t(error) }}
                    </b-notification>

                    <ValidationObserver ref="observer" slim>
                        <form v-if="!success" method="post" @submit.prevent>
                            <b-validated-field
                                v-model="username"
                                name="username"
                                type="text"
                                :label="$t('user.username')"
                                rules="required"
                            />

                            <b-validated-field
                                v-model="email"
                                name="email"
                                type="email"
                                :label="$t('user.email')"
                                rules="required|email"
                            />

                            <b-validated-field
                                v-model="password1"
                                vid="password1"
                                name="password1"
                                type="password"
                                :label="$t('user.password')"
                                rules="required"
                            />

                            <b-validated-field
                                v-model="password2"
                                name="password2"
                                type="password"
                                :label="$t('user.password_again')"
                                rules="required|confirmed:password1"
                            />
                            <div class="field">
                                <div class="control">
                                    <b-button
                                        :loading="isLoading"
                                        type="is-dark is-fullwidth"
                                        @click="onSubmit"
                                    >
                                        {{ $t('user.do_register') }}
                                    </b-button>
                                </div>
                            </div>
                        </form>
                    </ValidationObserver>

                    <div class="has-text-centered" style="margin-top: 20px">
                        {{ $t('user.already_got_an_account') }}
                        <nuxt-link to="/login">
                            {{ $t('user.do_login') }}
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { extend, ValidationObserver } from 'vee-validate'
import { required, email, confirmed } from 'vee-validate/dist/rules'
import BValidatedField from '~/components/form/BValidatedField.vue'

extend('email', email)
extend('required', required)
extend('confirmed', confirmed)

export default {
    components: {
        ValidationObserver,
        BValidatedField
    },
    middleware: ['guest'],
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
        onSubmit() {
            this.error = null
            this.$refs.observer.validate().then((success) => {
                if (!success) {
                    this.$buefy.toast.open({
                        message: this.$t('validation.form_validation_error'),
                        type: 'is-danger'
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
