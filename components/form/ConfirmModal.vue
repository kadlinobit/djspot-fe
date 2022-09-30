<template>
    <div class="modal-card animation-content">
        <header class="modal-card-head">
            <p class="modal-card-title">{{ title }}</p>
        </header>
        <section class="modal-card-body is-flex">
            <div class="media">
                <div v-if="hasIcon" class="media-left">
                    <o-icon :icon="icon" size="large" variant="danger" />
                </div>
                <div class="media-content">
                    <p>
                        <span>{{ message }}</span>
                    </p>
                </div>
            </div>
        </section>
        <footer class="modal-card-foot">
            <button type="button" class="button" @click="close">
                <span>{{ cancelText }}</span>
            </button>
            <button
                type="button"
                class="button is-danger"
                @click="confirmAndClose"
            >
                <span>{{ confirmText }}</span>
            </button>
        </footer>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])

interface Props {
    title?: string
    hasIcon?: boolean
    icon?: string
    message?: string
    cancelText?: string
    confirmText?: string
    onConfirm?: Function
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Confirm',
    hasIcon: true,
    icon: 'alert-circle',
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
