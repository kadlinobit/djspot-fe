<template>
    <client-only>
        <section class="section">
            <o-loading :active="isLoading" />
            <o-notification v-if="success" variant="success">
                {{ $i18n.t(success) }}
            </o-notification>

            <o-notification v-if="error" type="danger">
                {{ $i18n.t(error) }}
            </o-notification>

            <ValidationObserver ref="observer" slim>
                <form v-if="!success" method="post" @submit.prevent>
                    <div class="columns is-tablet">
                        <div
                            class="column is-half-tablet is-three-fifths-desktop"
                        >
                            <o-validated-select
                                v-model="formData.type"
                                name="type"
                                :label="$i18n.t('sound.type')"
                                rules="required"
                                :options="soundTypeOptions"
                                :expanded="true"
                                :placeholder="
                                    $i18n.t('sound.select_sound_type')
                                "
                            />
                            <o-validated-field
                                v-model="formData.name"
                                name="name"
                                type="text"
                                :label="$i18n.t(`${formData.type}.name`)"
                                :placeholder="$i18n.t(`${formData.type}.name`)"
                                rules="required|alpha_num_dash_space"
                            />
                            <o-validated-field
                                v-model="formData.url"
                                name="url"
                                type="url"
                                :label="$i18n.t('sound.url')"
                                :placeholder="$i18n.t('sound.url_placeholder')"
                                rules="required|audio_load_state:@audioLoadState"
                                :help="$i18n.t('sound.url_help')"
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
                                    @audio-load-success="
                                        (data) => onAudioLoadSuccess(data)
                                    "
                                />
                            </div>

                            <o-validated-tag-input
                                v-model="formData.genres"
                                name="genres"
                                :label="$i18n.t('dj.genres')"
                                rules="required"
                                :tags="availableGenres"
                                field="name"
                                maxtags="3"
                                :placeholder="$i18n.t('dj.select_3_genres')"
                            />
                        </div>
                        <div
                            class="column is-half-tablet is-two-fifths-desktop"
                        >
                            <o-validated-image-crop-upload
                                v-model="formData.photo"
                                name="photo"
                                :label="$i18n.t('dj.photo')"
                                rules="image_type"
                                :current-image="
                                    initialData ? initialData.photo : null
                                "
                            />
                        </div>
                    </div>

                    <o-validated-bm-editor
                        v-model="formData.description"
                        name="description"
                        :label="$i18n.t(`${formData.type}.description`)"
                        :placeholder="
                            $i18n.t(`${formData.type}.description_placeholder`)
                        "
                    />

                    <div class="field is-grouped is-grouped-right">
                        <div class="control">
                            <o-button variant="light" @click="onCancel">
                                {{ $i18n.t('form.cancel') }}
                            </o-button>
                        </div>
                        <div class="control">
                            <o-button
                                :disabled="isLoading"
                                variant="dark"
                                @click="onSave"
                            >
                                {{
                                    initialData
                                        ? $i18n.t(`${formData.type}.save`)
                                        : $i18n.t(`${formData.type}.add`)
                                }}
                            </o-button>
                        </div>
                        <div
                            v-if="initialData && initialData.status === 'draft'"
                            class="control"
                        >
                            <o-button
                                :disabled="isLoading"
                                variant="primary"
                                @click="onSaveAndPublish"
                            >
                                {{
                                    $i18n.t(`${formData.type}.save_and_publish`)
                                }}
                            </o-button>
                        </div>
                    </div>
                </form>
            </ValidationObserver>
        </section>
    </client-only>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { extend, ValidationObserver } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'
import useDirectus, { useAuth } from '~/composables/directus'
import Player from '~/components/audio/Player.vue'
import OValidatedField from '~/components/form/OValidatedField.vue'
import OValidatedTagInput from '~/components/form/OValidatedTagInput.vue'
import OValidatedSelect from '~/components/form/OValidatedSelect.vue'
import OValidatedImageCropUpload from '~/components/form/OValidatedImageCropUpload.vue'
import OValidatedBmEditor from '~/components/form/OValidatedBmEditor.vue'

const { $i18n, $oruga, $axios, $audio } = useNuxtApp()
const directus = useDirectus()
const auth = useAuth()
const router = useRouter()

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
    if (
        file === null ||
        ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
    ) {
        return true
    }

    return 'validation.image_type'
})

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

interface InitialData {
    name?: string
    url?: string
    description?: string
    genres?: Array<string>
    dj?: Object
    type: string
    duration: number
    photo: Object | string
    status?: string
}

interface Props {
    initialData?: InitialData
    error?: Error | Object | string
    success?: string
    isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    initialData: null,
    error: null,
    success: null,
    isLoading: false
})

const formData = ref({
    name: null,
    url: null,
    description: null,
    genres: null,
    dj: auth.user.value.djs[0].id,
    type: 'mix',
    duration: null,
    photo: null
})

const availableGenres = ref(null)
const audioUrl = ref(null)
const audioLoadState = ref(null)
const currentPhoto = ref(null)
const observer = ref(null)

const soundTypeOptions = computed(() => {
    return [
        { value: 'mix', label: $i18n.t('mix.mix') },
        { value: 'track', label: $i18n.t('track.track') }
    ]
})

const debouncedGetAudioUrl = _.debounce(getAudioUrl, 500)

watch(
    () => formData.value.url,
    (val) => debouncedGetAudioUrl()
)

onMounted(async () => {
    if (props.initialData) {
        formData.value = {
            ...props.initialData
        }
    }

    // Check if initial data contains photo - if so, set form to keep existing photo
    if (props.initialData?.photo) {
        formData.value.photo = 'keep-current'
        currentPhoto.value = props.initialData.photo
    }

    // // AXIOS WAY
    // const genreTagsAll = await $axios.$get('items/genre')
    const genreTagsAll = await directus.items('genre').readByQuery()
    availableGenres.value = genreTagsAll.data
})

function onSave() {
    onSubmit(formData.value, `${formData.value.type}.edit_success`)
}
function onSaveAndPublish() {
    onSubmit(
        {
            ...formData.value,
            status: 'published'
        },
        `${formData.value.type}.save_and_publish_success`
    )
}
function onSubmit(formDataObj, successMessage) {
    observer.value.validate().then((success) => {
        if (!success) {
            $oruga.notification.open({
                message: $i18n.t('validation.form_validation_error'),
                rootClass: 'toast',
                variant: 'danger',
                duration: 7000
            })
            return
        }

        emit('formSubmit', { formData: formDataObj, successMessage })
    })
}
function onCancel() {
    router.back()
}
function onAudioLoadError() {
    audioLoadState.value = 'error'
}
function onAudioLoadSuccess(data) {
    audioLoadState.value = 'success'
    if (data && data.duration) formData.value.duration = data.duration
}
async function getAudioUrl() {
    const audioUrls = await $audio.getAudioUrls(formData.value.url)

    if (audioUrls && audioUrls.stream) {
        audioUrl.value = audioUrls.stream
    } else {
        audioUrl.value = 'http://nonexistent/'
    }
}
</script>
