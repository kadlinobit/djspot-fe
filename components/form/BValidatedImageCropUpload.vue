<template>
    <ValidationProvider
        v-slot="{ errors, valid }"
        ref="imageValidator"
        :name="name"
        :rules="rules"
        slim
    >
        <div>
            <b-field
                :label="label"
                :class="{ 'has-name': !!value }"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
            >
                <div v-if="currentImage && value === 'keep-current'">
                    <b-image :src="`http://localhost:1337${currentImage.url}`" />
                </div>
                <b-upload
                    v-else-if="!file || (file && errors[0])"
                    v-model="file"
                    expanded
                    drag-drop
                >
                    <section class="section">
                        <div class="content has-text-centered">
                            <div>
                                <p>
                                    <b-icon icon="upload" size="is-large"> </b-icon>
                                </p>
                                <p>Drop your files here or click to upload</p>
                            </div>
                        </div>
                    </section>
                </b-upload>
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
            </b-field>
            <b-field v-if="value || currentImage" grouped position="is-right">
                <b-button v-if="value" type="is-danger" @click.prevent="onRemoveImage">
                    {{
                        value === 'keep-current'
                            ? $t('dj.remove_current_photo')
                            : $t('dj.remove_photo')
                    }}
                </b-button>
                <b-button
                    v-if="currentImage && value !== 'keep-current'"
                    type="is-info"
                    @click.prevent="onKeepCurrentImage"
                >
                    {{ $t('dj.keep_current_photo') }}
                </b-button>
            </b-field>
        </div>
    </ValidationProvider>
</template>

<script>
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
        }
    }
}
</script>
