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
                <b-upload
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
            <b-field v-if="value" grouped position="is-right">
                <b-button type="is-danger" @click.prevent="onRemovePhoto"
                    >{{ $t('dj.remove_photo') }}
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
    props: {
        value: {
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
        onRemovePhoto: {
            type: Function,
            required: true
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

            this.photoUrl = URL.createObjectURL(photoFile)
        }
    }
}
</script>
