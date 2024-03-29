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
        <o-inputitems
            v-model="fieldValue"
            :data="filteredTags"
            :autocomplete="props.autocomplete"
            :allow-new="props.allowNew"
            :open-on-focus="props.openOnFocus"
            :field="props.field"
            :icon="props.icon"
            :placeholder="props.placeholder"
            :maxitems="props.maxTags"
            :expanded="props.expanded"
            @typing="getFilteredTags"
        >
        </o-inputitems>
    </o-field>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useField } from 'vee-validate'
const { $i18n } = useNuxtApp()

interface TagItem {
    value: string
    label: string
}

interface Props {
    modelValue: any
    name?: string
    label?: string
    placeholder?: string
    expanded?: boolean
    icon?: string
    autocomplete?: boolean
    allowNew?: boolean
    openOnFocus?: boolean
    field: string
    maxTags?: number
    tags: Array<TagItem> | null
    disabled?: boolean
    hidden?: boolean
    help?: string
    isValidationOn?: boolean
    validationRules?: Object | undefined | null
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    name: 'input',
    label: '',
    placeholder: null,
    expanded: true,
    icon: 'tag',
    autocomplete: true,
    allowNew: false,
    openOnFocus: true,
    field: '',
    maxTags: 0,
    tags: () => [],
    disabled: false,
    hidden: false,
    help: null,
    isValidationOn: true,
    validationRules: undefined
})

const filteredTags = ref([])

// Do we need this watch????
// watch(props.tags, () => getFilteredTags(''))

function getFilteredTags(text = '') {
    if (props.tags && Array.isArray(props.tags)) {
        filteredTags.value = props.tags.filter((tag) => {
            return tag[props.field]
                .toString()
                .toLowerCase()
                .includes(text.toLowerCase())
        })
    }
}

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

<style lang="scss" scoped>
.autocomplete .dropdown-content {
    flex-basis: 100% !important;
}
</style>
