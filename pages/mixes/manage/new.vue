<template>
    <section class="section">
        <div class="container">
            <h1 class="title">{{ $t('mix.add_mix') }}</h1>
            <MixForm
                :on-form-submit="createMix"
                :error-in="error"
                :success-in="success"
                :is-loading-in="isLoading"
                :initial-data="null"
            />
        </div>
    </section>
</template>

<script>
import MixForm from '~/components/form/MixForm.vue'

export default {
    components: {
        MixForm
    },
    data() {
        return {
            error: null,
            success: null,
            isLoading: false
        }
    },
    methods: {
        async createMix(formDataJSON) {
            try {
                this.isLoading = true

                await this.$strapi.create('mixes', formDataJSON)
                await this.$strapi.fetchUser()

                // this.$router.push(`/djs/${dj.slug}`)

                this.$buefy.toast.open({
                    message: this.$t('mix.added_successfully'),
                    type: 'is-success',
                    duration: 7000
                })
            } catch (e) {
                if (e.response && e.response.data && e.response.data.message) {
                    if (Array.isArray(e.response.data.message)) {
                        this.error = e.response.data.message[0].messages[0].message
                    } else {
                        this.error = e.response.data.message
                    }
                } else {
                    this.error = e
                }
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>
