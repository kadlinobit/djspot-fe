<template>
    <UEditor
        v-model="modelValue"
        content-type="markdown"
        :image="false"
        :mention="false"
        :placeholder="placeholder"
        :ui="{
            root: 'border border-(--ui-border) rounded-md',
            content: 'my-2'
        }"
        class="w-full"
    >
        <template #default="{ editor }">
            <UEditorToolbar
                :editor="editor"
                :items="[
                    [
                        { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
                        {
                            kind: 'mark',
                            mark: 'italic',
                            icon: 'i-lucide-italic'
                        }
                    ],
                    [
                        {
                            kind: 'heading',
                            level: 1,
                            icon: 'i-lucide-heading-1'
                        },
                        {
                            kind: 'heading',
                            level: 2,
                            icon: 'i-lucide-heading-2'
                        },
                        {
                            kind: 'heading',
                            level: 3,
                            icon: 'i-lucide-heading-3'
                        }
                    ],
                    [
                        { kind: 'bulletList', icon: 'i-lucide-list' },
                        { kind: 'orderedList', icon: 'i-lucide-list-ordered' },
                        { kind: 'blockquote', icon: 'i-lucide-quote' }
                    ],
                    [{ kind: 'link', icon: 'i-lucide-link' }],
                    [
                        { kind: 'undo', icon: 'i-lucide-undo' },
                        { kind: 'redo', icon: 'i-lucide-redo' }
                    ]
                ]"
            />
        </template>
    </UEditor>
</template>

<script setup lang="ts">
interface Props {
    placeholder?: string;
}

withDefaults(defineProps<Props>(), {
    placeholder: ''
});

const modelValue = defineModel<string>();
</script>
