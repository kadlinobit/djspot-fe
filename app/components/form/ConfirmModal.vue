<template>
    <div>
        <div class="flex items-start gap-4 p-4">
            <UIcon
                v-if="hasIcon"
                name="i-heroicons-exclamation-circle"
                class="mt-0.5 size-6 shrink-0 text-primary"
            />
            <p>{{ message }}</p>
        </div>

        <div class="flex justify-end gap-2 border-t border-gray-200 p-4 dark:border-gray-800">
            <UButton color="neutral" variant="subtle" @click="close">
                {{ cancelText }}
            </UButton>
            <UButton color="neutral" variant="solid" @click="confirmAndClose">
                {{ confirmText }}
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])

interface Props {
    title?: string
    hasIcon?: boolean
    message?: string
    cancelText?: string
    confirmText?: string
    onConfirm?: Function
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Confirm',
    hasIcon: true,
    message: 'Are you sure you want to do this?',
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    onConfirm: () => {}
})

function confirmAndClose() {
    props.onConfirm()
    close()
}
function close() {
    emit('close')
}
</script>
