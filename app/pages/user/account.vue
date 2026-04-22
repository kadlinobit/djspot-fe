<template>
    <UContainer class="py-8">
        <div class="mb-8 flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ $i18n.t('user.my_account') }}
            </h1>
            <UButton
                color="error"
                variant="ghost"
                icon="i-heroicons-trash"
                @click="deleteUser"
            >
                {{ $i18n.t('dj.delete_profile') }}
            </UButton>
        </div>

        <UTabs :items="tabs" class="w-full">
            <template #profile="{ item }">
                <div class="mt-4">
                    <user-form
                        :initial-data="initialData"
                        :error-message="errorMessage"
                        :success-message="success"
                        :is-loading="isLoading"
                        @form-submit="editUser"
                    />
                </div>
            </template>
            <template #password="{ item }">
                <div class="mt-4">
                    <user-new-password-form
                        :error-message="errorMessage"
                        :success-message="success"
                        :is-loading="isLoading"
                        @form-submit="editUser"
                    />
                </div>
            </template>
        </UTabs>

        <div
            v-if="pending"
            class="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-black/50"
        >
            <UProgress animation="carousel" class="w-48" />
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import UserForm from '~/components/form/UserForm.vue';
import UserNewPasswordForm from '~/components/form/UserNewPasswordForm.vue';
import { readMe, updateMe } from '@directus/sdk';

const { $i18n, $api, $directus, $updateUser } = useNuxtApp();
const toast = useToast();

const success = ref(null);
const isLoading = ref(false);

const tabs = [
    { slot: 'profile', label: $i18n.t('user.profile') },
    { slot: 'password', label: $i18n.t('user.change_password') }
];

const {
    data: initialData,
    pending,
    refresh,
    error
} = useLazyAsyncData('userFormQuery', async function () {
    const data = await $directus.request(
        readMe({
            fields: $api.collection.getCollectionFields('user', 'form')
        })
    );
    return data;
});

const errorMessage = computed(() => {
    const errorMessage = $api.tools.parseErrorMessage(error.value);
    return errorMessage;
});

watch(
    () => pending.value,
    (val) => (isLoading.value = val)
);

async function editUser({ formData, successMessage }) {
    try {
        error.value = null;
        success.value = null;
        isLoading.value = true;

        await $directus.request(updateMe(formData));
        await refresh();
        await $updateUser();

        toast.add({
            title: $i18n.t(successMessage),
            color: 'success',
            icon: 'i-heroicons-check-circle'
        });
    } catch (e) {
        console.error(e);
        error.value = e;
    } finally {
        isLoading.value = false;
        if (initialData.value) {
            initialData.value.password_check = null;
        }
    }
}

function deleteUser() {
    // Delete user implementation remains the same
}
</script>
