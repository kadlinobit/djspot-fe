<template>
    <section class="section">
        <div class="container">
            <h1 class="mb-6 text-2xl font-bold">{{ $i18n.t('dj.create_profile') }}</h1>
            <dj-form
                :on-form-submit="createDj"
                :error-message="errorMessage"
                :success-message="success"
                :is-loading="isLoading"
                :initial-data="null"
                @form-submit="createDj"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import _ from 'lodash';
import DjForm from '~/components/form/DjForm.vue';
import { createItem } from '@directus/sdk';

const { $i18n, $api, $media, $directus } = useNuxtApp();
const toast = useToast();
const router = useRouter();

const error = ref(null);
const success = ref(null);
const isLoading = ref(false);

const errorMessage = computed(() => {
    const errorMessage = $api.tools.parseErrorMessage(error.value);
    return errorMessage;
});

async function createDj({ formData }) {
    try {
        console.log('SENDING');
        isLoading.value = true;
        const photo = await createPhoto(formData);

        const djData = {
            ...formData,
            genres: formData.genres
                ? formData.genres.map((genre) => ({
                      genre_id: parseInt(genre.id)
                  }))
                : null,
            photo: photo?.id ? photo.id : null,
            status: 'published'
        };

        const newDj = await $directus.request(createItem('dj', djData));

        router.push(`/djs/${newDj.slug}`);

        toast.add({
            title: $i18n.t('dj.created_successfully'),
            color: 'success'
        });
    } catch (e) {
        error.value = e;
    } finally {
        isLoading.value = false;
    }
}

async function createPhoto(formData) {
    let newPhoto = null;

    if (!_.isEmpty(formData.photo)) {
        const photoBlob = await $media.getCroppedImageBlob(formData.photo);

        if (photoBlob) {
            const photoMeta = {
                title: `dj_${formData.slug}`,
                filename_download: `dj_${formData.slug}`
            };

            newPhoto = await $api.file.handleUploadFile(photoBlob, photoMeta);
        }

        return newPhoto;
    }
}
</script>
