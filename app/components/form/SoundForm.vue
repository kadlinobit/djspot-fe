<template>
    <div class="sound-form">
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
            ref="formRef"
            :schema="schema"
            :state="state"
            class="space-y-6"
            @submit="onSubmit"
        >
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <!-- Left Column -->
                <div class="space-y-4 lg:col-span-3">
                    <UFormField :label="$i18n.t('sound.type')" name="type">
                        <sound-type-selector
                            v-model="state.type"
                            :placeholder="$i18n.t('sound.select_sound_type')"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField
                        :label="$i18n.t(`${state.type}.name`)"
                        name="name"
                    >
                        <UInput
                            v-model="state.name"
                            :placeholder="$i18n.t(`${state.type}.name`)"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField
                        :label="$i18n.t(`${state.type}.slug`)"
                        name="slug"
                        :help="slugChangedMessage || $i18n.t('sound.slug_help')"
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

                    <UFormField
                        :label="$i18n.t('sound.url')"
                        name="url"
                        :help="$i18n.t('sound.url_help')"
                    >
                        <UInput
                            v-model="state.url"
                            type="url"
                            :placeholder="$i18n.t('sound.url_placeholder')"
                            class="w-full"
                        />
                    </UFormField>

                    <div class="my-4">
                        <Player
                            v-if="audioUrl"
                            :file="audioUrl"
                            @audio-load-error="onAudioLoadError"
                            @audio-load-success="onAudioLoadSuccess"
                        />
                    </div>

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

                <!-- Right Column -->
                <div class="lg:col-span-2">
                    <UFormField :label="$i18n.t('dj.photo')" name="photo">
                        <u-image-crop-upload
                            v-model="state.photo"
                            :current-image="currentPhoto"
                        />
                    </UFormField>
                </div>
            </div>

            <!-- Description -->
            <UFormField
                :label="$i18n.t(`${state.type}.description`)"
                name="description"
            >
                <u-bm-editor
                    v-model="state.description"
                    :placeholder="
                        $i18n.t(`${state.type}.description_placeholder`)
                    "
                />
            </UFormField>

            <!-- Buttons -->
            <div
                class="flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-800"
            >
                <UButton color="neutral" variant="ghost" @click="onCancel">
                    {{ $i18n.t('form.cancel') }}
                </UButton>

                <UButton
                    :loading="isLoading"
                    color="neutral"
                    variant="solid"
                    @click="onSave"
                >
                    {{
                        initialData
                            ? $i18n.t(`${state.type}.save`)
                            : $i18n.t(`${state.type}.add`)
                    }}
                </UButton>

                <UButton
                    v-if="initialData && state.status === 'draft'"
                    :loading="isLoading"
                    color="primary"
                    variant="solid"
                    @click="onSaveAndPublish"
                >
                    {{ $i18n.t(`${state.type}.save_and_publish`) }}
                </UButton>
            </div>
        </UForm>
    </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import _ from 'lodash';
import { useUserStore, useFormStore } from '@/stores';
import type { ISoundForm } from '@/plugins/directus/collection';

import UImageCropUpload, {
    type CropUploadModelValue
} from '~/components/form/UImageCropUpload.vue';
import UBmEditor from '~/components/form/UBmEditor.vue';
import SoundTypeSelector from '~/components/selectors/soundType.USelectMenu.vue';
import Player from '~/components/audio/Player.client.vue';

export type ISoundFormData = {
    name: string;
    url: string;
    slug: string;
    description?: string;
    genres: string[];
    dj: string;
    type: 'mix' | 'track';
    duration: number;
    photo?: CropUploadModelValue;
    status: string;
};

export interface ISoundFormSubmitData {
    formData: ISoundFormData;
    successMessage?: string;
}

const { $i18n, $audio, $api } = useNuxtApp();
const router = useRouter();
const { getUser } = useUserStore();
const formStore = useFormStore();

const emit = defineEmits<{
    (e: 'formSubmit', formSubmitData: ISoundFormSubmitData): void;
}>();

interface Props {
    initialData?: ISoundForm;
    errorMessage?: string;
    successMessage?: string;
    isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false
});

const formRef = ref();
const isLoading = ref(false);
const audioUrl = ref<string | null>(null);
const audioLoadState = ref<'success' | 'error' | null>(null);
const currentPhoto = ref<string | null>(null);

const state = reactive({
    name: '',
    url: '',
    slug: '',
    description: '',
    genres: [] as string[],
    dj: getUser()?.djs?.[0].id || '',
    type: 'mix' as 'mix' | 'track',
    duration: 0,
    photo: null as CropUploadModelValue,
    status: 'draft'
});

// Uniqueness helpers
async function verifyUniqueSlug(value: string) {
    if (!value) return true;
    return await $api.tools.verifyUnique(
        'sound',
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
        'sound',
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
    type: z.string().min(1),
    name: z
        .string()
        .min(1, $i18n.t('validation.required'))
        .regex(
            $api.tools.regEx.profileName,
            $i18n.t('validation.alpha_num_dash_space')
        )
        .refine(async (val) => {
            return (await debounceVerifyUniqueName(val)) as boolean;
        }, $i18n.t('validation.unique_sound_name')),
    slug: z
        .string()
        .min(1, $i18n.t('validation.required'))
        .regex($api.tools.regEx.urlSlug, $i18n.t('validation.url_slug'))
        .refine(async (val) => {
            return (await debounceVerifyUniqueSlug(val)) as boolean;
        }, $i18n.t('validation.unique_slug')),
    url: z
        .string()
        .min(1, $i18n.t('validation.required'))
        .refine(() => {
            return audioLoadState.value !== 'error';
        }, $i18n.t('validation.wrong_audio_url')),
    genres: z
        .array(z.string())
        .min(1, $i18n.t('validation.genres_min_max'))
        .max(3, $i18n.t('validation.genres_min_max')),
    photo: z
        .any()
        .refine((val) => {
            if (!val || val === 'keep-current') return true;
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            return val?.file && allowedTypes.includes(val?.file?.type);
        }, $i18n.t('validation.image_type'))
        .optional()
        .nullable(),
    description: z.string().optional().nullable()
});

type Schema = z.infer<typeof schema>;

const debouncedGetAudioUrl = _.debounce(async () => {
    if (!state.url) {
        audioUrl.value = null;
        return;
    }
    const audioUrls = await $audio.getAudioUrls(state.url);
    if (audioUrls && audioUrls.stream) {
        audioUrl.value = audioUrls.stream;
    } else {
        audioUrl.value = 'http://nonexistent/';
    }
}, 500);

watch(() => state.url, debouncedGetAudioUrl);

watch(
    () => props.isLoading,
    (val) => {
        isLoading.value = val;
    }
);

onMounted(async () => {
    formStore.fetchGenres();
    if (!props.initialData) return;

    Object.assign(state, {
        name: props.initialData.name,
        url: props.initialData.url,
        slug: props.initialData.slug,
        description: props.initialData.description || '',
        genres:
            props.initialData.genres?.map(
                (g: any) => g.genre_id?.id || g.genre_id || g
            ) || [],
        dj:
            props.initialData.dj?.id ||
            props.initialData.dj ||
            getUser()?.djs?.[0].id,
        type: props.initialData.type,
        duration: props.initialData.duration,
        status: props.initialData.status
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

function onSave() {
    formRef.value?.submit();
}

function onSaveAndPublish() {
    state.status = 'published';
    formRef.value?.submit();
}

async function onSubmit(_event: FormSubmitEvent<Schema>) {
    emit('formSubmit', {
        formData: { ...state },
        successMessage: `${state.type}.edit_success`
    });
}

function onAudioLoadError() {
    audioLoadState.value = 'error';
    formRef.value?.validate('url');
}

function onAudioLoadSuccess(data: any) {
    audioLoadState.value = 'success';
    formRef.value?.validate('url');
    if (data && data.duration) state.duration = data.duration;
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
    return null;
});
</script>
