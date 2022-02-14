<template>
    <ValidationProvider
        v-slot="{ errors, valid }"
        ref="imageValidator"
        :name="name"
        :rules="rules"
        slim
    >
        <div>
            <o-field
                :label="label"
                :class="{ 'has-name': !!value }"
                :variant="getFieldVariant(errors, valid)"
                :message="errors[0]"
            >
                <div v-if="currentImage && value === 'keep-current'">
                    <img :src="`http://localhost:8055/assets/${currentImage}`" />
                </div>
                <o-upload
                    v-else-if="!file || (file && errors[0])"
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
                <div v-else-if="photoUrl && value !== 'keep-current' && !errors[0]">
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
            <o-field v-if="value || currentImage" grouped position="is-right">
                <o-button v-if="value" variant="danger" @click.prevent="onRemoveImage">
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
    </ValidationProvider>
</template>

<script>
/**
 * TBD
 * - remove hardcoded URL http://localhost:8055/assets
 * - put canvas size somwehre to config
 */
import { ValidationProvider } from 'vee-validate'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

export default {
    components: {
        ValidationProvider,
        Cropper
    },
    middleware: ['auth'],
    props: {
        value: {
            default: null,
            type: [Object, String, null]
        },
        currentImage: {
            type: String,
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
        }
    },
    data() {
        return {
            file: null,
            photoUrl: null
        }
    },
    watch: {
        file(file) {
            if (!file || file === 'keep-current') {
                this.photoUrl = null
                return
            }
            try {
                this.photoUrl = URL.createObjectURL(file)
            } catch (e) {
                this.photoUrl = null
            }
        }
    },
    methods: {
        onCroppedImageChange(croppedImage) {
            this.$emit('input', { file: this.file, croppedImage })
        },
        onRemoveImage() {
            this.file = null
            this.$emit('input', null)
        },
        onKeepCurrentImage() {
            this.file = null
            this.$emit('input', 'keep-current')
        },
        getFieldVariant(errors, valid) {
            if (this.isValidationOn && !!errors[0]) return 'danger'
            if (this.isValidationOn && valid) return 'success'
            return null
        }
    }
}
</script>
