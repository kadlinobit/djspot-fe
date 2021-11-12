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
            <button type="button" class="button is-danger" @click="confirmAndClose">
                <span>{{ confirmText }}</span>
            </button>
        </footer>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: 'Confirm'
        },
        hasIcon: {
            type: Boolean,
            default: true
        },
        icon: {
            type: String,
            default: 'alert-circle'
        },
        message: {
            type: String,
            default: 'Are you sure you want to do this?'
        },
        cancelText: {
            type: String,
            default: 'Cancel'
        },
        confirmText: {
            type: String,
            default: 'Confirm'
        },
        onConfirm: {
            type: Function,
            default: () => {}
        }
    },
    methods: {
        confirmAndClose() {
            this.onConfirm()
            this.close()
        },
        close() {
            this.$emit('close')
        }
    }
}
</script>
