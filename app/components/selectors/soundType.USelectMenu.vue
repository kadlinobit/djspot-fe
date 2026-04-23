<template>
    <USelectMenu
        v-model="model"
        :items="soundTypeOptionsTranslated"
        value-key="value"
        :placeholder="placeholder ?? $i18n.t('sound.all_types')"
        clear
        :reset-model-value-on-clear="false"
        @clear="$emit('clear')"
    />
</template>

<script setup lang="ts">
import { useFormStore } from '~/stores';

const model = defineModel<string | undefined>();

const props = defineProps<{
    placeholder?: string;
}>();

defineEmits<{
    clear: [];
}>();

const { $i18n } = useNuxtApp();
const formStore = useFormStore();

const soundTypeOptionsTranslated = computed(() =>
    formStore.soundTypeOptions.map((opt) => ({
        ...opt,
        label: $i18n.t(opt.label)
    }))
);
</script>
