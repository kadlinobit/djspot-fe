<template>
    <ValidationProvider v-slot="{ errors, valid }" :vid="vid" :name="name" :rules="rules" slim>
        <o-field
            :label="label"
            :variant="{ danger: !!errors[0], success: valid }"
            :message="$t(errors[0])"
            :style="visibilityStyle"
        >
            <template v-if="help" #label>
                {{ label }}
                <o-tooltip variant="dark" :label="help" multilined>
                    <o-icon size="small" icon="help-circle-outline"></o-icon>
                </o-tooltip>
            </template>

            <div class="control">
                <bm-editor
                    :value="value"
                    :placeholder="placeholder"
                    @input="(value) => $emit('input', value)"
                />
            </div>
        </o-field>
    </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import BmEditor from '~/components/editor/BmEditor.vue'

export default {
    components: {
        ValidationProvider,
        BmEditor
    },
    props: {
        vid: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: 'input'
        },
        type: {
            type: String,
            default: 'text'
        },
        label: {
            type: String,
            default: 'label'
        },
        placeholder: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        rules: {
            type: [Object, String],
            default: ''
        },
        hidden: {
            type: Boolean,
            default: false
        },
        help: {
            type: String,
            default: null
        }
    },
    computed: {
        visibilityStyle() {
            if (this.hidden) {
                return { display: 'none' }
            }
            return { display: 'default' }
        }
    }
}
</script>
