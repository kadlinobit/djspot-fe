<template>
    <section class="section">
        <o-loading :active.sync="isLoading" />
        <o-notification v-if="success" variant="success">
            {{ $t(success) }}
        </o-notification>

        <o-notification v-if="error" type="danger">
            {{ $t(error) }}
        </o-notification>

        <ValidationObserver ref="observer" slim>
            <form v-if="!success" method="post" @submit.prevent>
                <div class="columns is-tablet">
                    <div class="column is-half-tablet is-three-fifths-desktop">
                        <o-validated-select
                            v-model="formData.type"
                            name="type"
                            :label="$t('sound.type')"
                            rules="required"
                            :options="soundTypeOptions"
                            :expanded="true"
                            :placeholder="$t('sound.select_sound_type')"
                        />
                        <o-validated-field
                            v-model="formData.name"
                            name="name"
                            type="text"
                            :label="$t(`${formData.type}.name`)"
                            :placeholder="$t(`${formData.type}.name`)"
                            rules="required|alpha_num_dash_space"
                        />
                        <o-validated-field
                            v-model="formData.url"
                            name="url"
                            type="url"
                            :label="$t('sound.url')"
                            :placeholder="$t('sound.url_placeholder')"
                            rules="required|audio_load_state:@audioLoadState"
                            :help="$t('sound.url_help')"
                        />
                        <o-validated-field
                            v-model="audioLoadState"
                            vid="audioLoadState"
                            name="audioLoadState"
                            :hidden="true"
                        />
                        <div class="field">
                            <Player
                                v-if="audioUrl"
                                :file="audioUrl"
                                @audio-load-error="onAudioLoadError"
                                @audio-load-success="(data) => onAudioLoadSuccess(data)"
                            />
                        </div>

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
                    v-model="formData.description"
                    name="description"
                    :label="$t(`${formData.type}.description`)"
                    :placeholder="$t(`${formData.type}.description_placeholder`)"
                />

                <div class="field is-grouped is-grouped-right">
                    <div class="control">
                        <o-button variant="light" @click="onCancel">
                            {{ $t('form.cancel') }}
                        </o-button>
                    </div>
                    <div class="control">
                        <o-button :disabled="isLoading" variant="dark" @click="onSubmit">
                            {{
                                initialData
                                    ? $t(`${formData.type}.save`)
                                    : $t(`${formData.type}.add`)
                            }}
                        </o-button>
                    </div>
                </div>
            </form>
        </ValidationObserver>
    </section>
</template>

<script>
import _ from 'lodash'
import { extend, ValidationObserver } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'
import Player from '~/components/audio/Player.vue'
import OValidatedField from '~/components/form/OValidatedField.vue'
import OValidatedTagInput from '~/components/form/OValidatedTagInput.vue'
import OValidatedSelect from '~/components/form/OValidatedSelect.vue'
import OValidatedImageCropUpload from '~/components/form/OValidatedImageCropUpload.vue'
import OValidatedBmEditor from '~/components/form/OValidatedBmEditor.vue'
import { getGenreTags } from '~/api/graphql/genre'

extend('required', required)

extend('alpha_num_dash_space', (value) => {
    if (value.match(/^[a-z\d\-\sáčďéěíňóřšťúůýž]+$/gi)) {
        return true
    }
    return 'validation.alpha_num_dash_space'
})

extend('audio_load_state', {
    params: ['audioLoadState'],
    validate(value, { audioLoadState }) {
        return audioLoadState !== 'error'
    },
    message: 'player.error_loading_file_message'
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
        OValidatedTagInput,
        OValidatedSelect,
        OValidatedImageCropUpload,
        OValidatedBmEditor,
        Player
    },
    middleware: ['authorized'],
    plugins: ['vee-validate', 'audio'],
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
                name: null,
                url: null,
                description: null,
                genres: null,
                dj: this.$strapi.user.dj.id,
                type: 'mix',
                duration: null,
                photo: null
            },
            availableGenres: null,
            success: null,
            error: null,
            isLoading: false,
            audioUrl: null,
            audioLoadState: null,
            currentPhoto: null
        }
    },
    computed: {
        formDataUrl() {
            return this.formData.url
        },
        soundTypeOptions() {
            return [
                { value: 'mix', label: this.$t('mix.mix') },
                { value: 'track', label: this.$t('track.track') }
            ]
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
        formDataUrl() {
            this.debouncedGetAudioUrl()
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
    created() {
        this.debouncedGetAudioUrl = _.debounce(this.getAudioUrl, 500)
    },
    methods: {
        onSubmit() {
            this.error = null
            this.$refs.observer.validate().then((success) => {
                if (!success) {
                    this.$oruga.notification.open({
                        message: this.$t('validation.form_validation_error'),
                        rootClass: 'toast',
                        variant: 'danger',
                        duration: 500000
                    })
                    return
                }

                this.onFormSubmit(this.formData)
            })
        },
        onCancel() {
            this.$router.back()
        },
        onAudioLoadError() {
            this.audioLoadState = 'error'
        },
        onAudioLoadSuccess(data) {
            this.audioLoadState = 'success'
            if (data && data.duration) this.formData.duration = data.duration
        },
        async getAudioUrl() {
            const audioUrls = await this.$audio.getAudioUrls(this.formDataUrl)

            if (audioUrls && audioUrls.stream) {
                this.audioUrl = audioUrls.stream
            } else {
                this.audioUrl = 'http://nonexistent/'
            }
        }
    }
}
</script>
