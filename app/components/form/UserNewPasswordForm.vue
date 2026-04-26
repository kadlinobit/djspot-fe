<template>
    <div class="user-form">
        <UAlert
            v-if="successMessage"
            icon="i-heroicons-check-circle"
            color="success"
            variant="subtle"
            :title="$i18n.t(successMessage)"
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
            v-if="!successMessage"
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

            <UFormField
                :label="$i18n.t('user.new_password_again')"
                name="passwordAgain"
            >
                <UInput
                    v-model="state.passwordAgain"
                    type="password"
                    class="w-full"
                />
            </UFormField>

            <UFormField
                :label="$i18n.t('user.current_password_check')"
                name="password_check"
            >
                <UInput
                    v-model="state.password_check"
                    type="password"
                    class="w-full"
                />
            </UFormField>

            <div class="flex justify-end pt-2">
                <UButton
                    type="submit"
                    :loading="isLoading"
                    color="neutral"
                    variant="solid"
                >
                    {{ $i18n.t('user.do_change_password') }}
                </UButton>
            </div>
        </UForm>
    </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

const { $i18n } = useNuxtApp();

const emit = defineEmits<{
    (e: 'formSubmit', formSubmitData: any): void
}>();

interface Props {
    errorMessage?: string;
    successMessage?: string;
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    errorMessage: null,
    successMessage: null,
    isLoading: false
});

const state = reactive({
    password: '',
    passwordAgain: '',
    password_check: ''
});

const schema = z
    .object({
        password: z.string().min(1, $i18n.t('validation.required')),
        passwordAgain: z.string().min(1, $i18n.t('validation.required')),
        password_check: z.string().min(1, $i18n.t('validation.required'))
    })
    .refine((data) => data.password === data.passwordAgain, {
        message: $i18n.t('validation.confirmed'),
        path: ['passwordAgain']
    });

type Schema = z.infer<typeof schema>;

async function onSubmit(_event: FormSubmitEvent<Schema>) {
    emit('formSubmit', {
        formData: {
            password: state.password,
            password_check: state.password_check
        },
        successMessage: 'user.password_change_success'
    });
}
</script>
