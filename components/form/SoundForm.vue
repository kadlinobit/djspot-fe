<template>
    <section class="section">
        <o-loading :active="isLoading" />
        <o-notification v-if="props.successMessage" variant="success">
            {{ $i18n.t(successMessage) }}
        </o-notification>

        <o-notification v-if="props.errorMessage" variant="danger">
            {{ $i18n.t(errorMessage) }}
        </o-notification>

        <form v-if="!successMessage" method="post" @submit.prevent>
            <div class="columns is-tablet">
                <div class="column is-half-tablet is-three-fifths-desktop">
                    <o-validated-select
                        v-model="formData.type"
                        name="type"
                        :label="$i18n.t('sound.type')"
                        :options="soundTypeOptions"
                        :expanded="true"
                        :placeholder="$i18n.t('sound.select_sound_type')"
                        :validation-rules="validationSchema.type"
                    />
                    <o-validated-field
                        v-model="formData.name"
                        name="name"
                        type="text"
                        :label="$i18n.t(`${formData.type}.name`)"
                        :placeholder="$i18n.t(`${formData.type}.name`)"
                        :validation-rules="validationSchema.name"
                    />
                    <o-validated-field
                        v-model="formData.slug"
                        name="slug"
                        type="text"
                        :label="$i18n.t(`${formData.type}.slug`)"
                        :control-button="true"
                        :control-button-label="'form.generate'"
                        :custom-message="slugChangedMessage"
                        :validation-rules="validationSchema.slug"
                        @control-button-clicked="
                            formData.slug = $api.tools.generateUrlSlug(
                                formData.name
                            )
                        "
                        :help="$i18n.t('sound.slug_help')"
                    />
                    <o-validated-field
                        v-model="formData.url"
                        name="url"
                        type="url"
                        :label="$i18n.t('sound.url')"
                        :placeholder="$i18n.t('sound.url_placeholder')"
                        :help="$i18n.t('sound.url_help')"
                        :validation-rules="validationSchema.url"
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
                        :tags="availableGenres"
                        field="name"
                        :max-tags="3"
                        expanded
                        :placeholder="$i18n.t('dj.select_3_genres')"
                        :validation-rules="validationSchema.genres"
                    />
                </div>
                <div class="column is-half-tablet is-two-fifths-desktop">
                    <o-validated-image-crop-upload
                        v-model="formData.photo"
                        name="photo"
                        :label="$i18n.t('dj.photo')"
                        :current-image="initialData ? initialData.photo : null"
                        :validation-rules="validationSchema.photo"
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
                        :disabled="props.isLoading"
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
                        :disabled="props.isLoading"
                        variant="primary"
                        @click="onSaveAndPublish"
                    >
                        {{ $i18n.t(`${formData.type}.save_and_publish`) }}
                    </o-button>
                </div>
            </div>
        </form>
    </section>
</template>

<script setup lang="ts">
import _ from 'lodash'
import * as yup from 'yup'
import { useProgrammatic } from '@oruga-ui/oruga'
import { useForm } from 'vee-validate'
import useDirectus, { useAuth } from '~/composables/directus'
import Player from '~~/components/audio/Player.client.vue'
import OValidatedField from '~/components/form/OValidatedField.vue'
import OValidatedTagInput from '~/components/form/OValidatedTagInput.vue'
import OValidatedSelect from '~/components/form/OValidatedSelect.vue'
import OValidatedImageCropUpload from '~/components/form/OValidatedImageCropUpload.vue'
import OValidatedBmEditor from '~/components/form/OValidatedBmEditor.vue'

const { $i18n, $audio, $api, $fetch } = useNuxtApp()
const { oruga: $oruga } = useProgrammatic()
const directus = useDirectus()
const auth = useAuth()
const router = useRouter()

// extend('required', required)

// extend('alpha_num_dash_space', (value) => {
//     if (value.match(/^[a-z\d\-\sáčďéěíňóřšťúůýž]+$/gi)) {
//         return true
//     }
//     return 'validation.alpha_num_dash_space'
// })

// extend('audio_load_state', {
//     params: ['audioLoadState'],
//     validate(value, { audioLoadState }) {
//         return audioLoadState !== 'error'
//     },
//     message: 'player.error_loading_file_message'
// })

// extend('image_type', (file) => {
//     if (
//         file === null ||
//         ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
//     ) {
//         return true
//     }

//     return 'validation.image_type'
// })

const emit = defineEmits<{
    (e: 'formSubmit', formSubmitData: FormSubmitData): void
}>()

interface Props {
    initialData?: SoundFormData | null
    errorMessage?: string | null
    successMessage?: string | null
    isLoading?: boolean | null
}

const props = withDefaults(defineProps<Props>(), {
    initialData: null,
    errorMessage: null,
    successMessage: null,
    isLoading: false
})

const formData = ref<SoundFormData>({
    name: '',
    url: '',
    slug: '',
    description: '',
    genres: [],
    dj: auth.user.value.djs[0].id,
    type: 'mix',
    duration: null,
    photo: null
})

const availableGenres = ref(null)
const audioUrl = ref(null)
const audioLoadState = ref<String | null>(null)
const currentPhoto = ref(null)
const isLoading = ref(false)

async function verifyUniqueSlug(value: string) {
    return $api.tools.verifyUnique(
        'sound',
        'slug',
        value,
        props.initialData?.slug
    )
}
const debounceVerifyUniqueSlug = $api.tools.asyncDebounce(
    verifyUniqueSlug,
    1500
)
async function verifyUniqueName(value: string) {
    return $api.tools.verifyUnique(
        'sound',
        'name',
        value,
        props.initialData?.name
    )
}
const debounceVerifyUniqueName = $api.tools.asyncDebounce(
    verifyUniqueName,
    1500
)

async function verifyAudioUrl(value: string) {
    if (audioLoadState.value === 'error') return false
    return true
}

const validationSchema = {
    type: yup.string().required(),
    name: yup
        .string()
        .required('validation.required')
        .matches(
            $api.tools.regEx.profileName,
            'validation.alpha_num_dash_space'
        )
        .test('verified', 'validation.unique_sound_name', async (value) => {
            const verified = await debounceVerifyUniqueName(value as string)
            return verified as boolean
        }),
    slug: yup
        .string()
        .required('validation.required')
        .matches($api.tools.regEx.urlSlug, 'validation.alpha_num_dash_space')
        .test('verified', 'validation.unique_slug', async (value) => {
            const verified = await debounceVerifyUniqueSlug(value as string)
            return verified as boolean
        }),
    url: yup
        .string()
        .required('validation.required')
        .test('verified', 'validation.wrong_audio_url', async (value) => {
            const verified = await verifyAudioUrl(value as string)
            return verified as boolean
        }),
    photo: yup
        .mixed()
        .test('photo', 'validation.image_type', (val) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
            if (val === null) return true
            if (typeof val === 'string' && val === 'keep-current') return true
            if (val?.file && allowedTypes.includes(val?.file?.type)) return true
            return false
        })
        .nullable(),
    genres: yup
        .array()
        .min(1, 'validation.genres_min_max')
        .max(3, 'validation.genres_min_max')
}

const { errors: formErrors, validate, validateField } = useForm()

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

watch(
    () => props.isLoading,
    (val) => {
        isLoading.value = val
    }
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
    onSubmit({ ...formData.value }, `${formData.value.type}.edit_success`)
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
async function onSubmit(formDataObj, successMessage) {
    isLoading.value = true
    await validate().then((result) => {
        if (!result.valid) {
            $oruga.notification.open({
                message: $i18n.t('validation.form_validation_error'),
                variant: 'danger'
            })
            isLoading.value = false
            return
        }
        isLoading.value = false
        emit('formSubmit', { formData: formDataObj, successMessage })
    })
}
function onCancel() {
    router.back()
}
function onAudioLoadError() {
    audioLoadState.value = 'error'
    validateField('url')
}
function onAudioLoadSuccess(data) {
    audioLoadState.value = 'success'
    validateField('url')
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

const slugChangedMessage = computed(() => {
    if (
        !_.isNil(props?.initialData?.slug) &&
        formData.value.slug !== props?.initialData?.slug
    )
        return $i18n.t('validation.slug_changed_warning', [
            props?.initialData?.slug
        ])
    return null
})
</script>
