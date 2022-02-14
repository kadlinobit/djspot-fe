<template>
    <section class="section">
        <o-loading
            v-if="$fetchState.pending"
            :full-page="false"
            :active.sync="$fetchState.pending"
            :can-cancel="true"
        />
        <p v-else-if="$fetchState.error">{{ $fetchState.error.message }}</p>
        <div v-else class="container is-max-desktop">
            <div class="columns is-gapless is-vcentered">
                <div class="column">
                    <h1 class="title">
                        {{ $t('user.my_account') }}
                    </h1>
                </div>
                <div class="column is-narrow">
                    <o-button variant="danger" @click="onDeleteDj()">
                        {{ $t('dj.delete_profile') }}
                    </o-button>
                </div>
            </div>
            <o-tabs v-model="activeTab" :expanded="true" :animated="true">
                <o-tab-item :label="$t('user.profile')">
                    <user-form
                        :initial-data="initialData"
                        :on-form-submit="editUser"
                        :error-in="error"
                        :success-in="success"
                        :is-loading-in="isLoading"
                    />
                </o-tab-item>
                <o-tab-item :label="$t('user.change_password')">
                    <user-new-password-form
                        :on-form-submit="editUser"
                        :error-in="error"
                        :success-in="success"
                        :is-loading-in="isLoading"
                    />
                </o-tab-item>
            </o-tabs>
        </div>
    </section>
</template>

<script>
import UserForm from '~/components/form/UserForm.vue'
import UserNewPasswordForm from '~/components/form/UserNewPasswordForm.vue'
export default {
    name: 'UserProfilePage',
    components: {
        UserForm,
        UserNewPasswordForm
    },
    middleware: 'authenticated',
    data() {
        return {
            error: null,
            success: null,
            isLoading: false,
            initialData: null,
            activeTab: 1
        }
    },
    async fetch() {
        try {
            const data = await this.$axios.$get('users/me', {
                params: {
                    fields: this.$api.collection.getCollectionFields('user', 'form').join(',')
                }
            })
            if (data.data) {
                this.initialData = data.data
            } else {
                throw new Error('Cannot get user data')
            }
        } catch (e) {
            this.$fetchState.error = e
            if (e.statusCode && e.statusCode === 404) {
                return this.$nuxt.error({ statusCode: 404, message: e.message })
            }
        }
    },
    methods: {
        async editUser(formDataObj, successMessage) {
            try {
                this.error = null
                this.success = null
                this.isLoading = true

                await this.$axios.patch(`users/me`, formDataObj)
                this.$oruga.notification.open({
                    message: this.$t(successMessage),
                    variant: 'success'
                })
                await this.$fetch()
                await this.$auth.fetchUser()
            } catch (e) {
                this.error = this.$api.tools.parseResponseErrorMessage(e)
            } finally {
                this.isLoading = false
                this.initialData.password_check = null
            }
        }
    }
}
</script>
