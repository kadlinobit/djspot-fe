<template>
    <div class="form-login page-register">
        <o-notification v-if="success" variant="success" :closable="false">
            {{ $i18n.t(success) }}
        </o-notification>

        <o-notification v-if="errorMessage" variant="danger" :closable="false">
            {{ $i18n.t(errorMessage) }}
        </o-notification>

        <form v-if="!success" method="post" @submit.prevent>
            <o-validated-field
                v-model="formData.first_name"
                name="first_name"
                type="text"
                :label="$i18n.t('user.first_name')"
            />

            <o-validated-field
                v-model="formData.last_name"
                name="last_name"
                type="text"
                :label="$i18n.t('user.last_name')"
            />

            <o-validated-field
                v-model="formData.email"
                name="email"
                type="email"
                :label="$i18n.t('user.email')"
            />

            <o-validated-field
                v-model="formData.password"
                name="password"
                type="password"
                :label="$i18n.t('user.password')"
            />

            <o-validated-field
                v-model="password_check"
                name="password_check"
                type="password"
                :label="$i18n.t('user.password_again')"
            />
            <div class="field">
                <div class="control">
                    <o-button
                        :disabled="isLoading"
                        variant="primary is-fullwidth"
                        @click="onSubmit"
                    >
                        {{ $i18n.t('user.do_register') }}
                    </o-button>
                </div>
            </div>
        </form>

        <div class="has-text-centered" style="margin-top: 20px">
            {{ $i18n.t('user.already_got_an_account') }}
            <nuxt-link v-if="displayType === 'page'" to="/user/login">
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
import { registerUser } from '@directus/sdk';
import * as yup from 'yup';
import OValidatedField from '~/components/form/OValidatedField.vue';
import { useMainStore } from '~/stores';
import { useOruga } from '@oruga-ui/oruga';
import { useForm } from 'vee-validate';

const { $i18n, $axios, $api, $directus } = useNuxtApp();
const mainStore = useMainStore();
const $oruga = useOruga();

interface Props {
    displayType?: string;
}

const props = withDefaults(defineProps<Props>(), {
    displayType: 'page'
});
const formData = ref({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
});

const password_check = ref('');
const success = ref<string | null>(null);
const error = ref<any>(null);
const isLoading = ref(false);

const languagesOptions = computed(() => {
    return ($i18n.locales.value as any[])
        .map((locale) => ({ value: locale.iso as string, label: locale.name as string }))
        .sort((a, b) => a.value.localeCompare(b.value));
});

const validationSchema = yup.object({
    first_name: yup
        .string()
        .required('validation.required')
        .matches($api.tools.regEx.userName, 'validation.alpha_num_dash_space'),
    last_name: yup
        .string()
        .required('validation.required')
        .matches($api.tools.regEx.userName, 'validation.alpha_num_dash_space'),
    email: yup
        .string()
        .required('validation.required')
        .email('validation.email'),
    password: yup.string().required('validation.required'),
    password_check: yup
        .string()
        .test('passwords-match', 'validation.confirmed', function (val) {
            return this.parent.password === val;
        })
});

const { errors: formErrors, validate } = useForm({ validationSchema });

async function onSubmit() {
    error.value = null;
    await validate().then((result) => {
        if (!result.valid) {
            $oruga.notification.open({
                message: $i18n.t('validation.form_validation_error'),
                variant: 'danger'
            });
            return;
        }
        register();
    });
}
async function register() {
    try {
        isLoading.value = true;
        await $directus.request(
            registerUser(formData.value.email, formData.value.password, {
                first_name: formData.value.first_name,
                last_name: formData.value.last_name,
                verification_url: 'http://localhost:3000/user/account-activation'
            } as any)
        );
        success.value = 'user.register_success_message';
    } catch (e) {
        error.value = e;
    } finally {
        isLoading.value = false;
    }
}

const errorMessage = computed(() => {
    const errorMessage = $api.tools.parseErrorMessage(error.value);
    return errorMessage;
});
</script>
