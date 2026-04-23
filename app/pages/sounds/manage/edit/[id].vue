<!--
TODO:
- check if sound belongs to a user, if not, do not allow to see the form
-->
<template>
    <section class="section">
        <div v-if="fetchPending" class="flex justify-center py-12">
            <UIcon name="i-heroicons-arrow-path" class="size-8 animate-spin text-gray-400" />
        </div>
        <div v-else class="container">
            <div class="mb-4 flex items-center justify-between">
                <h1 class="text-2xl font-bold">
                    {{
                        `${initialData?.name} - ${$i18n.t(
                            `${initialData?.type}.edit`
                        )}`
                    }}
                </h1>
                <UDropdownMenu :items="dropdownItems">
                    <UButton color="error" variant="subtle" trailing-icon="i-heroicons-chevron-down" />
                </UDropdownMenu>
            </div>
            <sound-form
                :error-message="errorMessage"
                :success-message="success"
                :is-loading="isLoading"
                :initial-data="initialData || undefined"
                @form-submit="editSound"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import SoundForm, {
    type ISoundFormData,
    type ISoundFormSubmitData
} from '~/components/form/SoundForm.vue';
import ConfirmModal from '~/components/form/ConfirmModal.vue';
import { readItem, updateItem, deleteItem } from '@directus/sdk';
import { soundFieldSets, type ISoundForm } from '~/plugins/directus/collection';
import { useUserStore } from '@/stores';

const { $i18n, $api, $directus } = useNuxtApp();
const toast = useToast();
const modal = useModal();
const router = useRouter();
const route = useRoute();
const { getUser } = useUserStore();

const error = ref();
const success = ref();
const isLoading = ref(false);

const errorMessage = computed(() => {
    const errorMessage = $api.tools.parseErrorMessage(error.value);
    return errorMessage;
});

const dropdownItems = computed(() => {
    const items = [
        {
            label: $i18n.t(`${initialData.value?.type}.delete`),
            onSelect: onDeleteSound
        }
    ];
    if (initialData.value?.status === 'published') {
        items.push({
            label: $i18n.t(`${initialData.value?.type}.unpublish`),
            onSelect: onUnpublishSound
        });
    }
    return items;
});

const {
    data: initialData,
    pending: fetchPending,
    refresh,
    error: fetchError
} = useAsyncData('soundFormQuery', async function () {
    const id = route.params.id;

    const data = await $directus.request(
        readItem('sound', String(id), { fields: soundFieldSets.form })
    );

    return data;
});

async function editSound({
    formData,
    successMessage = 'sound.edit_success'
}: ISoundFormSubmitData) {
    if (!initialData.value) return;
    try {
        isLoading.value = true;
        const photo = await editPhoto(formData, initialData.value.photo);
        delete formData.photo;

        const soundData: Omit<ISoundForm, 'id'> = {
            ...formData,
            genres: formData.genres
                ? formData.genres.map((genre) => ({
                      genre_id: genre
                  }))
                : null,
            photo: photo && photo !== 'keep-current' ? photo : null
        };

        const updatedSound = await $directus.request(
            updateItem('sound', initialData.value.id, soundData)
        );

        router.push(
            `/djs/${getUser()?.djs?.[0].slug}/sounds/${updatedSound.slug}`
        );

        toast.add({
            title: $i18n.t(successMessage, [formData.name]),
            color: 'success'
        });
    } catch (e: any) {
        error.value = e;
    } finally {
        isLoading.value = false;
    }
}

async function editPhoto(
    formData: ISoundFormData,
    prevPhoto: ISoundForm['photo']
) {
    const newPhoto = formData.photo;
    const newPhotoMeta = {
        title: `sound_${formData.name}`,
        filename_download: `sound_${formData.name}`
    };
    const photoResult = await $api.file.handleCoverPhotoUpdate(
        newPhoto,
        prevPhoto,
        newPhotoMeta
    );
    return photoResult;
}

function onUnpublishSound() {
    if (!initialData.value) return;
    const { id, type, name } = initialData.value;

    const formData = {
        id,
        status: 'draft',
        photo: 'keep-current',
        name
    } as unknown as ISoundFormData;

    modal.open(ConfirmModal, {
        title: $i18n.t(`${type}.unpublish`),
        message: $i18n.t(`${type}.unpublish_confirm_message`, [name]),
        confirmText: $i18n.t(`${type}.unpublish`),
        cancelText: $i18n.t('form.cancel'),
        onConfirm: () =>
            editSound({
                formData,
                successMessage: `${type}.unpublish_success`
            }),
        onClose: () => modal.close()
    });
}

function onDeleteSound() {
    if (!initialData.value) return;
    const { type, name } = initialData.value;

    modal.open(ConfirmModal, {
        title: $i18n.t(`${type}.delete`),
        message: $i18n.t(`${type}.delete_confirm_message`, [name]),
        confirmText: $i18n.t(`${type}.delete`),
        cancelText: $i18n.t('form.cancel'),
        onConfirm: () => deleteSound(),
        onClose: () => modal.close()
    });
}

async function deleteSound() {
    if (!initialData.value) return;
    try {
        isLoading.value = true;
        const { id, type, name } = initialData.value;

        await $directus.request(deleteItem('sound', id));

        router.push(`/djs/${getUser()?.djs?.[0].slug}`);

        toast.add({
            title: $i18n.t(`${type}.delete_success`, [name]),
            color: 'success'
        });
    } catch (e) {
        error.value = $api.tools.parseErrorMessage(e);
    } finally {
        isLoading.value = false;
    }
}
</script>
