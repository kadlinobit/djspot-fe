<template>
    <USelectMenu
        v-model="model"
        :items="radiusOptionsTranslated"
        value-key="value"
    />
</template>

<script setup lang="ts">
import { useFormStore } from '~/stores';

const model = defineModel<number>();

const { $i18n } = useNuxtApp();
const formStore = useFormStore();

const radiusOptionsTranslated = computed(() =>
    formStore.radiusOptions.map((opt) => ({
        ...opt,
        label: $i18n.t(opt.label)
    }))
);
</script>
