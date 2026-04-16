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
import _ from 'lodash';
import { useField, type RuleExpression } from 'vee-validate';
import BmEditor from '~/components/editor/BmEditor.vue';

const { $i18n } = useNuxtApp();

interface Props {
    name?: string;
    type?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    hidden?: boolean;
    help?: string;
    isValidationOn?: boolean;
    validationRules?: RuleExpression<string>;
}

const modelValue = defineModel<string>();

const props = withDefaults(defineProps<Props>(), {
    name: 'input',
    type: 'text',
    label: 'label',
    disabled: false,
    hidden: false,
    isValidationOn: true
});

const nameRef = toRef(props, 'name');
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
