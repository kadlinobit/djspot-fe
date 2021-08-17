<template>
    <ValidationProvider v-slot="{ errors, valid }" :vid="vid" :name="name" :rules="rules" slim>
        <b-field
            :label="label"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="$t(errors[0])"
        >
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
            required: true
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
        }
    }
}
</script>
