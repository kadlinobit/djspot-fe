<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-4 is-offset-4">
                    <h2 class="title has-text-centered">
                        {{ $i18n.t('user.forgot_password') }}
                    </h2>
                    <forgot-password display-type="page" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import ForgotPassword from '~/components/login/ForgotPassword.vue'

const { $i18n } = useNuxtApp()

definePageMeta({
    middleware: ['guest']
})
</script>
