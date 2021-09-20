<template>
    <ValidationProvider v-slot="{ errors, valid }" :vid="vid" :name="name" :rules="rules" slim>
        <b-field
            :label="label"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="$t(errors[0])"
            :style="visibilityStyle"
        >
            <template v-if="help" #label>
                {{ label }}
                <b-tooltip type="is-dark" :label="help" multilined>
                    <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                </b-tooltip>
            </template>
            <b-input
                :value="value"
                :placeholder="placeholder"
                :type="type"
                :use-html5-validation="false"
                :disabled="disabled"
                @input="(value) => $emit('input', value)"
            />
        </b-field>
    </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
    components: {
        ValidationProvider
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
