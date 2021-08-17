<template>
    <div>
        <b-notification v-if="success" type="is-success" :closable="false">
            {{ $t(success) }}
        </b-notification>

        <b-notification v-if="error" type="is-danger" :closable="false">
            {{ $t(error) }}
        </b-notification>

        <ValidationObserver ref="observer" slim>
            <form v-if="!success" method="post" @submit.prevent>
                <div class="columns is-desktop">
                    <div class="column">
                        <b-validated-field
                            v-model="name"
                            name="name"
                            type="text"
                            :label="$t('dj.name')"
                            :placeholder="$t('dj.dj_name_placeholder')"
                            rules="required|no_dj_prefix|alpha_num_dash_space"
                        />
                        <b-validated-field
                            v-model="slug"
                            name="slug"
                            :disabled="true"
                            type="text"
                            :label="$t('dj.slug')"
                            rules="required"
                        />
                        <b-validated-field
                            v-model="email"
                            name="email"
                            type="email"
                            :label="$t('dj.email')"
                            rules="email"
                        />
                        <b-validated-select
                            v-model="city"
                            name="city"
                            :label="$t('dj.city')"
                            rules="required"
                            :options="citiesOptions"
                            :expanded="true"
                            :placeholder="$t('dj.select_city')"
                        />
                        <b-validated-tag-input
                            v-model="genres"
                            name="genres"
                            :label="$t('dj.genres')"
                            rules="required"
                            :tags="availableGenres"
                            field="name"
                            maxtags="3"
                            :placeholder="$t('dj.select_3_genres')"
                        />
                    </div>
                    <div class="column">
                        <b-validated-image-upload
                            v-model="photo"
                            name="photo"
                            :label="$t('dj.photo')"
                            rules="image_type"
                            :on-remove-photo="onRemovePhoto"
                        />
                    </div>
                </div>

                <b-validated-field v-model="bio" name="bio" type="textarea" :label="$t('dj.bio')" />

                <div class="field">
                    <div class="control">
                        <b-button
                            :loading="isLoading"
                            type="is-dark is-fullwidth"
                            @click="onSubmit"
                        >
                            {{ $t('dj.do_create_profile') }}
                        </b-button>
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
import BValidatedField from '~/components/form/BValidatedField.vue'
import BValidatedSelect from '~/components/form/BValidatedSelect.vue'
import BValidatedImageUpload from '~/components/form/BValidatedImageUpload.vue'
import BValidatedTagInput from '~/components/form/BValidatedTagInput.vue'
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
    console.log(file)
    if (file === null || ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        return true
    }

    return 'validation.image_type'
})

export default {
    components: {
        ValidationObserver,
        BValidatedField,
        BValidatedSelect,
        BValidatedImageUpload,
        BValidatedTagInput
    },
    middleware: ['authorized'],
    plugins: ['vee-validate'],
    props: {
        initialData: {
            type: Object,
            default: null
        },
        errorIn: {
            type: String,
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
            name: null,
            slug: null,
            email: null,
            bio: null,
            photo: null,
            city: null,
            availableGenres: null,
            genres: null,
            success: null,
            error: null,
            isLoading: false
        }
    },
    computed: {
        ...mapGetters({
            citiesOptions: 'form/getCitiesOptions'
        })
    },
    watch: {
        name(value) {
            this.slug = this.createSlug(value)
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
                    this.$buefy.toast.open({
                        message: this.$t('validation.form_validation_error'),
                        type: 'is-danger'
                    })
                    return
                }

                const formData = new FormData()
                if (this.photo) {
                    formData.append('files.photo', this.photo, this.photo.name)
                }
                formData.append(
                    'data',
                    JSON.stringify({
                        name: this.name,
                        slug: this.slug,
                        email: this.email,
                        bio: this.bio,
                        city: this.city,
                        genres: this.genres.map((genre) => parseInt(genre.id))
                    })
                )

                this.onFormSubmit(formData)
            })
        },
        onRemovePhoto() {
            this.photo = null
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
