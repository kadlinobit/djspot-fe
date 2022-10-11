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
                            `${initialData.name} - ${$i18n.t(
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
                :initial-data="initialData"
                :error-message="errorMessage"
                :success-message="success"
                :is-loading="isLoading"
                @formSubmit="editDj"
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
import DjForm from '~/components/form/DjForm.vue'
import ConfirmModal from '~/components/form/ConfirmModal.vue'
import useDirectus, { useAuth } from '~/composables/directus'

const { $i18n, $api, $oruga } = useNuxtApp()
const directus = useDirectus()
const auth = useAuth()
const router = useRouter()

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

const {
    data: initialData,
    pending: fetchPending,
    refresh,
    error: fetchError
} = useLazyAsyncData(
    'djFormQuery',
    async function () {
        // // PROMISE TO SET TIMEOUT FOR TESTING (TODO - REMOVE)
        // await new Promise((resolve) => setTimeout(resolve, 2000))

        // TODO - put it some error handling (nuxt at the moment doesnt return response body so its a bit hard)
        const data = await directus
            .items('dj')
            .readOne(auth.user.value.djs[0].id, {
                fields: $api.collection
                    .getCollectionFields('dj', 'form')
                    .join(',')
            })
        return {
            ...data,
            genres: data.genres.map((genre) => genre.genre_id)
        }
    },
    // There must be no server side data load - otherwise it is not working
    // TODO: Maybe remove when we get to NUXT 3
    { server: false, initialCache: false }
)

async function editDj({ formData }) {
    try {
        isLoading.value = true
        error.value = null

        // // // PROMISE TO SET TIMEOUT FOR TESTING (TODO - REMOVE)
        // await new Promise((resolve) => setTimeout(resolve, 2000))

        // #1 Handle photo update || delete
        const photo = await editPhoto(formData, initialData.value.photo)
        delete formData.photo
        delete formData.id

        const djData = {
            ...formData,
            genres: formData.genres
                ? formData.genres.map((genre) => ({
                      genre_id: parseInt(genre.id)
                  }))
                : null
        }

        if (photo !== 'keep-current') {
            djData.photo = photo
        }

        const updatedDj = await directus
            .items('dj')
            .updateOne(auth.user.value.djs[0].id, djData)
        await auth.fetchUser()
        router.push(`/djs/${updatedDj.slug}`)

        $oruga.notification.open({
            message: $i18n.t('dj.updated_successfully'),
            variant: 'success',
            duration: 7000
        })
    } catch (e) {
        error.value = e
    } finally {
        isLoading.value = false
    }
}
async function editPhoto(formData, prevPhoto) {
    const newPhoto = formData.photo
    const newPhotoMeta = {
        title: `dj_${formData.slug}_photo`,
        filename_download: `dj_${formData.slug}_photo`
        // folder: 'TODO - ADD FOLDER LATER'
    }
    const photoResult = await $api.file.handleCoverPhotoUpdate(
        newPhoto,
        prevPhoto,
        newPhotoMeta
    )
    return photoResult
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
    })
}
async function deleteDj() {
    try {
        isLoading.value = true
        await directus.items('dj').deleteOne(auth.user.value.djs[0].id)
        await auth.fetchUser()

        router.push(`/`)

        $oruga.notification.open({
            message: $i18n.t('dj.deleted_successfully'),
            variant: 'success',
            duration: 7000
        })
    } catch (e) {
        error.value = e
    } finally {
        isLoading.value = false
    }
}
</script>
