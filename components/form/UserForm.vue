<template>
    <div class="form user-form">
        <o-notification
            v-if="successMessage"
            variant="success"
            :closable="false"
        >
            {{ $i18n.t(successMessage) }}
        </o-notification>

        <o-notification v-if="errorMessage" variant="danger" :closable="false">
            {{ $i18n.t(errorMessage) }}
        </o-notification>

        <form v-if="!successMessage" method="post" @submit.prevent>
            <div class="columns">
                <div class="column">
                    <o-validated-field
                        v-model="formData.first_name"
                        name="first_name"
                        type="text"
                        :label="$i18n.t('user.first_name')"
                        :placeholder="$i18n.t('user.first_name')"
                    />
                </div>
                <div class="column">
                    <o-validated-field
                        v-model="formData.last_name"
                        name="last_name"
                        type="text"
                        :label="$i18n.t('user.last_name')"
                        :placeholder="$i18n.t('user.first_name')"
                    />
                </div>
            </div>
            <o-validated-field
                v-model="formData.email"
                name="email"
                type="email"
                :label="$i18n.t('user.email')"
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
                name="language"
                :label="$i18n.t('user.preffered_language')"
                :options="languagesOptions"
                :expanded="true"
            />
            <o-validated-field
                v-model="formData.password_check"
                name="password_check"
                type="password"
                :label="$i18n.t('user.password_check')"
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
    </div>
</template>

<script setup lang="ts">
// TODO - password check na backendu nefunguje při updateu uživatele
import * as yup from 'yup'
import { useProgrammatic } from '@oruga-ui/oruga'
import { useForm } from 'vee-validate'
import { useFormStore } from '~/stores'
import OValidatedField from '~/components/form/OValidatedField.vue'
import OValidatedSelect from '~/components/form/OValidatedSelect.vue'

const { $i18n } = useNuxtApp()
const { oruga: $oruga } = useProgrammatic()
const formStore = useFormStore()

const emit = defineEmits<{
    (e: 'formSubmit', formSubmitData: FormSubmitData): void
}>()

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
    errorMessage?: string
    successMessage?: string
    isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    initialData: null,
    errorMessage: null,
    successMessage: null,
    isLoading: false
})

const formData = ref({
    first_name: null,
    last_name: null,
    email: null,
    location: null,
    language: null,
    password_check: null
})

const nameRegEx = /^$|^[a-z\d\-\sáčďéěíňóřšťúůýž]+$/gi

const validationSchema = yup.object({
    first_name: yup
        .string()
        .required('validation.required')
        .matches(nameRegEx, 'validation.alpha_num_dash_space'),
    last_name: yup
        .string()
        .required('validation.required')
        .matches(nameRegEx, 'validation.alpha_num_dash_space'),
    email: yup
        .string()
        .required('validation.required')
        .email('validation.email'),
    password_check: yup.string().required('validation.required').nullable()
})

const {
    errors: formErrors,
    validate,
    resetForm
} = useForm({ validationSchema })

const languagesOptions = computed(() => {
    return $i18n.locales.value
        .map((locale) => ({ value: locale.iso, label: locale.name }))
        .sort((a, b) => a.value.localeCompare(b.value))
})

onMounted(() => {
    if (props.initialData) {
        formData.value = {
            ...props.initialData
        }
    }
})

watch(
    () => props.initialData,
    (val) => {
        if (val) {
            formData.value = {
                ...props.initialData
            }
        }
    }
)

async function onSubmit() {
    await validate().then((result) => {
        if (!result.valid) {
            $oruga.notification.open({
                message: $i18n.t('validation.form_validation_error'),
                variant: 'danger'
            })
            return
        }
        emit('formSubmit', {
            formData: { ...formData.value },
            successMessage: 'user.profile_update_success'
        })
        formData.value.password_check = null
        resetForm()
    })
}
</script>
