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

            <UFormField :label="$i18n.t('user.password')" name="password">
                <UInput
                    v-model="state.password"
                    type="password"
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
                {{ $i18n.t('user.do_login') }}
            </UButton>
        </UForm>

        <div class="mt-6 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ $i18n.t('user.dont_have_an_account') }}
                <nuxt-link
                    v-if="displayType === 'page'"
                    to="/user/register"
                    class="font-medium text-primary hover:underline"
                >
                    {{ $i18n.t('user.do_register') }}
                </nuxt-link>
                <a
                    v-if="displayType === 'modal'"
                    class="cursor-pointer font-medium text-primary hover:underline"
                    @click="() => (mainStore.loginActiveComponent = 'register')"
                >
                    {{ $i18n.t('user.do_register') }}
                </a>
            </p>
            <p class="mt-2">
                <nuxt-link
                    v-if="displayType === 'page'"
                    to="/user/forgot-password"
                    class="text-xs text-gray-500 hover:underline"
                >
                    {{ $i18n.t('user.forgot_password') }}?
                </nuxt-link>
                <a
                    v-if="displayType === 'modal'"
                    class="cursor-pointer text-xs text-gray-500 hover:underline"
                    @click="
                        () =>
                            (mainStore.loginActiveComponent = 'forgot-password')
                    "
                >
                    {{ $i18n.t('user.forgot_password') }}?
                </a>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import { useMainStore } from '~/stores';

const { $i18n, $api, $login } = useNuxtApp();
const mainStore = useMainStore();

const emit = defineEmits(['loginSuccess']);

interface Props {
    displayType?: 'page' | 'modal';
}

const props = withDefaults(defineProps<Props>(), {
    displayType: 'page'
});

const state = reactive({
    email: '',
    password: ''
});

const schema = z.object({
    email: z.string().email($i18n.t('validation.email')).min(1, $i18n.t('validation.required')),
    password: z.string().min(1, $i18n.t('validation.required'))
});

type Schema = z.infer<typeof schema>;

const error = ref<any>(null);
const success = ref<string | null>(null);
const isLoading = ref(false);

onMounted(() => {
    error.value = null;
    success.value = null;
    isLoading.value = false;
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    error.value = null;
    success.value = null;

    try {
        isLoading.value = true;
        await $login(event.data.email, event.data.password);
        emit('loginSuccess');
    } catch (e: any) {
        console.error(e);
        if (e?.errors) {
            error.value = e?.errors[0];
        } else {
            error.value = e;
        }
    } finally {
        isLoading.value = false;
    }
}

const errorMessage = computed(() => {
    return $api.tools.parseErrorMessage(error.value);
});
</script>
