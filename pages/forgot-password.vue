<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-4 is-offset-4">
                    <h2 class="title has-text-centered">{{ $t('user.forgot_password') }}</h2>

                    <o-notification v-if="success" variant="success" :closable="false">
                        {{ $t('success') }}
                    </o-notification>
                    <o-notification v-if="error" variant="danger" :closable="false">
                        {{ $t('error') }}
                    </o-notification>
                    <ValidationObserver ref="observer" slim>
                        <form v-if="!success" method="post" @submit.prevent>
                            <o-validated-field
                                v-model="email"
                                name="email"
                                type="email"
                                :label="$t('user.email')"
                                rules="required|email"
                            />
                            <div class="field">
                                <div class="control">
                                    <o-button
                                        variant="dark is-fullwidth"
                                        :disabled="isLoading"
                                        @click="onSubmit"
                                    >
                                        {{ $t('user.email_reset_link') }}
                                    </o-button>
                                </div>
                            </div>
                        </form>
                    </ValidationObserver>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { extend, ValidationObserver } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import OValidatedField from '~/components/form/OValidatedField.vue'

extend('email', email)
extend('required', required)

export default {
    components: {
        ValidationObserver,
        OValidatedField
    },
    plugins: ['vee-validate'],
    middleware: 'guest',
    data() {
        return {
            email: '',
            success: null,
            error: null,
            isLoading: false
        }
    },
    methods: {
        onSubmit() {
            this.$refs.observer.validate().then((success) => {
                if (!success) {
                    return
                }
                this.forgotPassword()
            })
        },
        async forgotPassword() {
            this.error = null
            try {
                this.isLoading = true

                /* AUTH METHOD
                await this.$axios.post('auth/forgot-password', {
                    email: this.email
                }) */

                await this.$strapi.forgotPassword({ email: this.email })

                this.error = null
                this.success = 'user.password_reset_link_sent'
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
