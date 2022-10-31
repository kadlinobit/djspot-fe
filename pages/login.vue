<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-4 is-offset-4">
                    <h2 class="title has-text-centered">
                        {{ $i18n.t('user.login') }}
                    </h2>
                    <login display-type="page" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import Login from '~/components/login/Login.vue'

const { $i18n } = useNuxtApp()

definePageMeta({
    middleware: ['guest']
})
</script>
