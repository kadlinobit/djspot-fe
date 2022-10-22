<template>
    <o-field
        :label="props.label"
        :variant="getFieldVariant"
        :message="errorMessage ? $i18n.t(errorMessage) : null"
        :style="visibilityStyle"
    >
        <template v-if="props.help" #label>
            {{ label }}
            <o-tooltip variant="dark" :label="props.help" multilined>
                <o-icon size="small" icon="help-circle-outline"></o-icon>
            </o-tooltip>
        </template>
        <o-input
            v-model="fieldValue"
            :placeholder="props.placeholder"
            :type="props.type"
            :use-html5-validation="false"
            :disabled="props.disabled"
            :name="props.name"
        />
    </o-field>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useField } from 'vee-validate'

// TODO - emit to update model value is probably not needed, as vee-validate useField does it automatically
// const emit = defineEmits(['update:modelValue'])

interface Props {
    modelValue: string | number | null
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
//TODO - meta touched is not working, find out why
const { errorMessage, value: fieldValue } = useField(nameRef, undefined, {
    initialValue: props.modelValue
})

// TODO - we propably dont need onMounted, initialValue in useField is enough
// onMounted(() => {
//     fieldValue.value = props.modelValue
// })

// TODO - do we really need watch to emit update even? Seems like not
// watch(fieldValue, (val) => {
//     emit('update:modelValue', val)
// })

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
