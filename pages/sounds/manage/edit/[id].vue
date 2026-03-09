<!-- 
TODO:
- check if sound belongs to a user, if not, do not allow to see the form
-->
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
                                `${initialData?.type}.edit`
                            )}`
                        }}
                    </h1>
                </div>
                <div class="column is-narrow">
                    <o-dropdown aria-role="list" position="bottom-left">
                        <template #trigger="{ active }">
                            <o-button variant="danger">
                                <o-icon
                                    :icon="
                                        active ? 'chevron-up' : 'chevron-down'
                                    "
                                ></o-icon>
                            </o-button>
                        </template>

                        <o-dropdown-item
                            aria-role="listitem"
                            @click="onDeleteSound"
                        >
                            {{ $i18n.t(`${initialData?.type}.delete`) }}
                        </o-dropdown-item>
                        <o-dropdown-item
                            v-if="initialData?.status === 'published'"
                            aria-role="listitem"
                            @click="onUnpublishSound"
                        >
                            {{ $i18n.t(`${initialData?.type}.unpublish`) }}
                        </o-dropdown-item>
                    </o-dropdown>
                </div>
            </div>
            <sound-form
                :error-message="errorMessage"
                :success-message="success"
                :is-loading="isLoading"
                :initial-data="initialData || undefined"
                @formSubmit="editSound"
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
import { useOruga } from '@oruga-ui/oruga';
import { readItem, updateItem, deleteItem } from '@directus/sdk';
import { soundFieldSets, type ISoundForm } from '~/plugins/directus/collection';
import { useUserStore } from '@/stores';

const { $i18n, $api, $directus } = useNuxtApp();
const $oruga = useOruga();
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
        // #1 Handle photo update || delete
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

        $oruga.notification.open({
            message: $i18n.t(successMessage, [formData.name]),
            variant: 'success',
            duration: 7000
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
        // folder: 'TBD - ADD FOLDER LATER'
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
    } as unknown as ISoundFormData; //TODO - remove this cast

    $oruga.modal.open({
        active: true,
        component: ConfirmModal,
        props: {
            title: $i18n.t(`${type}.unpublish`),
            message: $i18n.t(`${type}.unpublish_confirm_message`, [name]),
            confirmText: $i18n.t(`${type}.unpublish`),
            cancelText: $i18n.t('form.cancel'),
            onConfirm: () =>
                editSound({
                    formData,
                    successMessage: `${type}.unpublish_success`
                })
        }
    });
}
function onDeleteSound() {
    if (!initialData.value) return;
    const { type, name } = initialData.value;

    $oruga.modal.open({
        active: true,
        component: ConfirmModal,
        props: {
            title: $i18n.t(`${type}.delete`),
            message: $i18n.t(`${type}.delete_confirm_message`, [name]),
            confirmText: $i18n.t(`${type}.delete`),
            cancelText: $i18n.t('form.cancel'),
            onConfirm: () => deleteSound()
        }
    });
}
async function deleteSound() {
    if (!initialData.value) return;
    try {
        isLoading.value = true;
        const { id, type, name } = initialData.value;

        await $directus.request(deleteItem('sound', id));

        router.push(`/djs/${getUser()?.djs?.[0].slug}`);

        $oruga.notification.open({
            message: $i18n.t(`${type}.delete_success`, [name]),
            variant: 'success',
            duration: 7000
        });
    } catch (e) {
        error.value = $api.tools.parseErrorMessage(e);
    } finally {
        isLoading.value = false;
    }
}
</script>
