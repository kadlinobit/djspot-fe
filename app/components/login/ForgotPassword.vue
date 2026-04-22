<template>
    <div>
        <UAlert
            v-if="success"
            icon="i-heroicons-check-circle"
            color="success"
            variant="subtle"
            :title="$i18n.t(success)"
            class="mb-4"
        />

        <UAlert
            v-if="errorMessage"
            icon="i-heroicons-exclamation-triangle"
            color="error"
            variant="subtle"
            :title="$i18n.t(errorMessage)"
            class="mb-4"
        />

        <UForm
            v-if="!success"
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
        >
            <UFormField :label="$i18n.t('user.email')" name="email">
                <UInput
                    v-model="state.email"
                    type="email"
                    placeholder="email@example.com"
                    class="w-full"
                />
            </UFormField>

            <UButton
                type="submit"
                :loading="isLoading"
                block
                color="neutral"
                variant="solid"
            >
                {{ $i18n.t('user.email_reset_link') }}
            </UButton>
        </UForm>

        <div class="mt-6 text-center">
            <p>
                <nuxt-link
                    v-if="displayType === 'page'"
                    :to="{ path: '/user/login' }"
                    class="text-sm text-primary hover:underline"
                >
                    {{ $i18n.t('user.go_to_login_page') }}
                </nuxt-link>
                <a
                    v-if="displayType === 'modal'"
                    class="cursor-pointer text-sm text-primary hover:underline"
                    @click="() => mainStore.setLoginActiveComponent('login')"
                >
                    {{ $i18n.t('user.go_to_login_page') }}
                </a>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import { useMainStore } from '~/stores';

const { baseURL } = useRuntimeConfig().public;
const { $i18n, $api } = useNuxtApp();

const directus = useDirectus();
const mainStore = useMainStore();

interface Props {
    displayType?: string;
}

const props = withDefaults(defineProps<Props>(), {
    displayType: 'page'
});

const state = reactive({
    email: ''
});

const schema = z.object({
    email: z
        .string()
        .email($i18n.t('validation.email'))
        .min(1, $i18n.t('validation.required'))
});

type Schema = z.infer<typeof schema>;

const success = ref<string | null>(null);
const error = ref<any>(null);
const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
    error.value = null;
    try {
        isLoading.value = true;

        await directus.auth.password.request(
            event.data.email,
            `${baseURL}/user/reset-password`
        );

        success.value = 'user.password_reset_link_sent';
    } catch (e: any) {
        console.error(e);
        error.value = e;
    } finally {
        isLoading.value = false;
    }
}

const errorMessage = computed(() => {
    return $api.tools.parseErrorMessage(error.value);
});
</script>
