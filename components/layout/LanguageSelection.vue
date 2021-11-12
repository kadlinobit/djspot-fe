<template>
    <div class="navbar-item has-dropdown is-right" :class="{ 'is-active': isDropdownExpanded }">
        <div class="navbar-link" @click="toggleIsDropdownExpanded">
            <o-icon icon="earth" />

            <div class="navbar-dropdown">
                <a
                    v-for="lang in $i18n.locales"
                    :key="lang.code"
                    class="navbar-item"
                    @click="setLanguage(lang.code)"
                >
                    {{ lang.name }}
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isDropdownExpanded: false
        }
    },
    methods: {
        setLanguage(languageCode) {
            this.$i18n.setLocale(languageCode)
        },
        toggleIsDropdownExpanded() {
            this.isDropdownExpanded = !this.isDropdownExpanded
        }
    }
}
</script>
