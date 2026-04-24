<template>
    <div class="bm-editor">
        <div class="editor-content flex">
            <div
                class="edit-content-wrapper flex-1"
                @mouseover="handleMouseOver('edit')"
            >
                <textarea
                    ref="editContent"
                    v-model="innerValue"
                    class="edit-content textarea"
                    :placeholder="placeholder"
                    @scroll="handleScroll"
                />
            </div>
            <div
                class="preview-content-wrapper flex-1"
                @mouseover="handleMouseOver('preview')"
            >
                <div
                    ref="previewContent"
                    class="preview-content content"
                    v-html="markedHtml"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onDeactivated } from 'vue';

const { $marked } = useNuxtApp();
interface Props {
    modelValue?: string;
    label?: string;
    placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: '',
    placeholder: ''
});

const emit = defineEmits(['update:modelValue']);

const debouncedInnerValue = ref('');
const timeout = ref(null);
const scrollType = ref(null);

// HTML element refs
const editContent = ref(null);
const previewContent = ref(null);

const innerValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const markedHtml = computed(() => {
    if (innerValue.value)
        return $marked.markdownToHtml(debouncedInnerValue.value);
    /* eslint-disable no-useless-escape */
    return $marked.markdownToHtml(
        '# Jak formátovat text? \n\nDo šedého okna můžeš psát text, který lze formátovat **Markdown** syntaxí. Náhled formátovaného textu se zobrazí v tomto okně. Tato nápověda zmizí, jakmile něco napíšeš - lze ji vrátit smazáním tvého textu. \n\n\# Co je to markdown? \n\nMarkdown umožňuje pomocí jednoduchých formátovacích značek (např. \#, \*, -, atd.) vyznačit v textu nadpisy, seznamy, tučný text, odkazy apod. \n\n# A jaké formátování můžeš používat? \n\n**tučný text** : `**tučný text**` \n\n_kurzíva_ : `*kurzíva*` \n\n[odkaz](http://www.google.com) : `[Text odkazu](http://www.adresa-odkazu.com)` \n\n# Nadpis : `# Nadpis` \n\n-   odrážkový list : `- text (pomlčka mezera text)` \n\n1. číslovaný list : `1. text (číslo tečka mezera text)` \n\n> text v bloku : `> Text v bloku` \n\nVíce informací o markdown najdeš [tady](https://jecas.cz/markdown) nebo [tady](https://www.markdownguide.org/). Ne všechno je u nás ale povoleno - například nejde vkládat obrázky nebo psát přímo HTML kód (nechceme tady z toho mít holubník, žejo).\n\n'
    );
});

watch(innerValue, (value) => {
    if (timeout.value) clearTimeout(timeout.value);
    timeout.value = setTimeout(() => {
        debouncedInnerValue.value = value;
    }, 500);
});

onMounted(() => {
    debouncedInnerValue.value = innerValue.value;
    editContent.value.addEventListener('scroll', handleScroll, true);
    previewContent.value.addEventListener('scroll', handleScroll, true);
});
onDeactivated(() => {
    clearInterval(timeout.value);
    editContent.value.removeEventListener('scroll', handleScroll, true);
    previewContent.value.removeEventListener('scroll', handleScroll, true);
});

function handleScroll() {
    const editScroll = editContent.value.scrollTop;
    const previewScroll = previewContent.value.scrollTop;
    const editScrollMax =
        editContent.value.scrollHeight - editContent.value.offsetHeight;
    const previewScrollMax =
        previewContent.value.scrollHeight - previewContent.value.offsetHeight;
    if (scrollType.value === 'edit') {
        previewContent.value.scrollTop =
            previewScrollMax * (editScroll / editScrollMax);
    } else if (scrollType.value === 'preview') {
        editContent.value.scrollTop =
            editScrollMax * (previewScroll / previewScrollMax);
    }
}
function handleMouseOver(type) {
    scrollType.value = type;
}
</script>

<style lang="scss" scoped>
// @import '~/assets/scss/_variables.scss';

.bm-editor {
    $grey-lighter: #999;
    $radius: 5px;
    $control-padding-horizontal: 0.5em;

    border: 1px solid;
    border-color: $grey-lighter;
    border-radius: $radius;

    .editor-content {
        height: 500px;

        // @include mobile {
        //     height: 600px;
        // }

        .edit-content-wrapper {
            height: 100%;

            .textarea {
                height: 100%;
                width: 100%;
                resize: none;
                border: none;
                outline: none;
                box-shadow: none;
                border-radius: 0;
                background: transparent;
                padding: $control-padding-horizontal;
                border-right: 1px solid;
                border-right-color: $grey-lighter;
            }
        }

        .preview-content-wrapper {
            height: 100%;

            .preview-content {
                height: 100%;
                overflow: auto;
                padding: $control-padding-horizontal;

                :deep(h1),
                :deep(h2),
                :deep(h3),
                :deep(h4),
                :deep(h5),
                :deep(h6) {
                    font-weight: 700;
                    margin-top: 0.75em;
                    margin-bottom: 0.25em;
                    line-height: 1.25;
                }
                :deep(h1) { font-size: 1.75em; }
                :deep(h2) { font-size: 1.4em; }
                :deep(h3) { font-size: 1.2em; }

                :deep(p) {
                    margin-bottom: 0.75em;
                }

                :deep(strong) { font-weight: 700; }
                :deep(em) { font-style: italic; }

                :deep(ul) {
                    list-style-type: disc;
                    margin-left: 1.5em;
                    margin-bottom: 0.75em;
                }
                :deep(ol) {
                    list-style-type: decimal;
                    margin-left: 1.5em;
                    margin-bottom: 0.75em;
                }
                :deep(li) { margin-bottom: 0.25em; }

                :deep(code) {
                    font-family: monospace;
                    background: rgba(127, 127, 127, 0.15);
                    padding: 0.1em 0.3em;
                    border-radius: 3px;
                    font-size: 0.9em;
                    color: #e06c75;
                }

                :deep(pre) {
                    background: rgba(127, 127, 127, 0.1);
                    padding: 0.75em;
                    border-radius: 4px;
                    overflow-x: auto;
                    margin-bottom: 0.75em;

                    code {
                        background: none;
                        padding: 0;
                        color: inherit;
                    }
                }

                :deep(blockquote) {
                    border-left: 3px solid $grey-lighter;
                    padding-left: 0.75em;
                    margin-left: 0;
                    margin-bottom: 0.75em;
                    opacity: 0.8;
                }

                :deep(a) {
                    color: #3273dc;
                    text-decoration: underline;
                }

                :deep(hr) {
                    border: none;
                    border-top: 1px solid $grey-lighter;
                    margin: 1em 0;
                }
            }
        }
    }
}
</style>
