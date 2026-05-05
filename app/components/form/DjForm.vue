<template>
    <div class="dj-form">
        <UAlert
            v-if="successMessage"
            icon="i-heroicons-check-circle"
            color="success"
            variant="subtle"
            :title="$i18n.t(successMessage)"
            class="mb-6"
        />

        <UAlert
            v-if="errorMessage"
            icon="i-heroicons-exclamation-triangle"
            color="error"
            variant="subtle"
            :title="$i18n.t(errorMessage)"
            class="mb-6"
        />

        <UForm
            v-if="!successMessage"
            :schema="schema"
            :state="state"
            class="space-y-6"
            @submit="onSubmit"
        >
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <!-- Left Column: Basic Info -->
                <div class="space-y-4 lg:col-span-3">
                    <UFormField :label="$i18n.t('dj.name')" name="name">
                        <UInput
                            v-model="state.name"
                            :placeholder="$i18n.t('dj.dj_name_placeholder')"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField
                        :label="$i18n.t('dj.slug')"
                        name="slug"
                        :help="slugChangedMessage"
                    >
                        <div class="flex gap-2">
                            <UInput v-model="state.slug" class="flex-1" />
                            <UButton
                                color="neutral"
                                variant="outline"
                                icon="i-heroicons-arrow-path"
                                @click="generateSlug"
                            >
                                {{ $i18n.t('form.generate') }}
                            </UButton>
                        </div>
                    </UFormField>

                    <UFormField :label="$i18n.t('dj.email')" name="email">
                        <UInput
                            v-model="state.email"
                            type="email"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField :label="$i18n.t('dj.city')" name="city">
                        <USelectMenu
                            v-model="state.city"
                            :items="formStore.citiesOptions"
                            value-key="value"
                            :placeholder="$i18n.t('dj.select_city')"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField :label="$i18n.t('dj.genres')" name="genres">
                        <UInputMenu
                            v-model="state.genres"
                            :items="formStore.genresOptions"
                            multiple
                            value-key="value"
                            label-key="label"
                            :placeholder="$i18n.t('dj.select_3_genres')"
                            class="w-full"
                        />
                    </UFormField>
                </div>

                <!-- Right Column: Profile Photo -->
                <div class="lg:col-span-2">
                    <UFormField :label="$i18n.t('dj.photo')" name="photo">
                        <u-image-crop-upload
                            v-model="state.photo"
                            :current-image="currentPhoto"
                        />
                    </UFormField>
                </div>
            </div>

            <!-- Bio Editor -->
            <UFormField :label="$i18n.t('dj.bio')" name="bio">
                <UCustomEditor v-model="state.bio" />
            </UFormField>

            <!-- Action Buttons -->
            <div
                class="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800"
            >
                <UButton
                    :disabled="isLoading"
                    color="neutral"
                    variant="ghost"
                    @click="onCancel"
                >
                    {{ $i18n.t('form.cancel') }}
                </UButton>
                <UButton
                    type="submit"
                    :loading="isLoading"
                    color="neutral"
                    variant="solid"
                >
                    {{
                        initialData
                            ? $i18n.t('dj.save_profile')
                            : $i18n.t('dj.do_create_profile')
                    }}
                </UButton>
            </div>
        </UForm>
    </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import _ from 'lodash';
import { useFormStore } from '~/stores';
import UImageCropUpload, {
    type CropUploadModelValue
} from '~/components/form/UImageCropUpload.vue';
import UCustomEditor from '~/components/form/UCustomEditor.vue';
import type { IDjForm } from '~/plugins/directus/collection';

const { $i18n, $api } = useNuxtApp();
const formStore = useFormStore();
const router = useRouter();

export type IDjFormData = {
    name: string;
    slug: string;
    email?: string;
    bio?: string;
    photo?: CropUploadModelValue;
    city?: string;
    genres: string[];
};

export interface IDjFormSubmitData {
    formData: IDjFormData;
    successMessage?: string;
}

interface Props {
    initialData?: IDjForm;
    errorMessage?: string;
    successMessage?: string;
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false
});

const emit = defineEmits<{
    (e: 'formSubmit', formSubmitData: IDjFormSubmitData): void;
}>();

const state = reactive<IDjFormData>({
    name: '',
    slug: '',
    email: '',
    bio: '',
    photo: null,
    city: undefined,
    genres: []
});

const currentPhoto = ref<string | null>(null);

// Uniqueness check helpers
async function verifyUniqueSlug(value: string) {
    if (!value) return true;
    return await $api.tools.verifyUnique(
        'dj',
        'slug',
        value,
        props.initialData?.slug
    );
}
const debounceVerifyUniqueSlug = $api.tools.asyncDebounce(
    verifyUniqueSlug,
    1000
);

async function verifyUniqueName(value: string) {
    if (!value) return true;
    return await $api.tools.verifyUnique(
        'dj',
        'name',
        value,
        props.initialData?.name
    );
}
const debounceVerifyUniqueName = $api.tools.asyncDebounce(
    verifyUniqueName,
    1000
);

const schema = z.object({
    name: z
        .string()
        .min(1, $i18n.t('validation.required'))
        .regex(
            $api.tools.regEx.profileName,
            $i18n.t('validation.alpha_num_dash_space')
        )
        .regex($api.tools.regEx.noDjPrefix, $i18n.t('validation.no_dj_prefix'))
        .refine(async (val) => {
            return (await debounceVerifyUniqueName(val)) as boolean;
        }, $i18n.t('validation.unique_dj_name')),
    slug: z
        .string()
        .min(1, $i18n.t('validation.required'))
        .regex($api.tools.regEx.urlSlug, $i18n.t('validation.url_slug'))
        .refine(async (val) => {
            return (await debounceVerifyUniqueSlug(val)) as boolean;
        }, $i18n.t('validation.unique_slug')),
    email: z.string().email($i18n.t('validation.email')).or(z.literal('')),
    city: z.string({ required_error: $i18n.t('validation.required') }),
    genres: z
        .array(z.string())
        .min(1, $i18n.t('validation.required'))
        .max(3, $i18n.t('validation.max_3_genres')),
    photo: z
        .any()
        .refine((val) => {
            if (!val || val === 'keep-current') return true;
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            return val?.file && allowedTypes.includes(val?.file?.type);
        }, $i18n.t('validation.image_type'))
        .optional()
        .nullable(),
    bio: z.string().optional().nullable()
});

type Schema = z.infer<typeof schema>;

onMounted(async () => {
    formStore.fetchCities();
    formStore.fetchGenres();

    if (!props.initialData) return;

    Object.assign(state, {
        name: props.initialData.name,
        slug: props.initialData.slug,
        email: props.initialData.email || '',
        bio: props.initialData.bio || '',
        city: props.initialData.city?.id || props.initialData.city,
        genres:
            props.initialData.genres?.map(
                (g: any) => g.genre_id?.id || g.genre_id || g
            ) || []
    });

    if (props.initialData.photo) {
        state.photo = 'keep-current';
        currentPhoto.value = props.initialData.photo;
    }
});

function generateSlug() {
    state.slug = $api.tools.generateUrlSlug(state.name);
}

function onCancel() {
    router.back();
}

async function onSubmit(_event: FormSubmitEvent<Schema>) {
    emit('formSubmit', { formData: state });
}

const slugChangedMessage = computed(() => {
    if (
        !_.isNil(props?.initialData?.slug) &&
        state.slug !== props?.initialData?.slug
    ) {
        return $i18n.t('validation.slug_changed_warning', [
            props?.initialData?.slug
        ]);
    }
    return undefined;
});
</script>
