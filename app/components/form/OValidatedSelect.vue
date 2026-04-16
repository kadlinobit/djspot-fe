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
import _ from 'lodash';
import { useField, type RuleExpression } from 'vee-validate';
const { $i18n } = useNuxtApp();

interface SelectOptionsItem {
    value: string | number;
    label: string;
}

interface Props {
    name?: string;
    label?: string;
    placeholder?: string;
    expanded?: boolean;
    options: Array<SelectOptionsItem>;
    disabled?: boolean;
    hidden?: boolean;
    help?: string;
    isValidationOn?: boolean;
    validationRules?: RuleExpression<string | number | object>;
}

const modelValue = defineModel<string | number | object>();

const props = withDefaults(defineProps<Props>(), {
    name: 'input',
    label: 'label',
    expanded: true,
    options: () => [],
    disabled: false,
    hidden: false,
    isValidationOn: true
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
