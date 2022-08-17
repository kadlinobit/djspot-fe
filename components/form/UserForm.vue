<template>
    <client-only>
        <div class="form user-form">
            <o-notification v-if="success" variant="success" :closable="false">
                {{ $i18n.t(success) }}
            </o-notification>

            <o-notification v-if="error" variant="danger" :closable="false">
                {{ $i18n.t(error) }}
            </o-notification>

            <ValidationObserver ref="observer" slim>
                <form v-if="!success" method="post" @submit.prevent>
                    <div class="columns">
                        <div class="column">
                            <o-validated-field
                                v-model="formData.first_name"
                                name="first_name"
                                type="text"
                                :label="$i18n.t('user.first_name')"
                                :placeholder="$i18n.t('user.first_name')"
                                rules="required|alpha_num_dash_space"
                            />
                        </div>
                        <div class="column">
                            <o-validated-field
                                v-model="formData.last_name"
                                name="last_name"
                                type="text"
                                :label="$i18n.t('user.last_name')"
                                :placeholder="$i18n.t('user.first_name')"
                                rules="required|alpha_num_dash_space"
                            />
                        </div>
                    </div>
                    <o-validated-field
                        v-model="formData.email"
                        name="email"
                        type="email"
                        :label="$i18n.t('user.email')"
                        rules="required|email"
                        :disabled="true"
                    />
                    <o-validated-select
                        v-model="formData.location"
                        name="city"
                        :label="$i18n.t('user.location')"
                        :options="formStore.citiesOptions"
                        :expanded="true"
                        :placeholder="$i18n.t('dj.select_city')"
                    />

                    <o-validated-select
                        v-model="formData.language"
                        name="city"
                        :label="$i18n.t('user.preffered_language')"
                        rules="required"
                        :options="languagesOptions"
                        :expanded="true"
                    />
                    <o-validated-field
                        v-model="formData.password_check"
                        name="password_check"
                        type="password"
                        :label="$i18n.t('user.password_check')"
                        rules="required"
                    />
                    <div class="field is-grouped is-grouped-right">
                        <div class="control">
                            <o-button
                                :disabled="isLoading"
                                variant="dark"
                                @click="onSubmit"
                            >
                                {{ $i18n.t('user.save_profile') }}
                            </o-button>
                        </div>
                    </div>
                </form>
            </ValidationObserver>
        </div>
    </client-only>
</template>

<script setup lang="ts">
// TODO - password check na backendu nefunguje při updateu uživatele
import { extend, ValidationObserver } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import { useFormStore } from '~/stores'
import OValidatedField from '~/components/form/OValidatedField.vue'
import OValidatedSelect from '~/components/form/OValidatedSelect.vue'

extend('email', email)
extend('required', required)

extend('alpha_num_dash_space', (value) => {
    if (value.match(/^[a-z\d\-\sáčďéěíňóřšťúůýž]+$/gi)) {
        return true
    }
    return 'validation.alpha_num_dash_space'
})

const { $i18n, $oruga } = useNuxtApp()

const formStore = useFormStore()

// TODO - find out why definePageMeta is not working
// definePageMeta({
//     middleware: 'authorized'
// })

interface InitialData {
    name?: string
    slug?: string
    email?: string
    bio?: string
    photo?: string
    city?: string
    genres?: Array<string>
}

interface Props {
    initialData?: InitialData
    errorIn?: [Error, string]
    successIn?: string
    isLoadingIn?: boolean
    onFormSubmit: Function
}

const props = withDefaults(defineProps<Props>(), {
    initialData: null,
    errorIn: null,
    successIn: null,
    loadingIn: false
})

const formData = ref({
    first_name: null,
    last_name: null,
    email: null,
    location: null,
    language: null,
    password_check: null
})

const success = ref(null)
const error = ref(null)
const isLoading = ref(false)
const observer = ref(null)

const languagesOptions = computed(() => {
    return $i18n.locales
        .map((locale) => ({ value: locale.iso, label: locale.name }))
        .sort((a, b) => a.value.localeCompare(b.value))
})

watch(
    () => props.errorIn,
    (val) => (error.value = val)
)

watch(
    () => props.successIn,
    (val) => (success.value = val)
)

watch(
    () => props.isLoadingIn,
    (val) => (isLoading.value = val)
)

onMounted(() => {
    if (props.initialData) {
        formData.value = {
            ...props.initialData
        }
    }
})

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

        props.onFormSubmit(formData, 'user.profile_update_success')
        formData.value.password_check = null
        observer.value.reset()
    })
}
</script>
