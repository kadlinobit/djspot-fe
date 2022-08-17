<template>
    <div class="form-login page-register">
        <o-notification v-if="success" variant="success" :closable="false">
            {{ $i18n.t(success) }}
        </o-notification>

        <o-notification v-if="error" variant="danger" :closable="false">
            {{ $i18n.t(error) }}
        </o-notification>

        <ValidationObserver ref="observer" slim>
            <form v-if="!success" method="post" @submit.prevent>
                <o-validated-field
                    v-model="username"
                    name="username"
                    type="text"
                    :label="$i18n.t('user.username')"
                    rules="required"
                />

                <o-validated-field
                    v-model="email"
                    name="email"
                    type="email"
                    :label="$i18n.t('user.email')"
                    rules="required|email"
                />

                <o-validated-field
                    v-model="password1"
                    vid="password1"
                    name="password1"
                    type="password"
                    :label="$i18n.t('user.password')"
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
                            {{ $i18n.t('user.do_register') }}
                        </o-button>
                    </div>
                </div>
            </form>
        </ValidationObserver>

        <div class="has-text-centered" style="margin-top: 20px">
            {{ $i18n.t('user.already_got_an_account') }}
            <nuxt-link v-if="displayType === 'page'" to="/login">
                {{ $i18n.t('user.do_login') }}
            </nuxt-link>
            <a
                v-if="displayType === 'modal'"
                @click="() => mainStore.setLoginActiveComponent('login')"
            >
                {{ $i18n.t('user.do_login') }}
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { extend, ValidationObserver } from 'vee-validate'
import {
    required as requiredRule,
    email as emailRule,
    confirmed as confirmedRule
} from 'vee-validate/dist/rules'
import OValidatedField from '~/components/form/OValidatedField.vue'
import { useMainStore } from '~/stores'
const mainStore = useMainStore()

const { $i18n, $oruga, $axios } = useNuxtApp()

extend('email', emailRule)
extend('required', requiredRule)
extend('confirmed', confirmedRule)

interface Props {
    displayType?: string
}

const props = withDefaults(defineProps<Props>(), {
    displayType: 'page'
})

const username = ref('')
const email = ref('')
const password1 = ref('')
const password2 = ref('')
const success = ref(null)
const error = ref(null)
const isLoading = ref(false)
const observer = ref(null)

function onSubmit() {
    error.value = null
    observer.value.validate().then((success) => {
        if (!success) {
            $oruga.notification.open({
                message: $i18n.t('validation.form_validation_error'),
                variant: 'danger'
            })
            return
        }
        register()
    })
}
async function register() {
    try {
        isLoading.value = true

        $axios.setToken(false)
        await $axios.post('auth/local/register', {
            username,
            email,
            password: password1
        })

        // await $strapi.register({
        //     email: email,
        //     username: username,
        //     password: password1
        // })

        success.value = 'user.register_success_message'
    } catch (e) {
        if (e.response && e.response.data) {
            error.value = e.response.data.message[0].messages[0].message
        } else {
            error.value = e
        }
    } finally {
        isLoading.value = false
    }
}
</script>
