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
                            `${initialData.name} - ${$i18n.t(
                                `${initialData.type}.edit`
                            )}`
                        }}
                    </h1>
                </div>
                <div class="column is-narrow">
                    <o-dropdown aria-role="list" position="bottom-left">
                        <o-button
                            slot="trigger"
                            slot-scope="{ active }"
                            variant="danger"
                        >
                            <o-icon
                                :icon="active ? 'chevron-up' : 'chevron-down'"
                            ></o-icon>
                        </o-button>

                        <o-dropdown-item
                            aria-role="listitem"
                            @click="onDeleteSound"
                        >
                            {{ $i18n.t(`${initialData.type}.delete`) }}
                        </o-dropdown-item>
                        <o-dropdown-item
                            v-if="initialData.status === 'published'"
                            aria-role="listitem"
                            @click="onUnpublishSound"
                        >
                            {{ $i18n.t(`${initialData.type}.unpublish`) }}
                        </o-dropdown-item>
                    </o-dropdown>
                </div>
            </div>
            <sound-form
                :error-message="errorMessage"
                :success-message="success"
                :is-loading="isLoading"
                :initial-data="initialData"
                @formSubmit="editSound"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import SoundForm from '~/components/form/SoundForm.vue'
import ConfirmModal from '~/components/form/ConfirmModal.vue'
import useDirectus, { useAuth } from '~/composables/directus'

const directus = useDirectus()
const auth = useAuth()
const { $i18n, $axios, $oruga, $api } = useNuxtApp()
const router = useRouter()
const route = useRoute()

definePageMeta({
    middleware: 'authenticated'
})

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
    'soundFormQuery',
    async function () {
        // // PROMISE TO SET TIMEOUT FOR TESTING (TODO - REMOVE)
        // await new Promise((resolve) => setTimeout(resolve, 2000))
        const id = route.params.id

        // TODO - put it some error handling (nuxt at the moment doesnt return response body so its a bit hard)
        const data = await directus.items('sound').readOne(id, {
            fields: $api.collection.getCollectionFields('sound', 'form')
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

// async fetch() {
//     try {
//         const id = this.$nuxt.context.params.id
//         const data = await this.$axios.$get(`items/sound/${id}`, {
//             params: {
//                 fields: this.$api.collection
//                     .getCollectionFields('sound', 'form')
//                     .join(',')
//             }
//         })

//         if (data.data) {
//             this.initialData = {
//                 ...data.data,
//                 genres: data.data.genres.map((genre) => genre.genre_id)
//             }
//         } else {
//             throw new Error('Sound not found')
//         }
//     } catch (e) {
//         this.$fetchState.error = e
//         if (e.statusCode && e.statusCode === 404) {
//             return this.$nuxt.error({ statusCode: 404, message: e.message })
//         }
//     }
// },

async function editSound({ formData, successMessage = 'sound.edit_success' }) {
    try {
        isLoading.value = true
        const id = formData.id
        // #1 Handle photo update || delete
        const photo = await editPhoto(formData, initialData.value.photo)
        delete formData.photo
        delete formData.id

        const soundData = {
            ...formData,
            genres: formData.genres
                ? formData.genres.map((genre) => ({
                      genre_id: parseInt(genre.id)
                  }))
                : null
        }

        if (photo !== 'keep-current') {
            soundData.photo = photo
        }

        const updatedSound = await directus
            .items('sound')
            .updateOne(id, soundData)

        // // AXIOS WAY
        // const updatedSound = await this.$axios.patch(
        //     `items/sound/${id}`,
        //     soundData
        // )

        router.push(
            `/djs/${auth.user.value.djs[0].slug}/sounds/${updatedSound.id}`
        )

        $oruga.notification.open({
            message: $i18n.t(successMessage, [formData.name]),
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
        title: `sound_${formData.name}`,
        filename_download: `sound_${formData.name}`
        // folder: 'TBD - ADD FOLDER LATER'
    }
    const photoResult = await $api.file.handleCoverPhotoUpdate(
        newPhoto,
        prevPhoto,
        newPhotoMeta
    )
    return photoResult
}
function onUnpublishSound() {
    const { id, type, name } = initialData.value

    const formData = {
        id,
        status: 'draft',
        photo: 'keep-current',
        name
    }

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
    })
}
function onDeleteSound() {
    const { type, name } = initialData.value

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
    })
}
async function deleteSound() {
    try {
        isLoading.value = true
        const { id, type, name } = initialData.value

        // // AXIOS WAY
        // await $axios.delete(`items/sound/${id}`)

        await directus.items('sound').deleteOne(id)

        router.push(`/djs/${auth.user.value.djs[0].slug}`)

        $oruga.notification.open({
            message: $i18n.t(`${type}.delete_success`, [name]),
            variant: 'success',
            duration: 7000
        })
    } catch (e) {
        error.value = parseErrorMessage(e)
    } finally {
        isLoading.value = false
    }
}
</script>
