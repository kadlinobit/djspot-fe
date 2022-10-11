<template>
    <client-only>
        <div class="form dj-form">
            <o-notification
                v-if="props.successMessage"
                variant="success"
                :closable="false"
            >
                {{ $i18n.t(props.successMessage) }}
            </o-notification>
            <o-notification
                v-if="props.errorMessage"
                variant="danger"
                :closable="false"
            >
                {{ $i18n.t(props.errorMessage) }}
            </o-notification>

            <ValidationObserver ref="observer" slim>
                <form v-if="!successMessage" method="post" @submit.prevent>
                    <div class="columns is-tablet">
                        <div
                            class="column is-half-tablet is-three-fifths-desktop"
                        >
                            <o-validated-field
                                v-model="formData.name"
                                name="name"
                                type="text"
                                :label="$i18n.t('dj.name')"
                                :placeholder="$i18n.t('dj.dj_name_placeholder')"
                                rules="required|no_dj_prefix|alpha_num_dash_space"
                            />
                            <o-validated-field
                                v-model="formData.slug"
                                name="slug"
                                :disabled="true"
                                type="text"
                                :label="$i18n.t('dj.slug')"
                                rules="required"
                            />
                            <o-validated-field
                                v-model="formData.email"
                                name="email"
                                type="email"
                                :label="$i18n.t('dj.email')"
                                rules="email"
                            />
                            <o-validated-select
                                v-model="formData.city"
                                name="city"
                                :label="$i18n.t('dj.city')"
                                rules="required"
                                :options="formStore.citiesOptions"
                                :expanded="true"
                                :placeholder="$i18n.t('dj.select_city')"
                            />
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
                        v-model="formData.bio"
                        name="bio"
                        type="textarea"
                        rules=""
                        :label="$i18n.t('dj.bio')"
                    />

                    <div class="field is-grouped is-grouped-right">
                        <div class="control">
                            <o-button
                                :disabled="props.isLoading"
                                variant="light"
                                @click="onCancel"
                            >
                                {{ $i18n.t('form.cancel') }}
                            </o-button>
                            <o-button
                                :disabled="props.isLoading"
                                variant="dark"
                                @click="onSubmit"
                            >
                                {{
                                    initialData
                                        ? $i18n.t('dj.save_profile')
                                        : $i18n.t('dj.do_create_profile')
                                }}
                            </o-button>
                        </div>
                    </div>
                </form>
            </ValidationObserver>
        </div>
    </client-only>
</template>

<script setup lang="ts">
// TODO - make slug editable
// TODO - slug availability check online plus validation in form
import { extend, ValidationObserver } from 'vee-validate'
import {
    required as ruleRequired,
    email as ruleEmail
} from 'vee-validate/dist/rules'
import { useFormStore } from '~/stores'
import OValidatedField from '~/components/form/OValidatedField.vue'
import OValidatedSelect from '~/components/form/OValidatedSelect.vue'
import OValidatedImageCropUpload from '~/components/form/OValidatedImageCropUpload.vue'
import OValidatedTagInput from '~/components/form/OValidatedTagInput.vue'
import OValidatedBmEditor from '~/components/form/OValidatedBmEditor.vue'
import useDirectus from '~/composables/directus'

const { $axios, $i18n, $oruga } = useNuxtApp()
const formStore = useFormStore()
const router = useRouter()
const directus = useDirectus()

extend('email', ruleEmail)
extend('required', ruleRequired)

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
    slug?: string
    email?: string
    bio?: string
    photo?: string
    city?: string
    genres?: Array<string>
}

interface Props {
    initialData?: InitialData
    errorMessage?: string
    successMessage?: string
    isLoading?: boolean
    mode?: string
}

const props = withDefaults(defineProps<Props>(), {
    initialData: null,
    error: null,
    successMessage: null,
    isLoading: false,
    mode: 'new'
})

const formData = ref({
    name: null,
    slug: null,
    email: null,
    bio: null,
    photo: null,
    city: null,
    genres: null
})

const availableGenres = ref(null)
const currentPhoto = ref(null)
const observer = ref(null)

watch(
    () => formData.value.name,
    (val) => {
        formData.value.slug = createSlug(val)
    }
)

onMounted(async () => {
    if (props.initialData) {
        formData.value = {
            ...props.initialData
        }
    }
    // Check if initial data contains photo - if so, set form to keep existing photo
    if (props.initialData && props.initialData.photo) {
        formData.value.photo = 'keep-current'
        currentPhoto.value = props.initialData.photo
    }

    const genreTagsAll = await directus.items('genre').readByQuery()
    availableGenres.value = genreTagsAll.data
})

function onSubmit() {
    observer.value.validate().then((isValid) => {
        if (!isValid) {
            $oruga.notification.open({
                message: $i18n.t('validation.form_validation_error'),
                variant: 'danger'
            })
            return
        }

        emit('formSubmit', {
            formData: formData.value
        })
    })
}
function onCancel() {
    router.back()
}
function createSlug(val) {
    if (!val) return ''
    return val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036F]/g, '')
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
}
</script>
