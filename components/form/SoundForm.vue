<template>
    <section class="section">
        <o-loading :active="isLoading" />
        <o-notification v-if="successMessage" variant="success">
            {{ $i18n.t(successMessage) }}
        </o-notification>

        <o-notification v-if="errorMessage" variant="danger">
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
import _ from 'lodash';
import * as yup from 'yup';
import { useOruga } from '@oruga-ui/oruga';
import { useForm } from 'vee-validate';
import { useUserStore, useFormStore } from '@/stores';
import type { ISoundForm } from '@/plugins/directus/collection';

import Player from '~~/components/audio/Player.client.vue';
import OValidatedField from '~/components/form/OValidatedField.vue';
import OValidatedTagInput from '~/components/form/OValidatedTagInput.vue';
import OValidatedSelect from '~/components/form/OValidatedSelect.vue';
import OValidatedImageCropUpload, {
    type CropUploadModelValue
} from '~/components/form/OValidatedImageCropUpload.vue';
import OValidatedBmEditor from '~/components/form/OValidatedBmEditor.vue';

const { $i18n, $audio, $api } = useNuxtApp();
const $oruga = useOruga();
const router = useRouter();

const { getUser } = useUserStore();
const formStore = useFormStore();

export interface SoundFormSubmitData {
    formData: ISoundFormData;
    successMessage: string;
}

const emit = defineEmits<{
    (e: 'formSubmit', formSubmitData: SoundFormSubmitData): void;
}>();

interface Props {
    initialData?: ISoundForm;
    errorMessage?: string;
    successMessage?: string;
    isLoading?: boolean;
}

export type ISoundFormData = Omit<ISoundForm, 'photo' | 'id' | 'genres'> & {
    photo?: CropUploadModelValue;
    genres: number[];
};

export interface ISoundFormSubmitData {
    formData: ISoundFormData;
    successMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false
});

let formData = reactive<ISoundFormData>({
    name: '',
    url: '',
    slug: '',
    description: '',
    genres: [],
    dj: getUser()?.djs?.[0].id || '',
    type: 'mix',
    duration: 0,
    photo: undefined,
    status: 'draft'
});

const availableGenres = ref(formStore.genresOptions);
const audioUrl = ref();
const audioLoadState = ref<String | null>(null);
const currentPhoto = ref<string>();
const isLoading = ref(false);

async function verifyUniqueSlug(value: string) {
    return $api.tools.verifyUnique(
        'sound',
        'slug',
        value,
        props.initialData?.slug
    );
}
const debounceVerifyUniqueSlug = $api.tools.asyncDebounce(
    verifyUniqueSlug,
    1500
);
async function verifyUniqueName(value: string) {
    return $api.tools.verifyUnique(
        'sound',
        'name',
        value,
        props.initialData?.name
    );
}
const debounceVerifyUniqueName = $api.tools.asyncDebounce(
    verifyUniqueName,
    1500
);

async function verifyAudioUrl(value: string) {
    if (audioLoadState.value === 'error') return false;
    return true;
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
            const verified = await debounceVerifyUniqueName(value as string);
            return verified as boolean;
        }),
    slug: yup
        .string()
        .required('validation.required')
        .matches($api.tools.regEx.urlSlug, 'validation.alpha_num_dash_space')
        .test('verified', 'validation.unique_slug', async (value) => {
            const verified = await debounceVerifyUniqueSlug(value as string);
            return verified as boolean;
        }),
    url: yup
        .string()
        .required('validation.required')
        .test('verified', 'validation.wrong_audio_url', async (value) => {
            const verified = await verifyAudioUrl(value as string);
            return verified as boolean;
        }),
    photo: yup
        .mixed()
        .test('photo', 'validation.image_type', (val) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (val === null) return true;
            if (typeof val === 'string' && val === 'keep-current') return true;
            if (val?.file && allowedTypes.includes(val?.file?.type))
                return true;
            return false;
        })
        .nullable(),
    genres: yup
        .array()
        .min(1, 'validation.genres_min_max')
        .max(3, 'validation.genres_min_max')
};

const { errors: formErrors, validate, validateField } = useForm();

const soundTypeOptions = computed(() => {
    return [
        { value: 'mix', label: $i18n.t('mix.mix') },
        { value: 'track', label: $i18n.t('track.track') }
    ];
});

const debouncedGetAudioUrl = _.debounce(getAudioUrl, 500);

watch(
    () => formData.url,
    (val) => debouncedGetAudioUrl()
);

watch(
    () => props.isLoading,
    (val) => {
        isLoading.value = val;
    }
);

onMounted(async () => {
    formStore.fetchCities();
    formStore.fetchGenres();
    if (!props.initialData) return;

    // OBJECT assign needed for keeping reactivity when using reactive type from Vue
    Object.assign(formData, props.initialData);
    const { photo, genres } = props.initialData;

    if (photo) {
        formData.photo = 'keep-current';
        currentPhoto.value = photo;
    }

    if (genres) formData.genres = genres.map((genre) => genre.genre_id);
});

function onSave() {
    onSubmit({ ...formData }, `${formData.type}.edit_success`);
}
function onSaveAndPublish() {
    onSubmit(
        {
            ...formData,
            status: 'published'
        },
        `${formData.type}.save_and_publish_success`
    );
}
async function onSubmit(formDataObj: ISoundFormData, successMessage: string) {
    isLoading.value = true;
    await validate().then((result) => {
        if (!result.valid) {
            $oruga.notification.open({
                message: $i18n.t('validation.form_validation_error'),
                variant: 'danger'
            });
            isLoading.value = false;
            return;
        }
        isLoading.value = false;
        emit('formSubmit', { formData: formDataObj, successMessage });
    });
}
function onCancel() {
    router.back();
}
function onAudioLoadError() {
    audioLoadState.value = 'error';
    validateField('url');
}
function onAudioLoadSuccess(data: any) {
    audioLoadState.value = 'success';
    validateField('url');
    if (data && data.duration) formData.duration = data.duration;
}

async function getAudioUrl() {
    const audioUrls = await $audio.getAudioUrls(formData.url);

    if (audioUrls && audioUrls.stream) {
        audioUrl.value = audioUrls.stream;
    } else {
        audioUrl.value = 'http://nonexistent/';
    }
}

const slugChangedMessage = computed(() => {
    if (
        !_.isNil(props?.initialData?.slug) &&
        formData.slug !== props?.initialData?.slug
    )
        return $i18n.t('validation.slug_changed_warning', [
            props?.initialData?.slug
        ]);
    return null;
});
</script>
