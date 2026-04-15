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
        <o-taginput
            v-model="fieldValue"
            :options="filteredTags"
            :autocomplete="props.autocomplete"
            :allow-new="props.allowNew"
            :open-on-focus="props.openOnFocus"
            :field="props.field"
            :icon="props.icon"
            :placeholder="props.placeholder"
            :maxitems="props.maxTags"
            :expanded="props.expanded"
            @typing="(text: string) => (searchTerm = text)"
        >
        </o-taginput>
    </o-field>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useField, type RuleExpression } from 'vee-validate';
const { $i18n } = useNuxtApp();

interface TagItem {
    value: string | number;
    label: string;
}

interface Props {
    name?: string;
    label?: string;
    placeholder?: string;
    expanded?: boolean;
    icon?: string;
    autocomplete?: boolean;
    allowNew?: boolean;
    openOnFocus?: boolean;
    field: string;
    maxTags?: number;
    tags: Array<TagItem>;
    disabled?: boolean;
    hidden?: boolean;
    help?: string;
    isValidationOn?: boolean;
    validationRules?: RuleExpression<any>;
}

const modelValue = defineModel<number[]>();
const searchTerm = ref('');

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    name: 'input',
    label: '',
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
    isValidationOn: true
});

const filteredTags = computed(() => {
    if (!props.tags) return [];

    if (!searchTerm.value) return props.tags;

    const s = searchTerm.value.toLowerCase();

    return props.tags.filter((tag) => tag.label.toLowerCase().includes(s));
});

const nameRef = toRef(props, 'name');
//TODO - meta touched is not working, find out why
const { errorMessage, value: fieldValue } = useField(
    nameRef,
    props.validationRules,
    {
        initialValue: modelValue.value
    }
);

watch(
    modelValue,
    (val) => {
        if (val !== fieldValue.value) {
            fieldValue.value = val ?? '';
        }
    },
    { immediate: true }
);

watch(fieldValue, (val) => {
    if (val !== modelValue.value) {
        modelValue.value = val;
    }
});

const visibilityStyle = computed(() => {
    if (props.hidden) {
        return { display: 'none' };
    }
    return { display: 'default' };
});

const getFieldVariant = computed(() => {
    if (props.isValidationOn && !_.isNil(errorMessage.value)) return 'danger';
    if (props.isValidationOn && !errorMessage.value) return 'success';
    return null;
});
</script>

<style lang="scss" scoped>
.autocomplete .dropdown-content {
    flex-basis: 100% !important;
}
</style>
