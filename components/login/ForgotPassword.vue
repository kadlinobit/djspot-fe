<template>
    <div class="form-login page-forgot-password">
        <o-notification v-if="success" variant="success" :closable="false">
            {{ $i18n.t(success) }}
        </o-notification>
        <o-notification v-if="errorMessage" variant="danger" :closable="false">
            {{ $i18n.t(errorMessage) }}
        </o-notification>

        <form v-if="!success" method="post" @submit.prevent>
            <o-validated-field
                v-model="email"
                name="email"
                type="email"
                :label="$i18n.t('user.email')"
            />
            <div class="field">
                <div class="control">
                    <o-button
                        variant="dark is-fullwidth"
                        :disabled="isLoading"
                        @click="onSubmit"
                    >
                        {{ $i18n.t('user.email_reset_link') }}
                    </o-button>
                </div>
            </div>
        </form>

        <div class="has-text-centered" style="margin-top: 20px">
            <p>
                <nuxt-link
                    v-if="displayType === 'page'"
                    :to="{ path: '/login' }"
                >
                    {{ $i18n.t('user.go_to_login_page') }}
                </nuxt-link>
                <a
                    v-if="displayType === 'modal'"
                    @click="() => mainStore.setLoginActiveComponent('login')"
                >
                    {{ $i18n.t('user.go_to_login_page') }}
                </a>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import OValidatedField from '~/components/form/OValidatedField.vue'
import { useMainStore } from '~/stores'
import useDirectus from '~/composables/directus'
const { $i18n, $api } = useNuxtApp()

const directus = useDirectus()
const mainStore = useMainStore()

interface Props {
    displayType?: string
}

const props = withDefaults(defineProps<Props>(), {
    displayType: 'page'
})

const email = ref('')
const success = ref(null)
const error = ref(null)
const isLoading = ref(false)
const observer = ref(null)

function onSubmit() {
    observer.value.validate().then((success) => {
        if (!success) {
            return
        }
        forgotPassword()
    })
}
async function forgotPassword() {
    error.value = null
    try {
        isLoading.value = true

        await directus.auth.password.request(email.value)

        error.value = null
        success.value = 'user.password_reset_link_sent'
    } catch (e) {
        error.value = e
    } finally {
        isLoading.value = false
    }
}

const errorMessage = computed(() => {
    const errorMessage = $api.tools.parseErrorMessage(error.value)
    return errorMessage
})
</script>
