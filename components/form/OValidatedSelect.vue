<template>
    <ValidationProvider v-slot="{ errors, valid }" :vid="vid" :name="name" :rules="rules" slim>
        <o-field
            :label="label"
            :variant="{ danger: !!errors[0], success: valid }"
            :message="$t(errors[0])"
        >
            <o-select
                :value="value"
                :placeholder="placeholder"
                :expanded="expanded"
                @input="(value) => $emit('input', value)"
            >
                <option v-for="option in options" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </o-select>
        </o-field>
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
        label: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            default: ''
        },
        expanded: {
            type: Boolean,
            default: true
        },
        options: {
            type: Array,
            required: true
        },
        rules: {
            type: [Object, String],
            default: ''
        }
    }
}
</script>
