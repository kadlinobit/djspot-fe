<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-4 is-offset-4">
                    <h2 class="title has-text-centered">{{ $t('user.login') }}</h2>

                    <b-notification
                        v-if="error"
                        type="is-danger"
                        has-icon
                        role="alert"
                        :closable="false"
                    >
                        {{ error }}
                    </b-notification>

                    <form @submit.prevent>
                        <ValidationProvider name="email" rules="required|email">
                            <b-field
                                :label="$t('user.email')"
                                slot-scope="{ errors, valid }"
                                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                                :message="errors"
                            >
                                <b-input
                                    v-model="email"
                                    type="email"
                                    :use-html5-validation="false"
                                />
                            </b-field>
                        </ValidationProvider>

                        <b-field :label="$t('user.password')">
                            <b-input v-model="password" type="password" />
                        </b-field>
                        <div class="control">
                            <b-button
                                :loading="isLoading"
                                type="is-dark is-fullwidth"
                                @click="login"
                            >
                                {{ $t('user.do_login') }}
                            </b-button>
                        </div>
                    </form>
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
import { ValidationProvider } from 'vee-validate'

export default {
    components: {
        ValidationProvider
    },
    plugins: ['validation'],
    middleware: ['guest'],
    data() {
        return {
            email: '',
            password: '',
            error: null,
            isLoading: false
        }
    },
    methods: {
        async login() {
            this.error = null
            try {
                this.isLoading = true
                await this.$auth.loginWith('local', {
                    data: {
                        identifier: this.email,
                        password: this.password
                    }
                })
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
