<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-4 is-offset-4">
                    <h2 class="title has-text-centered">{{ $t('user.register') }}</h2>

                    <Notification v-if="success" type="success" :message="success" />
                    <Notification v-if="error" type="danger" :message="$t(error)" />

                    <form v-if="!success" method="post" @submit.prevent>
                        <b-field :label="$t('user.username')">
                            <b-input v-model="username" type="text" required></b-input>
                        </b-field>

                        <b-field :label="$t('user.email')">
                            <b-input v-model="email" type="email" required></b-input>
                        </b-field>
                        <b-field :label="$t('user.password')">
                            <b-input v-model="password1" type="password" required />
                        </b-field>
                        <b-field :label="$t('user.password_again')">
                            <b-input v-model="password2" type="password" required />
                        </b-field>
                        <div class="control">
                            <b-button
                                :loading="isLoading"
                                type="is-dark is-fullwidth"
                                @click="register"
                            >
                                {{ $t('user.do_register') }}
                            </b-button>
                        </div>
                    </form>

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
import Notification from '~/components/Notification'

export default {
    components: {
        Notification
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
        async register() {
            this.error = null
            if (this.password1 !== this.password2) {
                this.error = this.$t('user.passwords_do_not_match')
                return
            }
            try {
                this.isLoading = true
                this.$axios.setToken(false)
                await this.$axios.post('auth/local/register', {
                    username: this.username,
                    email: this.email,
                    password: this.password1
                })
                this.success = this.$t('user.register_success_message')
            } catch (e) {
                this.error = e.response.data.message[0].messages[0].message
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>
