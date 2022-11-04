<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-4 is-offset-4">
                    <h2 class="title has-text-centered">
                        {{ $i18n.t('user.account_activation') }}
                    </h2>
                    <o-notification
                        v-if="errorMessage"
                        variant="danger"
                        :closable="false"
                    >
                        {{ $i18n.t(errorMessage) }}
                    </o-notification>
                    <o-notification
                        v-if="successMessage"
                        variant="success"
                        :closable="false"
                    >
                        {{ $i18n.t(successMessage) }}
                    </o-notification>

                    <o-notification
                        v-if="progressMessage"
                        variant="warning"
                        :closable="false"
                    >
                        {{ $i18n.t(progressMessage) }}
                    </o-notification>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const { $i18n, $api } = useNuxtApp()
const router = useRouter()
const route = useRoute()

const error = ref(null)
const successMessage = ref(null)
const progressMessage = ref(null)
const token = ref(null)

definePageMeta({
    middleware: ['guest']
})

onMounted(() => {
    try {
        if (!route.query.token) {
            throw new Error('user.activation_token_missing')
        } else {
            token.value = route.query.token
            progressMessage.value = 'user.token_received'

            setTimeout(activateAccount, 2000)
        }
    } catch (e) {
        error.value = e
    }
})

async function activateAccount() {
    error.value = null
    try {
        const result = await $fetch('http://localhost:8055/users/activate', {
            method: 'POST',
            body: { token: token.value }
        })

        if (result.status === 'OK') {
            successMessage.value = $i18n.t('user.activation_success', [
                result.email
            ])
        }
    } catch (e) {
        error.value = e
    } finally {
        progressMessage.value = null
    }
}

const errorMessage = computed(() => {
    const errorMessage = $api.tools.parseErrorMessage(error.value)
    return errorMessage
})
</script>
