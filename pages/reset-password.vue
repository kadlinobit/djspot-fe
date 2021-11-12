<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-4 is-offset-4">
                    <h2 class="title has-text-centered">{{ $t('user.reset_password') }}</h2>

                    <o-notification v-if="success" variant="success" :closable="false">
                        {{ $t(success) }}
                    </o-notification>
                    <o-notification v-if="error" variant="danger" :closable="false">
                        {{ $t(error) }}
                    </o-notification>
                    <ValidationObserver ref="observer">
                        <form v-if="!success" method="post" @submit.prevent>
                            <o-validated-field
                                v-model="password1"
                                vid="password1"
                                name="password1"
                                type="password"
                                :label="$t('user.new_password')"
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
                                        {{ $t('user.do_reset_password') }}
                                    </o-button>
                                </div>
                            </div>
                        </form>
                    </ValidationObserver>
                    <div v-if="success" class="has-text-centered" style="margin-top: 20px">
                        <p>
                            <nuxt-link :to="{ path: '/login' }">
                                {{ $t('user.go_to_login_page') }}
                            </nuxt-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { extend, ValidationObserver } from 'vee-validate'
import { required, confirmed } from 'vee-validate/dist/rules'
import OValidatedField from '~/components/form/OValidatedField.vue'

extend('required', required)
extend('confirmed', confirmed)

export default {
    components: {
        ValidationObserver,
        OValidatedField
    },
    plugins: ['vee-validate'],
    middleware: 'guest',
    asyncData(context) {
        if (!context.route.query.code) {
            context.redirect('/forgot-password')
        } else {
            return {
                code: context.route.query.code
            }
        }
    },
    data() {
        return {
            password1: '',
            password2: '',
            success: null,
            error: null,
            isLoading: false
        }
    },
    methods: {
        onSubmit() {
            this.$refs.observer.validate().then((success) => {
                if (!success) {
                    this.$oruga.notification.open({
                        message: this.$t('validation.form_validation_error'),
                        variant: 'danger'
                    })
                    return
                }
                this.resetPassword()
            })
        },
        async resetPassword() {
            this.error = null
            try {
                this.isLoading = true

                /* AUTH METHOD
                await this.$axios.post('auth/reset-password', {
                    code: this.code,
                    password: this.password1,
                    passwordConfirmation: this.password2
                }) */

                await this.$strapi.resetPassword({
                    code: this.$route.query.code,
                    password: this.password1,
                    passwordConfirmation: this.password2
                })

                this.success = 'user.password_reset_success'
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
