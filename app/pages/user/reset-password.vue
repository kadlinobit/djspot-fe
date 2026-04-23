<template>
    <client-only>
        <div class="flex min-h-[60vh] items-center justify-center px-4">
            <div class="w-full max-w-md space-y-4">
                <h2 class="text-center text-2xl font-bold">
                    {{ $i18n.t('user.reset_password') }}
                </h2>

                <UAlert
                    v-if="success"
                    icon="i-heroicons-check-circle"
                    color="success"
                    variant="subtle"
                    :title="$i18n.t(success)"
                />
                <UAlert
                    v-if="errorMessage"
                    icon="i-heroicons-exclamation-triangle"
                    color="error"
                    variant="subtle"
                    :title="$i18n.t(errorMessage)"
                />

                <UForm
                    v-if="!success"
                    :schema="schema"
                    :state="state"
                    class="space-y-4"
                    @submit="onSubmit"
                >
                    <UFormField :label="$i18n.t('user.new_password')" name="password">
                        <UInput
                            v-model="state.password"
                            type="password"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField :label="$i18n.t('user.password_again')" name="password_check">
                        <UInput
                            v-model="state.password_check"
                            type="password"
                            class="w-full"
                        />
                    </UFormField>

                    <UButton
                        type="submit"
                        :loading="isLoading"
                        color="neutral"
                        variant="solid"
                        class="w-full"
                    >
                        {{ $i18n.t('user.do_reset_password') }}
                    </UButton>
                </UForm>

                <div v-if="success" class="text-center">
                    <nuxt-link :to="{ path: '/user/login' }">
                        {{ $i18n.t('user.go_to_login_page') }}
                    </nuxt-link>
                </div>
            </div>
        </div>
    </client-only>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import useDirectus from '~/composables/directus'

const { $i18n, $api } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const directus = useDirectus()

const success = ref(null)
const error = ref(null)
const isLoading = ref(false)
const token = ref(null)

const schema = z
    .object({
        password: z.string().min(1, $i18n.t('validation.required')),
        password_check: z.string().min(1, $i18n.t('validation.required'))
    })
    .refine((data) => data.password === data.password_check, {
        message: $i18n.t('validation.confirmed'),
        path: ['password_check']
    })

type Schema = z.infer<typeof schema>

const state = reactive<Schema>({
    password: '',
    password_check: ''
})

const errorMessage = computed(() => {
    const errorMessage = $api.tools.parseErrorMessage(error.value)
    return errorMessage
})

onMounted(() => {
    // TODO - different handling of missing token
    if (!route.query.token) {
        router.push('/user/forgot-password')
    } else {
        token.value = route.query.token
    }
})

async function onSubmit(_event: FormSubmitEvent<Schema>) {
    await resetPassword()
}

async function resetPassword() {
    error.value = null
    try {
        isLoading.value = true

        await directus.auth.password.reset(token.value, state.password)

        success.value = 'user.password_reset_success'
    } catch (e) {
        error.value = e
    } finally {
        isLoading.value = false
    }
}
</script>
