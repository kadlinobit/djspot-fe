<template>
    <div>
        <o-field
            :label="props.label"
            :variant="getFieldVariant"
            :message="errorMessage ? $i18n.t(errorMessage) : null"
            :style="visibilityStyle"
            :class="{ 'has-name': !!fieldValue }"
        >
            <div v-if="currentImage && fieldValue === 'keep-current'">
                <img :src="`${apiBaseURL}/assets/${currentImage}`" />
            </div>
            <o-upload
                v-else-if="!file || (file && errorMessage)"
                v-model="file"
                expanded
                drag-drop
            >
                <section class="section">
                    <div class="content has-text-centered">
                        <div>
                            <p>
                                <o-icon icon="upload" size="large"></o-icon>
                            </p>
                            <p>Drop your files here or click to upload</p>
                        </div>
                    </div>
                </section>
            </o-upload>
            <div
                v-else-if="
                    photoUrl && fieldValue !== 'keep-current' && !errorMessage
                "
            >
                <cropper
                    ref="cropper"
                    :src="photoUrl"
                    :stencil-props="{
                        handlers: {},
                        movable: false,
                        scalable: false,
                        aspectRatio: 1
                    }"
                    :resize-image="{
                        adjustStencil: false
                    }"
                    :canvas="{
                        width: 1024,
                        height: 1024
                    }"
                    image-restriction="stencil"
                    @change="onCroppedImageChange"
                />
            </div>
        </o-field>
        <o-field v-if="fieldValue || currentImage" grouped position="is-right">
            <o-button
                v-if="fieldValue"
                variant="danger"
                @click.prevent="onRemoveImage"
            >
                {{
                    fieldValue === 'keep-current'
                        ? $t('dj.remove_current_photo')
                        : $t('dj.remove_photo')
                }}
            </o-button>
            <o-button
                v-if="currentImage && fieldValue !== 'keep-current'"
                variant="info"
                @click.prevent="onKeepCurrentImage"
            >
                {{ $t('dj.keep_current_photo') }}
            </o-button>
        </o-field>
    </div>
</template>

<script setup lang="ts">
/**
 * TODO
 * - put canvas size somwehre to config
 */
import _ from 'lodash';
import { useField, type RuleExpression } from 'vee-validate';
import { Cropper, type CropperResult } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const { $i18n } = useNuxtApp();
const { apiBaseURL } = useRuntimeConfig().public;

export type CroppedImage = { file: File | null; croppedImage?: CropperResult };
export type CropUploadModelValue = CroppedImage | 'keep-current' | null;

interface Props {
    currentImage?: string | Object | null;
    name?: string;
    type?: string;
    label?: string;
    placeholder?: string | null;
    disabled?: boolean;
    hidden?: boolean;
    help?: string | null;
    isValidationOn?: boolean;
    validationRules?: RuleExpression<CropUploadModelValue>;
}

const modelValue = defineModel<CropUploadModelValue>({ default: null });

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    currentImage: null,
    name: 'input',
    type: 'text',
    label: 'label',
    placeholder: null,
    disabled: false,
    hidden: false,
    help: null,
    isValidationOn: true
});

const file = ref<File | null>(null);
const photoUrl = ref<string>();

const nameRef = toRef(props, 'name');
//TODO - meta touched is not working, find out why
const { errorMessage, value: fieldValue } = useField<CropUploadModelValue>(
    nameRef,
    props.validationRules,
    {
        initialValue: modelValue.value
    }
);

watch(file, (val) => {
    console.warn('FILE CHANGED', val);
    if (!val) {
        photoUrl.value = undefined;
        return;
    }
    fieldValue.value = { file: val };
    try {
        if (file?.value?.type && file.value.type.split('/')[0] === 'image') {
            photoUrl.value = URL.createObjectURL(file.value);
        }
    } catch (e) {
        console.error(e);
        photoUrl.value = undefined;
    }
});

watch(
    modelValue,
    (val) => {
        if (val !== fieldValue.value) {
            fieldValue.value = val;
        }
    },
    { immediate: true }
);

watch(fieldValue, (val) => {
    if (val !== modelValue.value) {
        modelValue.value = val;
    }
});

function onCroppedImageChange(croppedImage: CropperResult) {
    // this.$emit('input', { file: this.file, croppedImage })
    fieldValue.value = { file: file.value, croppedImage };
    // this.$emit('input', { file: this.file, croppedImage })
}
function onRemoveImage() {
    file.value = null;
    fieldValue.value = null;
    // this.$emit('input', null)
}
function onKeepCurrentImage() {
    file.value = null;
    fieldValue.value = 'keep-current';
    // this.$emit('input', 'keep-current')
}
const visibilityStyle = computed(() => {
    if (props.hidden) {
        return { display: 'none' };
    }
    return { display: 'default' };
});

const getFieldVariant = computed(() => {
    if (props.isValidationOn && !_.isNil(errorMessage.value)) return 'danger';
    if (props.isValidationOn && !errorMessage.value) return 'success';
    return null;
});
</script>
