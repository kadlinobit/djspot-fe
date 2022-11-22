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
                            v-if="errorMessage"
                            variant="danger"
                            :closable="false"
                        >
                            {{ $i18n.t(errorMessage) }}
                        </o-notification>

                        <form v-if="!success" method="post" @submit.prevent>
                            <o-validated-field
                                v-model="password"
                                vid="password"
                                name="password"
                                type="password"
                                :label="$i18n.t('user.new_password')"
                                rules="required"
                            />

                            <o-validated-field
                                v-model="password_check"
                                name="password_check"
                                type="password"
                                :label="$i18n.t('user.password_again')"
                                rules="required|confirmed:password"
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
                                <nuxt-link :to="{ path: '/user/login' }">
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
import * as yup from 'yup'
import { onMounted } from 'vue'
import { useForm } from 'vee-validate'
import useDirectus from '~/composables/directus'
import OValidatedField from '~/components/form/OValidatedField.vue'

const { $oruga, $i18n, $api } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const directus = useDirectus()

const password = ref('')
const password_check = ref('')
const success = ref(null)
const error = ref(null)
const isLoading = ref(false)
const token = ref(null)

const validationSchema = yup.object({
    password: yup.string().required('validation.required'),
    password_check: yup
        .string()
        .test('passwords-match', 'validation.confirmed', function (val) {
            return this.parent.password === val
        })
})

const { errors: formErrors, validate } = useForm({ validationSchema })

const errorMessage = computed(() => {
    const errorMessage = $api.tools.parseErrorMessage(error.value)
    return errorMessage
})

onMounted(() => {
    // TODO - different handling of missing token
    if (!route.query.token) {
        router.push('/user/forgot-password')
    } else {
        token.value = route.query.token
    }
})

async function onSubmit() {
    await validate().then((result) => {
        if (!result.valid) {
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

        await directus.auth.password.reset(token.value, password.value)
        // await $axios.post('auth/password/reset', {
        //     token: token.value,
        //     password: password.value
        // })

        success.value = 'user.password_reset_success'
    } catch (e) {
        error.value = e
    } finally {
        isLoading.value = false
    }
}
</script>
