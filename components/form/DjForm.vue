<template>
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

        <form v-if="!props.successMessage" method="post" @submit.prevent>
            <div class="columns is-tablet">
                <div class="column is-half-tablet is-three-fifths-desktop">
                    <o-validated-field
                        v-model="formData.name"
                        name="name"
                        type="text"
                        :label="$i18n.t('dj.name')"
                        :placeholder="$i18n.t('dj.dj_name_placeholder')"
                        :validation-rules="validationSchema.name"
                    />
                    <o-validated-field
                        v-model="formData.slug"
                        name="slug"
                        type="text"
                        :label="$i18n.t('dj.slug')"
                        :control-button="true"
                        :control-button-label="'form.generate'"
                        :custom-message="slugChangedMessage"
                        :validation-rules="validationSchema.slug"
                        @control-button-clicked="
                            formData.slug = $api.tools.generateUrlSlug(
                                formData.name
                            )
                        "
                    />
                    <o-validated-field
                        v-model="formData.email"
                        name="email"
                        type="email"
                        :label="$i18n.t('dj.email')"
                        :validation-rules="validationSchema.email"
                    />
                    <o-validated-select
                        v-model="formData.city"
                        name="city"
                        :label="$i18n.t('dj.city')"
                        rules="required"
                        :options="formStore.citiesOptions"
                        :expanded="true"
                        :placeholder="$i18n.t('dj.select_city')"
                        :validation-rules="validationSchema.city"
                    />
                    <o-validated-tag-input
                        v-model="formData.genres"
                        name="genres"
                        :label="$i18n.t('dj.genres')"
                        rules="required"
                        :tags="formStore.genresOptions"
                        field="name"
                        :max-tags="3"
                        :placeholder="$i18n.t('dj.select_3_genres')"
                        :validation-rules="validationSchema.genres"
                    />
                </div>
                <div class="column is-half-tablet is-two-fifths-desktop">
                    <o-validated-image-crop-upload
                        v-model="formData.photo"
                        name="photo"
                        :label="$i18n.t('dj.photo')"
                        rules="image_type"
                        :current-image="initialData ? initialData.photo : null"
                        :validation-rules="validationSchema.photo"
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
    </div>
</template>

<script setup lang="ts">
// TODO - make slug editable
// TODO - slug availability check online plus validation in form
import _ from 'lodash';
import * as yup from 'yup';
import { useOruga } from '@oruga-ui/oruga';
import { useForm } from 'vee-validate';
import { useFormStore } from '~/stores';
import OValidatedField from '~/components/form/OValidatedField.vue';
import OValidatedSelect from '~/components/form/OValidatedSelect.vue';
import OValidatedImageCropUpload, {
    type CropUploadModelValue
} from '~/components/form/OValidatedImageCropUpload.vue';
import OValidatedTagInput from '~/components/form/OValidatedTagInput.vue';
import OValidatedBmEditor from '~/components/form/OValidatedBmEditor.vue';
import type { IDjForm } from '~/plugins/directus/collection';

const { $i18n, $api } = useNuxtApp();
const $oruga = useOruga();
const formStore = useFormStore();
const router = useRouter();

const emit = defineEmits<{
    (e: 'formSubmit', formSubmitData: IDjFormSubmitData): void;
}>();

interface Props {
    initialData?: IDjForm;
    errorMessage?: string;
    successMessage?: string;
    isLoading?: boolean;
}

export type IDjFormData = Omit<IDjForm, 'photo' | 'id' | 'city' | 'genres'> & {
    photo?: CropUploadModelValue;
    city?: number;
    genres: number[];
};

export interface IDjFormSubmitData {
    formData: IDjFormData;
    successMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
    mode: 'new'
});
let formData = reactive<IDjFormData>({
    name: '',
    slug: '',
    email: '',
    bio: '',
    photo: undefined,
    city: undefined,
    genres: []
});

const currentPhoto = ref<string>();

async function verifyUniqueSlug(value: string) {
    return $api.tools.verifyUnique(
        'dj',
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
        'dj',
        'name',
        value,
        props.initialData?.name
    );
}

function verifyExistingCity(value: number) {
    return formStore.citiesOptions.some((city) => city.value === value);
}
const debounceVerifyUniqueName = $api.tools.asyncDebounce(
    verifyUniqueName,
    1500
);

const validationSchema = {
    name: yup
        .string()
        .required('validation.required')
        .matches(
            $api.tools.regEx.profileName,
            'validation.alpha_num_dash_space'
        )
        .matches($api.tools.regEx.noDjPrefix, 'validation.no_dj_prefix')
        .test('verified', 'validation.unique_dj_name', async (value) => {
            const verified = await debounceVerifyUniqueName(value as string);
            return verified as boolean;
        }),
    slug: yup
        .string()
        .required('validation.required')
        .matches($api.tools.regEx.urlSlug, 'validation.url_slug')
        .test('verified', 'validation.unique_slug', async (value) => {
            const verified = await debounceVerifyUniqueSlug(value as string);
            return verified as boolean;
        }),
    email: yup.string().email('validation.email'),
    city: yup.number().required('validation.required').not([-1]),
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
    genres: yup.array().min(1).max(3)
};

const { errors: formErrors, validate } = useForm();

onMounted(async () => {
    formStore.fetchCities();
    formStore.fetchGenres();

    if (!props.initialData) return;

    // OBJECT assign needed for keeping reactivity when using reactive type from Vue
    Object.assign(formData, props.initialData);
    const { genres, photo } = props.initialData;

    if (photo) {
        formData.photo = 'keep-current';
        currentPhoto.value = photo;
    }

    if (genres) formData.genres = genres.map((genre) => genre.genre_id);
});

async function onSubmit() {
    await validate().then((result) => {
        if (!result.valid) {
            $oruga.notification.open({
                message: $i18n.t('validation.form_validation_error'),
                variant: 'danger'
            });
            return;
        }
        emit('formSubmit', { formData });
    });
}
function onCancel() {
    router.back();
}

const slugChangedMessage = computed(() => {
    if (
        !_.isNil(props?.initialData?.slug) &&
        formData.slug !== props?.initialData?.slug
    )
        return $i18n.t('validation.slug_changed_warning', [
            props?.initialData?.slug
        ]);
    return;
});
</script>
