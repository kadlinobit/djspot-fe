<template>
    <div class="bm-editor">
        <div class="columns is-gapless editor-content">
            <div class="column edit-content-wrapper" @mouseover="handleMouseOver('edit')">
                <textarea
                    ref="editContent"
                    v-model="innerValue"
                    class="edit-content textarea is-danger"
                    :placeholder="placeholder"
                    @scroll="handleScroll"
                    @input="$emit('input', innerValue)"
                />
            </div>
            <div class="column preview-content-wrapper" @mouseover="handleMouseOver('preview')">
                <div ref="previewContent" class="preview-content content" v-html="markedHtml" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            innerValue: '',
            debouncedInnerValue: '',
            timeout: null,
            scrollType: null
        }
    },
    computed: {
        markedHtml() {
            if (this.innerValue) return this.$marked.markdownToHtml(this.debouncedInnerValue)
            /* eslint-disable no-useless-escape */
            return this.$marked.markdownToHtml(
                '# Jak formátovat text? \n\nDo šedého okna můžeš psát text, který lze formátovat **Markdown** syntaxí. Náhled formátovaného textu se zobrazí v tomto okně. Tato nápověda zmizí, jakmile něco napíšeš - lze ji vrátit smazáním tvého textu. \n\n\# Co je to markdown? \n\nMarkdown umožňuje pomocí jednoduchých formátovacích značek (např. \#, \*, -, atd.) vyznačit v textu nadpisy, seznamy, tučný text, odkazy apod. \n\n# A jaké formátování můžeš používat? \n\n**tučný text** : `**tučný text**` \n\n_kurzíva_ : `*kurzíva*` \n\n[odkaz](http://www.google.com) : `[Text odkazu](http://www.adresa-odkazu.com)` \n\n# Nadpis : `# Nadpis` \n\n-   odrážkový list : `- text (pomlčka mezera text)` \n\n1. číslovaný list : `1. text (číslo tečka mezera text)` \n\n> text v bloku : `> Text v bloku` \n\nVíce informací o markdown najdeš [tady](https://jecas.cz/markdown) nebo [tady](https://www.markdownguide.org/). Ne všechno je u nás ale povoleno - například nejde vkládat obrázky nebo psát přímo HTML kód (nechceme tady z toho mít holubník, žejo).\n\n'
            )
        }
    },
    watch: {
        value(value) {
            this.innerValue = value
        },
        innerValue(value) {
            if (this.timeout) clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                this.debouncedInnerValue = value
            }, 500)
        }
    },
    mounted() {
        this.innerValue = this.value
        this.editContent = this.$refs.editContent
        this.previewContent = this.$refs.previewContent
        this.editContent.addEventListener('scroll', this.handleScroll, true)
        this.previewContent.addEventListener('scroll', this.handleScroll, true)
    },
    destroyed() {
        clearInterval(this.timeout)
    },
    methods: {
        getInnerValue() {
            return this.innerValue
        },
        handleScroll() {
            const editContent = this.$refs.editContent
            const previewContent = this.$refs.previewContent
            const editScroll = editContent.scrollTop
            const previewScroll = previewContent.scrollTop
            const editScrollMax = editContent.scrollHeight - editContent.offsetHeight
            const previewScrollMax = previewContent.scrollHeight - previewContent.offsetHeight
            if (this.scrollType === 'edit') {
                previewContent.scrollTop = previewScrollMax * (editScroll / editScrollMax)
            } else if (this.scrollType === 'preview') {
                editContent.scrollTop = editScrollMax * (previewScroll / previewScrollMax)
            }
        },
        handleMouseOver(type) {
            this.scrollType = type
        }
    }
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
