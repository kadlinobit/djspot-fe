<template>
    <section class="section">
        <div class="container">
            <h1 class="title">
                {{ $i18n.t('sound.add') }}
            </h1>
            <sound-form
                :error-message="errorMessage"
                :success-message="success"
                :is-loading="isLoading"
                :initial-data="null"
                @formSubmit="createSound"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import _ from 'lodash'
import SoundForm from '~/components/form/SoundForm.vue'
import useDirectus, { useAuth } from '~/composables/directus'

const { $oruga, $i18n, $api, $media } = useNuxtApp()
const router = useRouter()
const directus = useDirectus()
const auth = useAuth()

// TODO - find out why definePageMeta is not working
// definePageMeta({
//     middleware: 'authorized'
// })

const error = ref(null)
const success = ref(null)
const isLoading = ref(false)

const errorMessage = computed(() => {
    const errorMessage = $api.tools.parseErrorMessage(error.value)
    return errorMessage
})

async function createSound({ formData }) {
    try {
        isLoading.value = true
        const photo = await createPhoto(formData)

        const soundData = {
            ...formData,
            dj: auth.user.value.djs[0].id,
            genres: formData.genres
                ? formData.genres.map((genre) => ({
                      genre_id: parseInt(genre.id)
                  }))
                : null,
            photo: photo?.id ? photo.id : null,
            status: 'published'
        }

        const newSound = await directus.items('sound').createOne(soundData)

        if (newSound) {
            router.push(
                `/djs/${auth.user.value.djs[0].slug}/sounds/${newSound.id}`
            )

            $oruga.notification.open({
                message: $i18n.t(`${formData.type}.add_success`, [
                    formData.name
                ]),
                variant: 'success',
                duration: 7000
            })
        }
    } catch (e) {
        error.value = e
    } finally {
        isLoading.value = false
    }
}
async function createPhoto(formData) {
    let newPhoto = null

    if (!_.isEmpty(formData.photo)) {
        const photoBlob = await $media.getCroppedImageBlob(formData.photo)

        if (photoBlob) {
            const photoMeta = {
                title: `sound_${formData.name}`,
                filename_download: `sound_${formData.name}`
                // folder: 'TBD - ADD FOLDER LATER'
            }

            newPhoto = await $api.file.uploadFile(photoBlob, photoMeta)
        }

        return newPhoto
    }
}
</script>
