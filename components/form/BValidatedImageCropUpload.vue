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
                    v-if="!value || (value && errors[0])"
                    expanded
                    drag-drop
                    :value="value"
                    @input="(imageValue) => $emit('input', imageValue)"
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
                <div v-if="value && value !== 'keep-current' && !errors[0]">
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
                            maxHeight: 2048,
                            maxWidth: 2048
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
        onRemoveImage: {
            type: Function,
            required: true
        },
        onKeepCurrentImage: {
            type: Function,
            required: false,
            default: () => {}
        },
        onCroppedImageChange: {
            type: Function,
            required: false,
            default: () => {}
        }
    },
    data() {
        return {
            file: null,
            photoUrl: null
        }
    },
    watch: {
        value(photoFile) {
            if (!photoFile || photoFile === 'keep-current') {
                this.photoUrl = null
                return
            }
            try {
                this.photoUrl = URL.createObjectURL(photoFile)
            } catch (e) {
                this.photoUrl = null
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.cropper {
    max-width: 100%;
}
</style>
