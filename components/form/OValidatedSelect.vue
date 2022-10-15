<template>
    <o-field
        :label="label"
        :variant="getFieldVariant(errors, valid)"
        :message="$t(errors[0])"
    >
        <o-select
            :value="value"
            :placeholder="placeholder"
            :expanded="expanded"
            @input="(value) => $emit('input', value)"
        >
            <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
            >
                {{ option.label }}
            </option>
        </o-select>
    </o-field>
</template>

<script>
export default {
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
        },
        isValidationOn: {
            type: Boolean,
            default: true
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
