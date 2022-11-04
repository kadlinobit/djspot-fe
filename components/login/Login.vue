<template>
    <div class="form-login page-login">
        <o-notification v-if="success" variant="success" :closable="false">
            {{ $i18n.t(success) }}
        </o-notification>

        <o-notification v-if="errorMessage" variant="danger" :closable="false">
            {{ $i18n.t(errorMessage) }}
        </o-notification>

        <form @submit.prevent>
            <o-validated-field
                v-model="email"
                name="email"
                type="email"
                :label="$i18n.t('user.email')"
            />
            <o-validated-field
                v-model="password"
                name="password"
                type="password"
                :label="$i18n.t('user.password')"
            />
            <div class="field">
                <div class="control">
                    <o-button
                        :disabled="isLoading"
                        variant="dark is-fullwidth"
                        @click="onSubmit"
                    >
                        {{ $i18n.t('user.do_login') }}
                    </o-button>
                </div>
            </div>
        </form>

        <div class="has-text-centered" style="margin-top: 20px">
            <p>
                {{ $i18n.t('user.dont_have_an_account') }}
                <nuxt-link v-if="displayType === 'page'" to="/register">
                    {{ $i18n.t('user.do_register') }}
                </nuxt-link>
                <a
                    v-if="displayType === 'modal'"
                    @click="() => (mainStore.loginActiveComponent = 'register')"
                >
                    {{ $i18n.t('user.do_register') }}
                </a>
            </p>
            <p>
                <nuxt-link v-if="displayType === 'page'" to="/forgot-password">
                    {{ $i18n.t('user.forgot_password') }}?
                </nuxt-link>
                <a
                    v-if="displayType === 'modal'"
                    @click="
                        () =>
                            (mainStore.loginActiveComponent = 'forgot-password')
                    "
                >
                    {{ $i18n.t('user.forgot_password') }}?
                </a>
            </p>
        </div>
    </div>
</template>
<script setup lang="ts">
import * as yup from 'yup'
import { useMainStore } from '~/stores'
import { useAuth } from '~/composables/directus'
import { useProgrammatic } from '@oruga-ui/oruga'
import { useForm } from 'vee-validate'
import OValidatedField from '~/components/form/OValidatedField.vue'

const { $i18n, $api } = useNuxtApp()
const { oruga: $oruga } = useProgrammatic()
const mainStore = useMainStore()
const auth = useAuth()
const emit = defineEmits(['loginSuccess'])

interface Props {
    displayType?: string
}

const props = withDefaults(defineProps<Props>(), {
    displayType: 'page'
})

const email = ref('')
const password = ref('')
const error = ref(null)
const success = ref(null)
const isLoading = ref(false)

const validationSchema = yup.object({
    email: yup
        .string()
        .required('validation.required')
        .email('validation.email'),
    password: yup.string().required('validation.required')
})

const { errors: formErrors, validate } = useForm({ validationSchema })

onMounted(() => {
    error.value = null
    success.value = null
    isLoading.value = false
})

async function onSubmit() {
    error.value = null
    success.value = null
    await validate().then((result) => {
        if (!result.valid) {
            $oruga.notification.open({
                message: $i18n.t('validation.form_validation_error'),
                variant: 'danger'
            })
            return
        }
        onLogin()
    })
}
async function onLogin() {
    try {
        isLoading.value = true

        // directus SDK method
        await auth.login({
            email: email.value,
            password: password.value
        })

        // *** nuxt-auth method ***
        // await $auth.loginWith('local', {
        //     data: {
        //         email: email.value,
        //         password: password.value
        //     }
        // })

        // *** nuxt-directus method ***
        // await login({
        //     email: email.value,
        //     password: password.value
        // })
        emit('loginSuccess')
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
