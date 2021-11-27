<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-4 is-offset-4">
                    <h2 class="title has-text-centered">{{ $t('user.forgot_password') }}</h2>
                    <forgot-password display-type="page" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import ForgotPassword from '~/components/login/ForgotPassword.vue'

export default {
    components: {
        ForgotPassword
    },
    middleware: 'guest'
}
</script>
