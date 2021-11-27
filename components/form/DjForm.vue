<template>
    <div>
        <o-notification v-if="success" type="success" :closable="false">
            {{ $t(success) }}
        </o-notification>

        <o-notification v-if="error" type="danger" :closable="false">
            {{ $t(error) }}
        </o-notification>

        <ValidationObserver ref="observer" slim>
            <form v-if="!success" method="post" @submit.prevent>
                <div class="columns is-tablet">
                    <div class="column is-half-tablet is-three-fifths-desktop">
                        <o-validated-field
                            v-model="formData.name"
                            name="name"
                            type="text"
                            :label="$t('dj.name')"
                            :placeholder="$t('dj.dj_name_placeholder')"
                            rules="required|no_dj_prefix|alpha_num_dash_space"
                        />
                        <o-validated-field
                            v-model="formData.slug"
                            name="slug"
                            :disabled="true"
                            type="text"
                            :label="$t('dj.slug')"
                            rules="required"
                        />
                        <o-validated-field
                            v-model="formData.email"
                            name="email"
                            type="email"
                            :label="$t('dj.email')"
                            rules="email"
                        />
                        <o-validated-select
                            v-model="formData.city"
                            name="city"
                            :label="$t('dj.city')"
                            rules="required"
                            :options="citiesOptions"
                            :expanded="true"
                            :placeholder="$t('dj.select_city')"
                        />
                        <o-validated-tag-input
                            v-model="formData.genres"
                            name="genres"
                            :label="$t('dj.genres')"
                            rules="required"
                            :tags="availableGenres"
                            field="name"
                            maxtags="3"
                            :placeholder="$t('dj.select_3_genres')"
                        />
                    </div>
                    <div class="column is-half-tablet is-two-fifths-desktop">
                        <o-validated-image-crop-upload
                            v-model="formData.photo"
                            name="photo"
                            :label="$t('dj.photo')"
                            rules="image_type"
                            :current-image="initialData ? initialData.photo : null"
                        />
                    </div>
                </div>

                <o-validated-bm-editor
                    v-model="formData.bio"
                    name="bio"
                    type="textarea"
                    rules="required"
                    :label="$t('dj.bio')"
                />

                <div class="field is-grouped is-grouped-right">
                    <div class="control">
                        <o-button variant="light" @click="onCancel">
                            {{ $t('form.cancel') }}
                        </o-button>
                        <o-button :disabled="isLoading" variant="dark" @click="onSubmit">
                            {{ initialData ? $t('dj.save_profile') : $t('dj.do_create_profile') }}
                        </o-button>
                    </div>
                </div>
            </form>
        </ValidationObserver>
    </div>
</template>

<script>
import { extend, ValidationObserver } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import { mapGetters } from 'vuex'
import OValidatedField from '~/components/form/OValidatedField.vue'
import OValidatedSelect from '~/components/form/OValidatedSelect.vue'
import OValidatedImageCropUpload from '~/components/form/OValidatedImageCropUpload.vue'
import OValidatedTagInput from '~/components/form/OValidatedTagInput.vue'
import OValidatedBmEditor from '~/components/form/OValidatedBmEditor.vue'
import { getGenreTags } from '~/api/graphql/genre'

extend('email', email)
extend('required', required)

extend('alpha_num_dash_space', (value) => {
    if (value.match(/^[a-z\d\-\sáčďéěíňóřšťúůýž]+$/gi)) {
        return true
    }
    return 'validation.alpha_num_dash_space'
})

extend('no_dj_prefix', (value) => {
    if (value.match(/^(?!(dj |dj_|dj-).*$).*/gi)) {
        return true
    }
    return 'validation.no_dj_prefix'
})

extend('image_type', (file) => {
    if (file === null || ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        return true
    }

    return 'validation.image_type'
})

export default {
    components: {
        ValidationObserver,
        OValidatedField,
        OValidatedSelect,
        OValidatedImageCropUpload,
        OValidatedTagInput,
        OValidatedBmEditor
    },
    middleware: ['authorized'],
    plugins: ['vee-validate'],
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
        },
        mode: {
            type: String,
            default: 'new'
        }
    },
    data() {
        return {
            formData: {
                name: null,
                slug: null,
                email: null,
                bio: null,
                photo: null,
                city: null,
                genres: null
            },
            availableGenres: null,
            currentPhoto: null,
            success: null,
            error: null,
            isLoading: false
        }
    },
    computed: {
        ...mapGetters({
            citiesOptions: 'form/getCitiesOptions'
        }),
        djName() {
            return this.formData.name
        }
    },
    watch: {
        djName(value) {
            this.formData.slug = this.createSlug(value)
        },
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
    async mounted() {
        if (this.initialData) {
            this.formData = {
                ...this.initialData
            }
        }
        // Check if initial data contains photo - if so, set form to keep existing photo
        if (
            this.initialData &&
            this.initialData.photo &&
            this.initialData.photo.id &&
            this.initialData.photo.url
        ) {
            this.formData.photo = 'keep-current'
            this.currentPhoto = this.initialData.photo
        }

        const genreTagsAll = await this.$strapi.graphql({
            query: getGenreTags()
        })

        this.availableGenres = genreTagsAll.genres
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

                this.onFormSubmit(this.formData)
            })
        },
        onCancel() {
            this.$router.back()
        },
        createSlug(value) {
            return value
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036F]/g, '')
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
        }
    }
}
</script>
