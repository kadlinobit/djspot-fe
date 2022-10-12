<template>
    <div class="form-login page-login">
        <o-notification v-if="success" variant="success" :closable="false">
            {{ $i18n.t(success) }}
        </o-notification>

        <o-notification v-if="error" variant="danger" :closable="false">
            {{ $i18n.t(error) }}
        </o-notification>

        <ValidationObserver ref="observer" slim>
            <form @submit.prevent>
                <o-validated-field
                    v-model="email"
                    name="email"
                    type="email"
                    :label="$i18n.t('user.email')"
                    rules="required|email"
                />
                <o-validated-field
                    v-model="password"
                    name="password"
                    type="password"
                    :label="$i18n.t('user.password')"
                    rules="required"
                />
                <div class="field">
                    <div class="control">
                        <o-button
                            :disabled="isLoading"
                            variant="dark is-fullwidth"
                            @click="() => onSubmit()"
                        >
                            {{ $i18n.t('user.do_login') }}
                        </o-button>
                    </div>
                </div>
            </form>
        </ValidationObserver>
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
import { extend, ValidationObserver } from 'vee-validate'
import {
    required as ruleRequired,
    email as ruleEmail
} from 'vee-validate/dist/rules'
import OValidatedField from '~/components/form/OValidatedField.vue'
import { useMainStore } from '~/stores'
import { useAuth } from '~/composables/directus'

extend('email', ruleEmail)
extend('required', ruleRequired)

const { $oruga, $i18n } = useNuxtApp()
const mainStore = useMainStore()

interface Props {
    displayType?: string
}

const props = withDefaults(defineProps<Props>(), {
    displayType: 'page'
})

const auth = useAuth()

const emit = defineEmits(['loginSuccess'])

const observer = ref(null)
const email = ref('')
const password = ref('')
const error = ref(null)
const success = ref(null)
const isLoading = ref(false)

onMounted(() => {
    error.value = null
    success.value = null
    isLoading.value = false
})

function onSubmit() {
    error.value = null
    success.value = null
    observer.value.validate().then((success) => {
        if (!success) {
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
        error.value =
            e.response?.data?.errors[0]?.message ||
            e.message ||
            'Something went wrong and there is no data'
    } finally {
        isLoading.value = false
    }
}
</script>
