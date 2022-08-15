<template>
    <div class="bm-editor">
        <div class="columns is-gapless editor-content">
            <div
                class="column edit-content-wrapper"
                @mouseover="handleMouseOver('edit')"
            >
                <textarea
                    ref="editContent"
                    v-model="innerValue"
                    class="edit-content textarea is-danger"
                    :placeholder="placeholder"
                    @scroll="handleScroll"
                />
            </div>
            <div
                class="column preview-content-wrapper"
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
import { onDeactivated } from 'vue'

const { $marked } = useNuxtApp()
interface Props {
    modelValue?: string
    label?: string
    placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: '',
    placeholder: ''
})

const emit = defineEmits(['update:modelValue'])

const debouncedInnerValue = ref('')
const timeout = ref(null)
const scrollType = ref(null)

// HTML element refs
const editContent = ref(null)
const previewContent = ref(null)

const innerValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const markedHtml = computed(() => {
    if (innerValue.value)
        return $marked.markdownToHtml(debouncedInnerValue.value)
    /* eslint-disable no-useless-escape */
    return $marked.markdownToHtml(
        '# Jak formátovat text? \n\nDo šedého okna můžeš psát text, který lze formátovat **Markdown** syntaxí. Náhled formátovaného textu se zobrazí v tomto okně. Tato nápověda zmizí, jakmile něco napíšeš - lze ji vrátit smazáním tvého textu. \n\n\# Co je to markdown? \n\nMarkdown umožňuje pomocí jednoduchých formátovacích značek (např. \#, \*, -, atd.) vyznačit v textu nadpisy, seznamy, tučný text, odkazy apod. \n\n# A jaké formátování můžeš používat? \n\n**tučný text** : `**tučný text**` \n\n_kurzíva_ : `*kurzíva*` \n\n[odkaz](http://www.google.com) : `[Text odkazu](http://www.adresa-odkazu.com)` \n\n# Nadpis : `# Nadpis` \n\n-   odrážkový list : `- text (pomlčka mezera text)` \n\n1. číslovaný list : `1. text (číslo tečka mezera text)` \n\n> text v bloku : `> Text v bloku` \n\nVíce informací o markdown najdeš [tady](https://jecas.cz/markdown) nebo [tady](https://www.markdownguide.org/). Ne všechno je u nás ale povoleno - například nejde vkládat obrázky nebo psát přímo HTML kód (nechceme tady z toho mít holubník, žejo).\n\n'
    )
})

watch(innerValue, (value) => {
    if (timeout.value) clearTimeout(timeout.value)
    timeout.value = setTimeout(() => {
        debouncedInnerValue.value = value
    }, 500)
})

onMounted(() => {
    debouncedInnerValue.value = innerValue.value
    editContent.value.addEventListener('scroll', handleScroll, true)
    previewContent.value.addEventListener('scroll', handleScroll, true)
})
onDeactivated(() => {
    clearInterval(timeout.value)
    editContent.value.removeEventListener('scroll', handleScroll, true)
    previewContent.value.removeEventListener('scroll', handleScroll, true)
})

function handleScroll() {
    const editScroll = editContent.value.scrollTop
    const previewScroll = previewContent.value.scrollTop
    const editScrollMax =
        editContent.value.scrollHeight - editContent.value.offsetHeight
    const previewScrollMax =
        previewContent.value.scrollHeight - previewContent.value.offsetHeight
    if (scrollType.value === 'edit') {
        previewContent.value.scrollTop =
            previewScrollMax * (editScroll / editScrollMax)
    } else if (scrollType.value === 'preview') {
        editContent.value.scrollTop =
            editScrollMax * (previewScroll / previewScrollMax)
    }
}
function handleMouseOver(type) {
    scrollType.value = type
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/_variables.scss';

.bm-editor {
    border: 1px solid;
    border-color: $grey-lighter;
    border-radius: $radius;

    .editor-content {
        height: 500px;

        @include mobile {
            height: 600px;
        }

        .edit-content-wrapper {
            height: 100%;

            @include mobile {
                height: 50%;
            }

            .textarea {
                height: 100%;
                width: 100%;
                resize: none;
                border: none;
                background: #eee;
                box-shadow: none;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                border-right: 1px solid;
                border-right-color: $grey-lighter;

                @include mobile {
                    border-right: none;
                    border-bottom: 2px solid;
                    border-bottom-color: $grey-lighter;
                }
            }
        }

        .preview-content-wrapper {
            height: 100%;

            @include mobile {
                height: 50%;
            }

            .preview-content {
                height: 100%;
                overflow: auto;
                padding: $control-padding-horizontal;
            }
        }
    }
}
</style>
