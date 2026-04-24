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
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <UFormField
                    :label="$i18n.t('user.first_name')"
                    name="first_name"
                >
                    <UInput
                        v-model="state.first_name"
                        :placeholder="$i18n.t('user.first_name')"
                        class="w-full"
                    />
                </UFormField>

                <UFormField :label="$i18n.t('user.last_name')" name="last_name">
                    <UInput
                        v-model="state.last_name"
                        :placeholder="$i18n.t('user.last_name')"
                        class="w-full"
                    />
                </UFormField>
            </div>

            <UFormField :label="$i18n.t('user.email')" name="email">
                <UInput
                    v-model="state.email"
                    type="email"
                    disabled
                    class="w-full"
                />
            </UFormField>

            <UFormField :label="$i18n.t('user.location')" name="location">
                <USelectMenu
                    v-model="state.location"
                    :items="formStore.citiesOptions"
                    value-key="value"
                    :placeholder="$i18n.t('dj.select_city')"
                    class="w-full"
                />
            </UFormField>

            <UFormField
                :label="$i18n.t('user.preffered_language')"
                name="language"
            >
                <USelectMenu
                    v-model="state.language"
                    :items="languagesOptions"
                    value-key="value"
                    class="w-full"
                />
            </UFormField>

            <UFormField
                :label="$i18n.t('user.password_check')"
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
                    {{ $i18n.t('user.save_profile') }}
                </UButton>
            </div>
        </UForm>
    </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import { useFormStore } from '~/stores';

const { $i18n } = useNuxtApp();
const formStore = useFormStore();

const emit = defineEmits<{
    (e: 'formSubmit', formSubmitData: any): void;
}>();

interface InitialData {
    first_name?: string;
    last_name?: string;
    email?: string;
    location?: string;
    language?: string;
    password_check?: string;
}

interface Props {
    initialData?: InitialData;
    errorMessage?: string;
    successMessage?: string;
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false
});

const state = reactive({
    first_name: '',
    last_name: '',
    email: '',
    location: '',
    language: '',
    password_check: ''
});

const nameRegEx = /^$|^[a-z\d\-\sáčďéěíňóřšťúůýž]+$/gi;

const schema = z.object({
    first_name: z
        .string()
        .min(1, $i18n.t('validation.required'))
        .regex(nameRegEx, $i18n.t('validation.alpha_num_dash_space')),
    last_name: z
        .string()
        .min(1, $i18n.t('validation.required'))
        .regex(nameRegEx, $i18n.t('validation.alpha_num_dash_space')),
    email: z
        .string()
        .email($i18n.t('validation.email'))
        .min(1, $i18n.t('validation.required')),
    password_check: z.string().min(1, $i18n.t('validation.required'))
});

type Schema = z.infer<typeof schema>;

const languagesOptions = computed(() => {
    return ($i18n.locales.value as any[])
        .filter((locale) => locale.iso)
        .map((locale) => ({ value: locale.iso, label: locale.name }))
        .sort((a, b) => a.value.localeCompare(b.value));
});

onMounted(() => {
    if (props.initialData) {
        Object.assign(state, props.initialData);
    }
});

watch(
    () => props.initialData,
    (val) => {
        if (val) {
            Object.assign(state, val);
        }
    },
    { deep: true }
);

async function onSubmit(_event: FormSubmitEvent<Schema>) {
    emit('formSubmit', {
        formData: { ...state },
        successMessage: 'user.profile_update_success'
    });
}
</script>
