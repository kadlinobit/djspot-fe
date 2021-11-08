<template>
    <b-navbar-dropdown arrowless collapsible>
        <template #label>
            <b-icon icon="earth" />
        </template>
        <b-navbar-item
            v-for="lang in $i18n.locales"
            :key="lang.code"
            @click="setLanguage(lang.code)"
        >
            {{ lang.name }}
        </b-navbar-item>
    </b-navbar-dropdown>
</template>

<script>
export default {
    methods: {
        setLanguage(languageCode) {
            this.$i18n.setLocale(languageCode)
        }
    }
}
</script>
