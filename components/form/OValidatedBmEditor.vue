<template>
    <o-field
        :label="props.label"
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

        <div class="control">
            <bm-editor :placeholder="placeholder" v-model="fieldValue" />
        </div>
    </o-field>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useField } from 'vee-validate'
import BmEditor from '~/components/editor/BmEditor.vue'

const { $i18n } = useNuxtApp()

interface Props {
    modelValue: string | null
    name?: string
    type?: string
    label?: string
    placeholder?: string
    disabled?: boolean
    hidden?: boolean
    help?: string
    isValidationOn?: boolean
    validationRules?: Object | undefined | null
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
    isValidationOn: true,
    validationRules: undefined
})

const nameRef = toRef(props, 'name')
//TODO - meta touched is not working, find out why
const { errorMessage, value: fieldValue } = useField(
    nameRef,
    props.validationRules,
    {
        initialValue: props.modelValue
    }
)

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
