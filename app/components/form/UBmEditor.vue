<template>
    <div class="bm-editor-wrapper">
        <bm-editor v-model="modelValue" :placeholder="placeholder" />
    </div>
</template>

<script setup lang="ts">
import BmEditor from '~/components/editor/BmEditor.vue';

interface Props {
    placeholder?: string;
}

const modelValue = defineModel<string>();

const props = withDefaults(defineProps<Props>(), {
    placeholder: ''
});
</script>
