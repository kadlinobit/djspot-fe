<template>
    <o-field
        :label="props.label"
        :variant="fieldVariant"
        :message="fieldMessage"
        :style="visibilityStyle"
    >
        <template v-if="props.help" #label>
            {{ label }}
            <o-tooltip variant="dark" :label="props.help" multilined>
                <o-icon size="small" icon="help-circle-outline"></o-icon>
            </o-tooltip>
        </template>
        <o-input
            expanded
            v-model="fieldValue"
            :placeholder="props.placeholder"
            :type="props.type"
            :use-html5-validation="false"
            :disabled="props.disabled"
        />
        <p v-if="controlButton" class="control">
            <o-button
                :variant="props.controlButtonVariant"
                :label="$i18n.t(props.controlButtonLabel)"
                @click="emit('controlButtonClicked')"
            />
        </p>
    </o-field>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useField, type RuleExpression } from 'vee-validate';

const { $i18n } = useNuxtApp();

// TODO - emit to update model value is probably not needed, as vee-validate useField does it automatically
const emit = defineEmits(['update:modelValue', 'controlButtonClicked']);

interface Props {
    name?: string;
    type?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    hidden?: boolean;
    help?: string;
    isValidationOn?: boolean;
    controlButton?: boolean;
    controlButtonLabel?: string;
    controlButtonVariant?: string;
    customMessage?: string;
    customMessageVariant?: string;
    validationRules?: RuleExpression<string>;
}

const props = withDefaults(defineProps<Props>(), {
    name: 'input',
    type: 'text',
    label: 'label',
    disabled: false,
    hidden: false,
    isValidationOn: true,
    controlButton: false,
    controlButtonLabel: 'Do something',
    controlButtonVariant: 'primary',
    customMessageVariant: 'warning'
});

const modelValue = defineModel<string>();

const nameRef = toRef(props, 'name');
//TODO - meta touched is not working, find out why
const {
    errorMessage,
    value: fieldValue,
    meta: fieldMeta
} = useField(nameRef, props.validationRules, {
    initialValue: modelValue.value
});

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

// If there is a custom message via prop, we display it, but only if there is no error message (error has higher priority)
const fieldMessage = computed(() => {
    if (!_.isNil(props.customMessage) && _.isNil(errorMessage.value))
        return $i18n.t(props.customMessage);
    if (!_.isNil(errorMessage.value)) return $i18n.t(errorMessage.value);
    return null;
});

const visibilityStyle = computed(() => {
    if (props.hidden) {
        return { display: 'none' };
    }
    return { display: 'default' };
});

const fieldVariant = computed(() => {
    if (!_.isNil(props.customMessage) && _.isNil(errorMessage.value))
        return props.customMessageVariant;
    if (props.isValidationOn && !fieldMeta.validated) return null;
    if (props.isValidationOn && !_.isNil(errorMessage.value)) return 'danger';
    if (props.isValidationOn && fieldMeta.valid) return 'success';
    return null;
});
</script>
