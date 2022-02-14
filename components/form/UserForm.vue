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
                    <div class="columns">
                        <div class="column">
                            <o-validated-field
                                v-model="formData.first_name"
                                name="first_name"
                                type="text"
                                :label="$t('user.first_name')"
                                :placeholder="$t('user.first_name')"
                                rules="required|alpha_num_dash_space"
                            />
                        </div>
                        <div class="column">
                            <o-validated-field
                                v-model="formData.last_name"
                                name="last_name"
                                type="text"
                                :label="$t('user.last_name')"
                                :placeholder="$t('user.first_name')"
                                rules="required|alpha_num_dash_space"
                            />
                        </div>
                    </div>
                    <o-validated-field
                        v-model="formData.email"
                        name="email"
                        type="email"
                        :label="$t('user.email')"
                        rules="required|email"
                        :disabled="true"
                    />
                    <o-validated-select
                        v-model="formData.location"
                        name="city"
                        :label="$t('user.location')"
                        :options="citiesOptions"
                        :expanded="true"
                        :placeholder="$t('dj.select_city')"
                    />

                    <o-validated-select
                        v-model="formData.language"
                        name="city"
                        :label="$t('user.preffered_language')"
                        rules="required"
                        :options="languagesOptions"
                        :expanded="true"
                    />
                    <o-validated-field
                        v-model="formData.password_check"
                        name="password_check"
                        type="password"
                        :label="$t('user.password_check')"
                        rules="required"
                    />
                    <div class="field is-grouped is-grouped-right">
                        <div class="control">
                            <o-button :disabled="isLoading" variant="dark" @click="onSubmit">
                                {{ $t('user.save_profile') }}
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
import { required, email } from 'vee-validate/dist/rules'
import { mapGetters } from 'vuex'
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

export default {
    components: {
        ValidationObserver,
        OValidatedField,
        OValidatedSelect
    },
    middleware: ['authorized'],
    props: {
        initialData: {
            type: Object,
            default: null
        },
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
                first_name: null,
                last_name: null,
                email: null,
                location: null,
                language: null,
                password_check: null
            },
            success: null,
            error: null,
            isLoading: false
        }
    },
    computed: {
        ...mapGetters({
            citiesOptions: 'form/citiesOptions'
        }),
        languagesOptions() {
            return this.$i18n.locales
                .map((locale) => ({ value: locale.iso, label: locale.name }))
                .sort((a, b) => a.value.localeCompare(b.value))
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
        },
        initialData(value) {
            this.formData = value
        }
    },
    mounted() {
        if (this.initialData) {
            this.formData = {
                ...this.initialData
            }
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

                this.onFormSubmit(this.formData, 'user.profile_update_success')
                this.formData.password_check = null
                this.$refs.observer.reset()
            })
        }
    }
}
</script>
