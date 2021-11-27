<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-4 is-offset-4">
                    <h2 class="title has-text-centered">{{ $t('user.register') }}</h2>
                    <register display-type="page" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Register from '~/components/login/Register.vue'

export default {
    components: {
        Register
    },
    middleware: ['guest']
}
</script>
