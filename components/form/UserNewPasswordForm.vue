<template>
    <client-only>
        <div class="form user-form">
            <o-notification v-if="success" variant="success" :closable="false">
                {{ $t(success) }}
            </o-notification>

            <o-notification v-if="error" variant="danger" :closable="false">
                {{ $t(error) }}
            </o-notification>

            <ValidationObserver ref="observer" slim>
                <form v-if="!success" method="post" @submit.prevent>
                    <o-validated-field
                        v-model="formData.password"
                        vid="password"
                        name="password"
                        type="password"
                        :label="$t('user.new_password')"
                        rules="required"
                    />

                    <o-validated-field
                        v-model="password_again"
                        name="password_again"
                        type="password"
                        :label="$t('user.new_password_again')"
                        rules="required|confirmed:password"
                    />
                    <o-validated-field
                        v-model="formData.password_check"
                        name="password_check"
                        type="password"
                        :label="$t('user.current_password_check')"
                        rules="required"
                    />
                    <div class="field is-grouped is-grouped-right">
                        <div class="control">
                            <o-button :disabled="isLoading" variant="dark" @click="onSubmit">
                                {{ $t('user.do_change_password') }}
                            </o-button>
                        </div>
                    </div>
                </form>
            </ValidationObserver>
        </div>
    </client-only>
</template>

<script>
import { extend, ValidationObserver } from 'vee-validate'
import { required, confirmed } from 'vee-validate/dist/rules'
import OValidatedField from '~/components/form/OValidatedField.vue'

extend('required', required)
extend('confirmed', confirmed)

export default {
    components: {
        ValidationObserver,
        OValidatedField
    },
    middleware: ['authorized'],
    props: {
        errorIn: {
            type: [Error, String],
            default: null
        },
        successIn: {
            type: String,
            default: null
        },
        onFormSubmit: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            formData: {
                password: null,
                password_check: null
            },
            password_again: null,
            success: null,
            error: null,
            isLoading: false
        }
    },
    watch: {
        errorIn(value) {
            this.error = value
        },
        successIn(value) {
            this.success = value
        },
        isLoadingIn(value) {
            this.isLoading = value
        }
    },
    methods: {
        onSubmit() {
            this.error = null
            this.$refs.observer.validate().then((success) => {
                if (!success) {
                    this.$oruga.notification.open({
                        message: this.$t('validation.form_validation_error'),
                        variant: 'danger'
                    })
                    return
                }

                this.onFormSubmit(this.formData, 'user.password_change_success')
                this.formData.password_check = null
                this.$refs.observer.reset()
            })
        }
    }
}
</script>
