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
                            v-model="formData.name"
                            name="name"
                            type="text"
                            :label="$t('mix.name')"
                            :placeholder="$t('mix.name')"
                            rules="required|alpha_num_dash_space"
                        />
                        <b-validated-field
                            v-model="formData.url"
                            name="url"
                            type="url"
                            :label="$t('mix.url')"
                            :placeholder="$t('mix.url_placeholder')"
                            rules="required|audio_load_state:@audioLoadState"
                            :help="$t('mix.url_help')"
                        />
                        <b-validated-field
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
                                @audio-load-success="onAudioLoadSuccess"
                            />
                        </div>

                        <b-validated-tag-input
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
                    <div class="column">
                        <b-validated-field
                            v-model="formData.description"
                            name="description"
                            type="textarea"
                            :label="$t('mix.description')"
                            :placeholder="$t('mix.description_placeholder')"
                        />
                    </div>
                </div>
                <div class="field is-grouped is-grouped-right">
                    <div class="control">
                        <b-button type="is-light" @click="onCancel">
                            {{ $t('form.cancel') }}
                        </b-button>
                    </div>
                    <div class="control">
                        <b-button :loading="isLoading" type="is-dark" @click="onSubmit">
                            {{ initialData ? $t('mix.save_mix') : $t('mix.add_mix') }}
                        </b-button>
                    </div>
                </div>
            </form>
        </ValidationObserver>
    </div>
</template>

<script>
import _ from 'lodash'
import { extend, ValidationObserver } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'
import Player from '~/components/audio/Player.vue'
import BValidatedField from '~/components/form/BValidatedField.vue'
import BValidatedTagInput from '~/components/form/BValidatedTagInput.vue'
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
    message: 'mix.audio_load_error'
})

export default {
    components: {
        ValidationObserver,
        BValidatedField,
        BValidatedTagInput,
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
                dj: this.$strapi.user.dj.id
            },
            availableGenres: null,
            success: null,
            error: null,
            isLoading: false,
            audioUrl: null,
            audioLoadState: null
        }
    },
    computed: {
        formDataUrl() {
            return this.formData.url
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
                    this.$buefy.toast.open({
                        message: this.$t('validation.form_validation_error'),
                        type: 'is-danger'
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
        onAudioLoadSuccess() {
            this.audioLoadState = 'success'
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
