<template>
    <section class="section">
        <div class="container">
            <h1 class="mb-6 text-2xl font-bold">
                {{ $i18n.t('sound.add') }}
            </h1>
            <sound-form
                :error-message="errorMessage"
                :success-message="success"
                :is-loading="isLoading"
                @form-submit="createSound"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { createItem } from '@directus/sdk';

import { useUserStore } from '@/stores';
import SoundForm, {
    type ISoundFormData,
    type SoundFormSubmitData
} from '@/components/form/SoundForm.vue';
const { $i18n, $api, $media, $directus } = useNuxtApp();
const router = useRouter();
const toast = useToast();
const { getUser } = useUserStore();

// TODO - find out why definePageMeta is not working
// definePageMeta({
//     middleware: 'authorized'
// })

const error = ref();
const success = ref();
const isLoading = ref(false);

const errorMessage = computed(() => {
    const errorMessage = $api.tools.parseErrorMessage(error.value);
    return errorMessage;
});

async function createSound({ formData }: SoundFormSubmitData) {
    try {
        isLoading.value = true;
        const photo = await createPhoto(formData);

        const soundData = {
            ...formData,
            dj: getUser()?.djs?.[0]?.id,
            genres: formData.genres.map((id) => ({ genre_id: id })) as any,
            photo: photo?.id ? photo.id : undefined,
            status: 'published'
        };

        const newSound = await $directus.request(
            createItem('sound', soundData)
        );

        if (newSound) {
            router.push(
                `/djs/${getUser()?.djs?.[0].slug}/sounds/${newSound.slug}`
            );

            toast.add({
                title: $i18n.t(`${formData.type}.add_success`, [
                    formData.name
                ]),
                color: 'success'
            });
        }
    } catch (e) {
        error.value = e;
    } finally {
        isLoading.value = false;
    }
}
async function createPhoto(formData: ISoundFormData) {
    let newPhoto = null;
    if (!_.isEmpty(formData.photo)) {
        const photoBlob = await $media.getCroppedImageBlob(formData.photo);

        if (photoBlob) {
            const photoMeta = {
                title: `sound_${formData.name}`,
                filename_download: `sound_${formData.name}`
                // folder: 'TBD - ADD FOLDER LATER'
            };
            newPhoto = await $api.file.handleUploadFile(photoBlob, photoMeta);
        }

        return newPhoto;
    }
}
</script>
