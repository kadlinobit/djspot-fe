<template>
    <div class="form-login page-login">
        <o-notification v-if="success" variant="success" :closable="false">
            {{ $t(success) }}
        </o-notification>

        <o-notification v-if="error" variant="danger" :closable="false">
            {{ $t(error) }}
        </o-notification>

        <ValidationObserver ref="observer" slim>
            <form @submit.prevent>
                <o-validated-field
                    v-model="email"
                    name="email"
                    type="email"
                    :label="$t('user.email')"
                    rules="required|email"
                />
                <o-validated-field
                    v-model="password"
                    name="password"
                    type="password"
                    :label="$t('user.password')"
                    rules="required"
                />
                <div class="field">
                    <div class="control">
                        <o-button
                            :disabled="isLoading"
                            variant="dark is-fullwidth"
                            @click="onSubmit"
                        >
                            {{ $t('user.do_login') }}
                        </o-button>
                    </div>
                </div>
            </form>
        </ValidationObserver>
        <div class="has-text-centered" style="margin-top: 20px">
            <p>
                {{ $t('user.dont_have_an_account') }}
                <nuxt-link v-if="displayType === 'page'" to="/register">
                    {{ $t('user.do_register') }}
                </nuxt-link>
                <a
                    v-if="displayType === 'modal'"
                    @click="() => setLoginActiveComponent('register')"
                >
                    {{ $t('user.do_register') }}
                </a>
            </p>
            <p>
                <nuxt-link v-if="displayType === 'page'" to="/forgot-password">
                    {{ $t('user.forgot_password') }}?
                </nuxt-link>
                <a
                    v-if="displayType === 'modal'"
                    @click="() => setLoginActiveComponent('forgot-password')"
                >
                    {{ $t('user.forgot_password') }}?
                </a>
            </p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { extend, ValidationObserver } from 'vee-validate'
import { required as ruleRequired, email as ruleEmail } from 'vee-validate/dist/rules'
import { mapActions } from 'vuex'
import OValidatedField from '~/components/form/OValidatedField.vue'

extend('email', ruleEmail)
extend('required', ruleRequired)

const { $auth, $oruga } = useNuxtApp()
const { login } = useDirectusAuth()

interface Props {
    displayType?: string
    afterSuccessCallback?: Function
}

const props = withDefaults(defineProps<Props>(), {
    displayType: 'page',
    afterSuccessCallback: () => {}
})

const emit = defineEmits(['loginSuccess'])

const observer = ref(null)
const email = ref('')
const password = ref('')
const error = ref(null)
const success = ref(null)
const isLoading = ref(false)

const { setIsLoginOpen, setLoginActiveComponent } = mapActions([
    'setIsLoginOpen',
    'setLoginActiveComponent'
])

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
                message: this.$t('validation.form_validation_error'),
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

        await $auth.loginWith('local', {
            data: {
                email: email.value,
                password: password.value
            }
        })

        // await login({
        //     email: email.value,
        //     password: password.value
        // })

        props.afterSuccessCallback()
    } catch (e) {
        error.value =
            e.response?.data?.errors[0]?.message || 'Something went wrong and there is no data'
    } finally {
        isLoading.value = false
    }
}
</script>
