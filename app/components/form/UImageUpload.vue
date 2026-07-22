<template>
    <div class="space-y-4">
        <div
            v-if="currentImage && modelValue === 'keep-current'"
            class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
        >
            <img
                :src="`/directus/assets/${currentImage}`"
                class="block h-auto w-full"
            >
        </div>

        <div
            v-else-if="!file || (file && error)"
            class="relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-primary-500 dark:border-gray-700"
            :class="{
                'border-primary-500 bg-primary-50 dark:bg-primary-950/20':
                    isDragging
            }"
            @click="triggerFileInput"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
        >
            <input
                ref="fileInput"
                type="file"
                class="hidden"
                accept="image/*"
                @change="onFileChange"
            >
            <UIcon
                name="i-heroicons-cloud-arrow-up"
                class="mb-3 h-10 w-10 text-gray-400"
            />
            <p class="text-sm text-gray-600 dark:text-gray-400">
                {{
                    isDragging
                        ? 'Drop to upload'
                        : 'Drop your files here or click to upload'
                }}
            </p>
        </div>

        <div
            v-else-if="photoUrl && modelValue !== 'keep-current' && !error"
            class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
        >
            <img :src="photoUrl" class="block h-auto w-full">
        </div>

        <div v-if="modelValue || currentImage" class="flex justify-end gap-2">
            <UButton
                v-if="modelValue"
                color="error"
                variant="subtle"
                @click.stop="onRemoveImage"
            >
                {{
                    modelValue === 'keep-current'
                        ? $t('dj.remove_current_photo')
                        : $t('dj.remove_photo')
                }}
            </UButton>
            <UButton
                v-if="currentImage && modelValue !== 'keep-current'"
                color="primary"
                variant="subtle"
                @click.stop="onKeepCurrentImage"
            >
                {{ $t('dj.keep_current_photo') }}
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
export type ImageUploadModelValue = File | 'keep-current' | null;

interface Props {
    currentImage?: string | object | null;
    error?: string;
}

const modelValue = defineModel<ImageUploadModelValue>({ default: null });
const props = defineProps<Props>();

const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);
const photoUrl = ref<string>();
const isDragging = ref(false);

function triggerFileInput() {
    fileInput.value?.click();
}

function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
        processFile(input.files[0]);
    }
}

function onDrop(event: DragEvent) {
    isDragging.value = false;
    if (event.dataTransfer?.files.length) {
        processFile(event.dataTransfer.files[0]);
    }
}

function processFile(selectedFile: File) {
    file.value = selectedFile;
    modelValue.value = selectedFile;
    if (selectedFile.type.startsWith('image/')) {
        photoUrl.value = URL.createObjectURL(selectedFile);
    }
}

function onRemoveImage() {
    file.value = null;
    modelValue.value = null;
    photoUrl.value = undefined;
}

function onKeepCurrentImage() {
    file.value = null;
    modelValue.value = 'keep-current';
    photoUrl.value = undefined;
}
</script>
