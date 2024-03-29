<template>
    <section class="section">
        <o-loading
            v-if="pending"
            :full-page="false"
            :active.sync="pending"
            :can-cancel="true"
        />
        <div class="container is-max-desktop">
            <div class="columns is-gapless is-vcentered">
                <div class="column">
                    <h1 class="title">
                        {{ $i18n.t('user.my_account') }}
                    </h1>
                </div>
                <div class="column is-narrow">
                    <o-button variant="danger" @click="deleteUser">
                        {{ $i18n.t('dj.delete_profile') }}
                    </o-button>
                </div>
            </div>
            <o-tabs v-model="activeTab" :expanded="true" :animated="true">
                <o-tab-item :label="$i18n.t('user.profile')">
                    <user-form
                        :initial-data="initialData"
                        :error-message="errorMessage"
                        :success-message="success"
                        :is-loading="isLoading"
                        @formSubmit="editUser"
                    />
                </o-tab-item>
                <o-tab-item :label="$i18n.t('user.change_password')">
                    <user-new-password-form
                        :error-message="errorMessage"
                        :successMessage="success"
                        :is-loading-in="isLoading"
                        @formSubmit="editUser"
                    />
                </o-tab-item>
            </o-tabs>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useProgrammatic } from '@oruga-ui/oruga'
import UserForm from '~/components/form/UserForm.vue'
import UserNewPasswordForm from '~/components/form/UserNewPasswordForm.vue'
import useDirectus, { useAuth } from '~/composables/directus'
const directus = useDirectus()
const auth = useAuth()

const { $i18n, $api } = useNuxtApp()
const { oruga: $oruga } = useProgrammatic()

definePageMeta({
    middleware: ['authenticated']
})

const success = ref(null)
const isLoading = ref(false)
const activeTab = ref(1)

const errorMessage = computed(() => {
    const errorMessage = $api.tools.parseErrorMessage(error.value)
    return errorMessage
})

const {
    data: initialData,
    pending,
    refresh,
    error
} = useLazyAsyncData('userFormQuery', async function () {
    // PROMISE TO SET TIMEOUT FOR TESTING
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    const data = await directus.users.me.read({
        fields: $api.collection.getCollectionFields('user', 'form')
    })
    return data
})

watch(
    () => pending,
    (val) => (isLoading.value = pending.value)
)

// async function fetch() {
//     try {
//         // // AXIOS WAY
//         // const data = await this.$axios.$get('users/me', {
//         //     params: {
//         //         fields: this.$api.collection
//         //             .getCollectionFields('user', 'form')
//         //             .join(',')
//         //     }
//         // })

//         // DIRECTUS WAY
//         const data = await directus.users.me.read({
//             fields: this.$api.collection.getCollectionFields('user', 'form')
//         })
//         if (data) {
//             this.initialData = data
//         } else {
//             throw new Error('Cannot get user data')
//         }
//     } catch (e) {
//         this.$fetchState.error = e
//         if (e.statusCode && e.statusCode === 404) {
//             return this.$nuxt.error({ statusCode: 404, message: e.message })
//         }
//     }
// }

async function editUser({ formData, successMessage }) {
    try {
        error.value = null
        success.value = null
        isLoading.value = true

        // AXIOS WAY
        // await this.$axios.patch(`users/me`, formDataObj)

        // DIRECTUS WAY
        await directus.users.me.update(formData)
        refresh()
        auth.fetchUser()
        $oruga.notification.open({
            message: $i18n.t(successMessage),
            variant: 'success'
        })
    } catch (e) {
        error.value = $api.tools.parseErrorMessage(e)
    } finally {
        isLoading.value = false
        initialData.value.password_check = null
    }
}

function deleteUser() {}
</script>
