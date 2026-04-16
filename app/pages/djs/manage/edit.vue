<template>
    <section class="section">
        <o-loading
            v-if="fetchPending"
            :full-page="false"
            :active="fetchPending"
            :can-cancel="true"
        />
        <div v-else class="container">
            <div class="columns is-gapless is-vcentered">
                <div class="column">
                    <h1 class="title">
                        {{
                            `${initialData?.name} - ${$i18n.t(
                                'dj.edit_profile'
                            )}`
                        }}
                    </h1>
                </div>
                <div class="column is-narrow">
                    <o-button variant="danger" @click="onDeleteDj()">
                        {{ $i18n.t('dj.delete_profile') }}
                    </o-button>
                </div>
            </div>
            <dj-form
                v-if="initialData"
                :initial-data="initialData"
                :error-message="errorMessage"
                :success-message="success"
                :is-loading="isLoading"
                @form-submit="editDj"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
/**
 * TBD
 * - try to handle genres so there is no new dj_genre creation for each DJ update
 */
// import _ from 'lodash'
import DjForm, {
    type IDjFormSubmitData,
    type IDjFormData
} from '~/components/form/DjForm.vue';
import ConfirmModal from '~/components/form/ConfirmModal.vue';
import { deleteItem, readItem, updateItem } from '@directus/sdk';
import { useUserStore } from '@/stores';
import { djFieldSets, type IDjForm } from '~/plugins/directus/collection';
import { useOruga } from '@oruga-ui/oruga';

const $oruga = useOruga();
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
    pending: fetchPending,
    refresh,
    error: fetchError
} = useAsyncData('IDjFormQuery', async function () {
    // // PROMISE TO SET TIMEOUT FOR TESTING (TODO - REMOVE)
    // await new Promise((resolve) => setTimeout(resolve, 2000))

    const djID = getUser()?.djs?.[0].id;
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

        // // // PROMISE TO SET TIMEOUT FOR TESTING (TODO - REMOVE)
        // await new Promise((resolve) => setTimeout(resolve, 2000))

        // #1 Handle photo update || delete
        const photo = await editPhoto(formData, initialData.value.photo);
        delete formData.photo;

        const djData: Omit<IDjForm, 'id'> = {
            ...formData,
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

        $oruga.notification.open({
            message: $i18n.t('dj.updated_successfully'),
            variant: 'success',
            duration: 7000
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
        // folder: 'TODO - ADD FOLDER LATER'
    };
    const photoResult = await $api.file.handleCoverPhotoUpdate(
        newPhoto,
        prevPhoto,
        newPhotoMeta
    );
    return photoResult;
}

function onDeleteDj() {
    $oruga.modal.open({
        active: true,
        component: ConfirmModal,
        props: {
            title: $i18n.t('dj.delete_profile'),
            message: $i18n.t('dj.delete_profile_confirm_message'),
            confirmText: $i18n.t('dj.delete_profile'),
            cancelText: $i18n.t('form.cancel'),
            onConfirm: () => deleteDj()
        }
    });
}

async function deleteDj() {
    try {
        if (!initialData.value) return;
        isLoading.value = true;

        await $directus.request(deleteItem('dj', initialData.value.id));
        await $updateUser();
        router.push(`/`);

        $oruga.notification.open({
            message: $i18n.t('dj.deleted_successfully'),
            variant: 'success',
            duration: 7000
        });
    } catch (e) {
        error.value = e;
    } finally {
        isLoading.value = false;
    }
}
</script>
