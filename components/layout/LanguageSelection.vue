<template>
    <a class="navbar-item is-right" @click="toggleLocale">
        <o-icon icon="earth" />
        <span class="ml-1">{{ $i18n.locale }}</span>
    </a>
</template>

<script>
export default {
    data() {
        return {}
    },
    methods: {
        toggleLocale() {
            if (this.$i18n.locale === 'cs') this.$i18n.setLocale('en')
            else this.$i18n.setLocale('cs')
        }
    }
}
</script>
