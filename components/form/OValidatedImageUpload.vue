<template>
    <div>
        <o-field
            :label="label"
            :class="{ 'has-name': !!value }"
            :variant="getFieldVariant(errors, valid)"
            :message="errors[0]"
        >
            <div v-if="currentImage && value === 'keep-current'">
                <o-image :src="`http://localhost:1337${currentImage.url}`" />
            </div>
            <o-upload
                v-else
                expanded
                drag-drop
                :value="value"
                @input="(value) => $emit('input', value)"
            >
                <section class="section">
                    <div class="content has-text-centered">
                        <div v-if="!value || (value && errors[0])">
                            <p>
                                <o-icon icon="upload" size="large"> </o-icon>
                            </p>
                            <p>Drop your files here or click to upload</p>
                        </div>
                        <div v-if="value && !errors[0]">
                            <o-image :src="photoUrl" />
                        </div>
                    </div>
                </section>
            </o-upload>
        </o-field>
        <o-field v-if="value || currentImage" grouped position="is-right">
            <o-button v-if="value" variant="danger" @click.stop="onRemoveImage">
                {{
                    value === 'keep-current'
                        ? $t('dj.remove_current_photo')
                        : $t('dj.remove_photo')
                }}
            </o-button>
            <o-button
                v-if="currentImage && value !== 'keep-current'"
                variant="info"
                @click.prevent="onKeepCurrentImage"
            >
                {{ $t('dj.keep_current_photo') }}
            </o-button>
        </o-field>
    </div>
</template>

<script>
export default {
    middleware: ['auth'],
    props: {
        value: {
            default: null
        },
        currentImage: {
            type: [Object],
            default: null
        },
        name: {
            type: String,
            default: 'input'
        },
        label: {
            type: String,
            required: true
        },
        rules: {
            type: [Object, String],
            default: ''
        },
        isValidationOn: {
            type: Boolean,
            default: true
        },
        onRemoveImage: {
            type: Function,
            required: true
        },
        onKeepCurrentImage: {
            type: Function,
            required: false,
            default: () => {}
        }
    },
    data() {
        return {
            photoUrl: null
        }
    },
    watch: {
        value(photoFile) {
            if (!photoFile) {
                this.photoUrl = null
                return
            }
            try {
                this.photoUrl = URL.createObjectURL(photoFile)
            } catch (e) {
                this.photoUrl = null
            }
        }
    },
    methods: {
        getFieldVariant(errors, valid) {
            if (this.isValidationOn && !!errors[0]) return 'danger'
            if (this.isValidationOn && valid) return 'success'
            return null
        }
    }
}
</script>
