<template>
    <UContainer class="py-10">
        <div v-if="fetchPending" class="flex justify-center py-12">
            <UIcon name="i-heroicons-arrow-path" class="size-8 animate-spin text-gray-400" />
        </div>
        <template v-else>
            <div class="mb-8 flex items-center justify-between">
                <h1 class="text-3xl font-bold">
                    {{ `${initialData?.name} - ${$i18n.t('dj.edit_profile')}` }}
                </h1>
                <UButton color="error" variant="subtle" @click="onDeleteDj()">
                    {{ $i18n.t('dj.delete_profile') }}
                </UButton>
            </div>
            <dj-form
                v-if="initialData"
                :initial-data="initialData"
                :error-message="errorMessage"
                :success-message="success"
                :is-loading="isLoading"
                @form-submit="editDj"
            />
        </template>
    </UContainer>
</template>

<script setup lang="ts">
/**
 * TBD
 * - try to handle genres so there is no new dj_genre creation for each DJ update
 */
import DjForm, {
    type IDjFormSubmitData,
    type IDjFormData
} from '~/components/form/DjForm.vue';
import ConfirmModal from '~/components/form/ConfirmModal.vue';
import { deleteItem, readItem, updateItem } from '@directus/sdk';
import { useUserStore } from '@/stores';
import { djFieldSets, type IDjForm } from '~/plugins/directus/collection';

const toast = useToast();
const overlay = useOverlay();
const { getUser } = useUserStore();

const { $i18n, $api, $directus, $updateUser } = useNuxtApp();
const router = useRouter();

const error = ref();
const success = ref();
const isLoading = ref(false);

const errorMessage = computed(() => {
    const errorMessage = $api.tools.parseErrorMessage(error.value);
    return errorMessage;
});

const {
    data: initialData,
    pending: fetchPending
} = useAsyncData('IDjFormQuery', async function () {
    const djID = getUser()?.djs?.[0]?.id;
    if (!djID) return;

    const data = await $directus.request(
        readItem('dj', djID, { fields: djFieldSets.form })
    );

    return data;
});

async function editDj({ formData }: IDjFormSubmitData) {
    if (!initialData.value) return;
    try {
        isLoading.value = true;
        error.value = null;

        const photo = await editPhoto(formData, initialData.value.photo);
        delete formData.photo;

        const djData: Omit<IDjForm, 'id'> = {
            ...formData,
            city: formData.city ?? '',
            email: formData.email ?? '',
            bio: formData.bio ?? '',
            genres: formData.genres
                ? formData.genres.map((genre) => ({
                      genre_id: genre
                  }))
                : null,
            photo: photo && photo !== 'keep-current' ? photo : null
        };

        const updatedDj = await $directus.request(
            updateItem('dj', initialData.value.id, djData)
        );

        await $updateUser();
        router.push(`/djs/${updatedDj.slug}`);

        toast.add({
            title: $i18n.t('dj.updated_successfully'),
            color: 'success'
        });
    } catch (e) {
        error.value = e;
    } finally {
        isLoading.value = false;
    }
}

async function editPhoto(formData: IDjFormData, prevPhoto: IDjForm['photo']) {
    const newPhoto = formData.photo;
    const newPhotoMeta = {
        title: `dj_${formData.slug}_photo`,
        filename_download: `dj_${formData.slug}_photo`
    };
    const photoResult = await $api.file.handleCoverPhotoUpdate(
        newPhoto,
        prevPhoto,
        newPhotoMeta
    );
    return photoResult;
}

async function onDeleteDj() {
    const modal = overlay.create(ConfirmModal, { destroyOnClose: true });
    const confirmed = await modal.open({
        title: $i18n.t('dj.delete_profile'),
        message: $i18n.t('dj.delete_profile_confirm_message'),
        confirmText: $i18n.t('dj.delete_profile'),
        cancelText: $i18n.t('form.cancel')
    });
    if (confirmed) await deleteDj();
}

async function deleteDj() {
    try {
        if (!initialData.value) return;
        isLoading.value = true;

        await $directus.request(deleteItem('dj', initialData.value.id));
        await $updateUser();
        router.push(`/`);

        toast.add({
            title: $i18n.t('dj.deleted_successfully'),
            color: 'success'
        });
    } catch (e) {
        error.value = e;
    } finally {
        isLoading.value = false;
    }
}
</script>
