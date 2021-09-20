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
                                    <b-icon icon="upload" size="is-large"> </b-icon>
                                </p>
                                <p>Drop your files here or click to upload</p>
                            </div>
                            <div v-if="value && !errors[0]">
                                <b-image :src="photoUrl" />
                            </div>
                        </div>
                    </section>
                </b-upload>
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

export default {
    components: {
        ValidationProvider
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
    }
}
</script>
