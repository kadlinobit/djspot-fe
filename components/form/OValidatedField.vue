<template>
    <o-field
        :label="label"
        :variant="getFieldVariant"
        :message="errorMessage ? $i18n.t(errorMessage) : null"
        :style="visibilityStyle"
    >
        <template v-if="help" #label>
            {{ label }}
            <o-tooltip variant="dark" :label="help" multilined>
                <o-icon size="small" icon="help-circle-outline"></o-icon>
            </o-tooltip>
        </template>
        <o-input
            :v-model="value"
            :placeholder="props.placeholder"
            :type="props.type"
            :use-html5-validation="false"
            :disabled="props.disabled"
            :name="props.name"
            @input="(val) => emit('update:modelValue', val)"
        />
    </o-field>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useField } from 'vee-validate'
const { $i18n } = useNuxtApp()

const emit = defineEmits(['update:modelValue'])

interface Props {
    modelValue: string
    name?: string
    type?: string
    label?: string
    placeholder?: string
    disabled?: boolean
    hidden?: boolean
    help?: string
    isValidationOn?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    name: 'input',
    type: 'text',
    label: 'label',
    placeholder: null,
    disabled: false,
    hidden: false,
    help: null,
    isValidationOn: true
})

const nameRef = toRef(props, 'name')
const { errorMessage, value, meta } = useField(nameRef)

const visibilityStyle = computed(() => {
    if (props.hidden) {
        return { display: 'none' }
    }
    return { display: 'default' }
})

const getFieldVariant = computed(() => {
    if (props.isValidationOn && !_.isNil(errorMessage.value)) return 'danger'
    if (props.isValidationOn && !errorMessage.value) return 'success'
    return null
})
</script>
