<template>
    <ValidationProvider v-slot="{ errors, valid }" :vid="vid" :name="name" :rules="rules" slim>
        <b-field
            :label="label"
            :type="{
                'is-danger': isValidationOn && errors[0],
                'is-success': isValidationOn && valid,
                '': !isValidationOn
            }"
            :message="$t(errors[0])"
            :expanded="expanded"
        >
            <b-taginput
                :value="value"
                :data="filteredTags"
                :autocomplete="autocomplete"
                :allow-new="allowNew"
                :open-on-focus="openOnFocus"
                :field="field"
                :icon="icon"
                :placeholder="placeholder"
                :maxtags="maxtags"
                :expanded="expanded"
                @typing="getFilteredTags"
                @input="(value) => emitInput(value)"
            >
            </b-taginput>
        </b-field>
    </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
    components: {
        ValidationProvider
    },
    props: {
        vid: {
            type: String,
            default: ''
        },
        value: {
            type: Array,
            default: () => []
        },
        tags: {
            type: Array,
            default: () => []
        },
        name: {
            type: String,
            default: 'tags'
        },
        label: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        expanded: {
            type: Boolean,
            default: true
        },
        icon: {
            type: String,
            default: 'tag'
        },
        autocomplete: {
            type: Boolean,
            default: true
        },
        allowNew: {
            type: Boolean,
            default: false
        },
        openOnFocus: {
            type: Boolean,
            default: true
        },
        field: {
            type: String,
            required: true
        },
        maxtags: {
            type: [String, Number],
            default: ''
        },
        isValidationOn: {
            type: Boolean,
            default: true
        },
        rules: {
            type: [Object, String],
            default: ''
        }
    },
    data() {
        return {
            filteredTags: []
        }
    },
    watch: {
        tags() {
            this.getFilteredTags('')
        }
    },
    methods: {
        getFilteredTags(text = '') {
            if (this.tags && Array.isArray(this.tags)) {
                this.filteredTags = this.tags.filter((tag) => {
                    return tag[this.field].toString().toLowerCase().includes(text.toLowerCase())
                })
            }
        },
        emitInput(value) {
            this.$emit('input', value)
            this.getFilteredTags('')
        }
    }
}
</script>
