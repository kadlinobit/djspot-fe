<template>
    <client-only>
        <section class="section">
            <div class="container">
                <div class="columns">
                    <div class="column is-4 is-offset-4">
                        <h2 class="title has-text-centered">
                            {{ $i18n.t('user.reset_password') }}
                        </h2>

                        <o-notification
                            v-if="success"
                            variant="success"
                            :closable="false"
                        >
                            {{ $i18n.t(success) }}
                        </o-notification>
                        <o-notification
                            v-if="error"
                            variant="danger"
                            :closable="false"
                        >
                            {{ $i18n.t(error) }}
                        </o-notification>

                        <form v-if="!success" method="post" @submit.prevent>
                            <o-validated-field
                                v-model="password1"
                                vid="password1"
                                name="password1"
                                type="password"
                                :label="$i18n.t('user.new_password')"
                                rules="required"
                            />

                            <o-validated-field
                                v-model="password2"
                                name="password2"
                                type="password"
                                :label="$i18n.t('user.password_again')"
                                rules="required|confirmed:password1"
                            />
                            <div class="field">
                                <div class="control">
                                    <o-button
                                        :disabled="isLoading"
                                        variant="dark is-fullwidth"
                                        @click="onSubmit"
                                    >
                                        {{ $i18n.t('user.do_reset_password') }}
                                    </o-button>
                                </div>
                            </div>
                        </form>

                        <div
                            v-if="success"
                            class="has-text-centered"
                            style="margin-top: 20px"
                        >
                            <p>
                                <nuxt-link :to="{ path: '/login' }">
                                    {{ $i18n.t('user.go_to_login_page') }}
                                </nuxt-link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </client-only>
</template>

<script setup lang="ts">
// import { extend, ValidationObserver } from 'vee-validate'
// import {
//     required as ruleRequired,
//     confirmed as ruleConfirmed
// } from 'vee-validate/dist/rules'
import { onMounted } from 'vue'
import OValidatedField from '~/components/form/OValidatedField.vue'
import useDirectus from '~/composables/directus'

const { $oruga, $i18n, $api } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const directus = useDirectus()

// extend('required', ruleRequired)
// extend('confirmed', ruleConfirmed)

const password1 = ref('')
const password2 = ref('')
const success = ref(null)
const error = ref(null)
const isLoading = ref(false)
const token = ref(null)
const observer = ref(null)

const errorMessage = computed(() => {
    const errorMessage = $api.tools.parseErrorMessage(error.value)
    return errorMessage
})

onMounted(() => {
    // TODO - different handling of missing token
    if (!route.query.token) {
        router.push('/forgot-password')
    } else {
        token.value = route.query.token
    }
})

function onSubmit() {
    observer.value.validate().then((isValid) => {
        if (!isValid) {
            $oruga.notification.open({
                message: $i18n.t('validation.form_validation_error'),
                variant: 'danger'
            })
            return
        }
        resetPassword()
    })
}
async function resetPassword() {
    error.value = null
    try {
        isLoading.value = true

        await directus.auth.password.reset(token.value, password1.value)
        // await $axios.post('auth/password/reset', {
        //     token: token.value,
        //     password: password1.value
        // })

        success.value = 'user.password_reset_success'
    } catch (e) {
        error.value = e
    } finally {
        isLoading.value = false
    }
}
</script>
