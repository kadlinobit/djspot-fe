<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-4 is-offset-4">
                    <h2 class="title has-text-centered">{{ $t('user.login') }}</h2>
                    <login :after-success-callback="() => $router.push('/')" display-type="page" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Login from '~/components/login/Login.vue'

export default {
    components: {
        Login
    },
    middleware: ['guest']
}
</script>
