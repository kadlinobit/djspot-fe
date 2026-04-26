<template>
    <UModal :title="title" :dismissible="false">
        <template #body>
            <div class="flex items-start gap-4">
                <UIcon
                    v-if="hasIcon"
                    name="i-heroicons-exclamation-circle"
                    class="mt-0.5 size-6 shrink-0 text-primary"
                />
                <p>{{ message }}</p>
            </div>
        </template>
        <template #footer>
            <div class="flex w-full justify-end gap-2">
                <UButton color="neutral" variant="subtle" @click="emit('close', false)">
                    {{ cancelText }}
                </UButton>
                <UButton color="neutral" variant="solid" @click="emit('close', true)">
                    {{ confirmText }}
                </UButton>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
const emit = defineEmits<{
    close: [value: boolean]
}>()

interface Props {
    title?: string
    hasIcon?: boolean
    message?: string
    cancelText?: string
    confirmText?: string
}

withDefaults(defineProps<Props>(), {
    title: 'Confirm',
    hasIcon: true,
    message: 'Are you sure you want to do this?',
    cancelText: 'Cancel',
    confirmText: 'Confirm',
})
</script>
