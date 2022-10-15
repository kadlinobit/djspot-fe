<template>
    <client-only>
        <div class="form user-form">
            <o-notification v-if="success" variant="success" :closable="false">
                {{ $i18n.t(success) }}
            </o-notification>

            <o-notification v-if="error" variant="danger" :closable="false">
                {{ $i18n.t(error) }}
            </o-notification>

            <form v-if="!success" method="post" @submit.prevent>
                <o-validated-field
                    v-model="formData.password"
                    vid="password"
                    name="password"
                    type="password"
                    :label="$i18n.t('user.new_password')"
                    rules="required"
                />

                <o-validated-field
                    v-model="passwordAgain"
                    name="passwordAgain"
                    type="password"
                    :label="$i18n.t('user.new_password_again')"
                    rules="required|confirmed:password"
                />
                <o-validated-field
                    v-model="formData.password_check"
                    name="password_check"
                    type="password"
                    :label="$i18n.t('user.current_password_check')"
                    rules="required"
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
    </client-only>
</template>

<script setup lang="ts">
// import { extend, ValidationObserver } from 'vee-validate'
// import {
//     required as ruleRequired,
//     confirmed as ruleConfirmed
// } from 'vee-validate/dist/rules'
import OValidatedField from '~/components/form/OValidatedField.vue'

// extend('required', ruleRequired)
// extend('confirmed', ruleConfirmed)

const { $i18n, $oruga } = useNuxtApp()

// TODO - find out why definePageMeta is not working
// definePageMeta({
//     middleware: 'authorized'
// })

type FormSubmitData = {
    formData: Object
    successMessage?: string
}

const emit = defineEmits<{
    (e: 'formSubmit', formSubmitData: FormSubmitData): void
}>()

interface Props {
    error?: Error | Object | string
    success?: string
    isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    error: null,
    success: null,
    isLoading: false
})

const formData = ref({
    password: null,
    password_check: null
})
const passwordAgain = ref(null)
const observer = ref(null)

function onSubmit() {
    observer.value.validate().then((success) => {
        if (!success) {
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
        observer.value.reset()
    })
}
</script>
