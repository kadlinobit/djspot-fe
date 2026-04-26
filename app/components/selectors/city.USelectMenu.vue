<template>
    <USelectMenu
        v-model="model"
        :items="formStore.citiesOptions"
        value-key="value"
        :placeholder="$i18n.t('dj.select_city')"
        clear
        :reset-model-value-on-clear="false"
        @clear="$emit('clear')"
    />
</template>

<script setup lang="ts">
import { useFormStore } from '~/stores';

const model = defineModel<string | undefined>();

defineEmits<{
    clear: [];
}>();

const { $i18n } = useNuxtApp();
const formStore = useFormStore();

onMounted(() => formStore.fetchCities());
</script>
