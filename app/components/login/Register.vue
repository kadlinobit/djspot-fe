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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormField :label="$i18n.t('user.first_name')" name="first_name">
                    <UInput v-model="state.first_name" class="w-full" />
                </UFormField>

                <UFormField :label="$i18n.t('user.last_name')" name="last_name">
                    <UInput v-model="state.last_name" class="w-full" />
                </UFormField>
            </div>

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
                block
                color="primary"
                variant="solid"
            >
                {{ $i18n.t('user.do_register') }}
            </UButton>
        </UForm>

        <div class="mt-6 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ $i18n.t('user.already_got_an_account') }}
                <nuxt-link
                    v-if="displayType === 'page'"
                    to="/user/login"
                    class="font-medium text-primary hover:underline"
                >
                    {{ $i18n.t('user.do_login') }}
                </nuxt-link>
                <a
                    v-if="displayType === 'modal'"
                    class="cursor-pointer font-medium text-primary hover:underline"
                    @click="() => mainStore.setLoginActiveComponent('login')"
                >
                    {{ $i18n.t('user.do_login') }}
                </a>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import { registerUser } from '@directus/sdk';
import { useMainStore } from '~/stores';

const { $i18n, $api, $directus } = useNuxtApp();
const mainStore = useMainStore();

interface Props {
    displayType?: string;
}

const props = withDefaults(defineProps<Props>(), {
    displayType: 'page'
});

const state = reactive({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_check: ''
});

const schema = z
    .object({
        first_name: z
            .string()
            .min(1, $i18n.t('validation.required'))
            .regex($api.tools.regEx.userName, $i18n.t('validation.alpha_num_dash_space')),
        last_name: z
            .string()
            .min(1, $i18n.t('validation.required'))
            .regex($api.tools.regEx.userName, $i18n.t('validation.alpha_num_dash_space')),
        email: z
            .string()
            .email($i18n.t('validation.email'))
            .min(1, $i18n.t('validation.required')),
        password: z.string().min(1, $i18n.t('validation.required')),
        password_check: z.string().min(1, $i18n.t('validation.required'))
    })
    .refine((data) => data.password === data.password_check, {
        message: $i18n.t('validation.confirmed'),
        path: ['password_check']
    });

type Schema = z.infer<typeof schema>;

const success = ref<string | null>(null);
const error = ref<any>(null);
const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
    error.value = null;
    try {
        isLoading.value = true;
        await $directus.request(
            registerUser(event.data.email, event.data.password, {
                first_name: event.data.first_name,
                last_name: event.data.last_name,
                verification_url: 'http://localhost:3000/user/account-activation'
            } as any)
        );
        success.value = 'user.register_success_message';
    } catch (e) {
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
