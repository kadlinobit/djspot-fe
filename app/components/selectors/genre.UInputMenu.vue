<template>
    <UInputMenu
        v-model="model"
        :items="formStore.genresOptions"
        multiple
        value-key="value"
        label-key="label"
        :placeholder="$i18n.t('dj.select_3_genres')"
    />
</template>

<script setup lang="ts">
import { useFormStore } from '~/stores';

const model = defineModel<string[]>();

const { $i18n } = useNuxtApp();
const formStore = useFormStore();

onMounted(() => formStore.fetchGenres());
</script>
