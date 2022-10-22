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
        <o-select
            v-model="fieldValue"
            :placeholder="props.placeholder"
            :expanded="props.expanded"
            :disabled="props.disabled"
            :name="props.name"
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

<script setup lang="ts">
import _ from 'lodash'
import { useField } from 'vee-validate'
const { $i18n } = useNuxtApp()

interface SelectOptionsItem {
    value: string
    label: string
}

interface Props {
    modelValue: string | number | null
    name?: string
    label?: string
    placeholder?: string
    expanded?: boolean
    options: Array<SelectOptionsItem>
    disabled?: boolean
    hidden?: boolean
    help?: string
    isValidationOn?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    name: 'input',
    label: 'label',
    placeholder: null,
    expanded: true,
    options: () => [],
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
