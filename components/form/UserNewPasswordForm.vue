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
            <o-validated-field
                v-model="formData.password"
                name="password"
                type="password"
                :label="$i18n.t('user.new_password')"
            />

            <o-validated-field
                v-model="passwordAgain"
                name="passwordAgain"
                type="password"
                :label="$i18n.t('user.new_password_again')"
            />
            <o-validated-field
                v-model="formData.password_check"
                name="password_check"
                type="password"
                :label="$i18n.t('user.current_password_check')"
            />
            <div class="field is-grouped is-grouped-right">
                <div class="control">
                    <o-button
                        :disabled="isLoading"
                        variant="dark"
                        @click="onSubmit"
                    >
                        {{ $i18n.t('user.do_change_password') }}
                    </o-button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import { useProgrammatic } from '@oruga-ui/oruga'
import { useForm } from 'vee-validate'
import OValidatedField from '~/components/form/OValidatedField.vue'

const { $i18n } = useNuxtApp()
const { oruga: $oruga } = useProgrammatic()

const emit = defineEmits<{
    (e: 'formSubmit', formSubmitData: FormSubmitData): void
}>()

interface Props {
    errorMessage?: string
    successMessage?: string
    isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    errorMessage: null,
    successMessage: null,
    isLoading: false
})

const formData = ref({
    password: null,
    password_check: null
})
const passwordAgain = ref(null)

const validationSchema = yup.object({
    password: yup.string().required('validation.required').nullable(),
    passwordAgain: yup
        .string()
        .required('validation.required')
        .test('passwords-match', 'validation.confirmed', function (val) {
            return this.parent.password === val
        })
        .nullable(),
    password_check: yup.string().required('validation.required').nullable()
})

const { errors: formErrors, validate } = useForm({ validationSchema })

function onSubmit() {
    validate().then((result) => {
        if (!result.valid) {
            $oruga.notification.open({
                message: $i18n.t('validation.form_validation_error'),
                variant: 'danger'
            })
            return
        }
        emit('formSubmit', {
            formData: { ...formData.value },
            successMessage: 'user.password_change_success'
        })
        formData.value.password_check = null
    })
}
</script>
