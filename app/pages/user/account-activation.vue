<template>
    <div class="flex min-h-[60vh] items-center justify-center px-4">
        <div class="w-full max-w-md space-y-4">
            <h2 class="text-center text-2xl font-bold">
                {{ $i18n.t('user.account_activation') }}
            </h2>
            <UAlert
                v-if="errorMessage"
                icon="i-heroicons-exclamation-triangle"
                color="error"
                variant="subtle"
                :title="$i18n.t(errorMessage)"
            />
            <UAlert
                v-if="successMessage"
                icon="i-heroicons-check-circle"
                color="success"
                variant="subtle"
                :title="$i18n.t(successMessage)"
            />
            <UAlert
                v-if="progressMessage"
                icon="i-heroicons-arrow-path"
                color="warning"
                variant="subtle"
                :title="$i18n.t(progressMessage)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const { $i18n, $api } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const { apiBaseURL } = useRuntimeConfig().public

const error = ref(null)
const successMessage = ref(null)
const progressMessage = ref(null)
const token = ref(null)

onMounted(() => {
    try {
        if (!route.query.token) {
            throw new Error('user.activation_token_missing')
        } else {
            token.value = route.query.token
            progressMessage.value = 'user.token_received'

            // TODO - Timeout for testing, remove
            setTimeout(activateAccount, 2000)
        }
    } catch (e) {
        error.value = e
    }
})

async function activateAccount() {
    error.value = null
    try {
        const result = await $fetch(`${apiBaseURL}/users/activate`, {
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
