<template>
    <section class="section">
        <div class="container">
            <h1 class="title">{{ $t('dj.create_profile') }}</h1>
            <DjForm
                :on-form-submit="createDj"
                :error-in="error"
                :success-in="success"
                :is-loading-in="isLoading"
            />
        </div>
    </section>
</template>

<script>
import DjForm from '~/components/form/DjForm.vue'

export default {
    components: {
        DjForm
    },
    data() {
        return {
            error: null,
            success: null,
            isLoading: false
        }
    },
    methods: {
        async createDj(formData) {
            try {
                this.isLoading = true

                const dj = await this.$strapi.create('djs', formData)
                await this.$strapi.fetchUser()

                this.$router.push(`/djs/${dj.slug}`)

                this.$buefy.toast.open({
                    message: this.$t('dj.created_successfully'),
                    type: 'is-success',
                    duration: 7000
                })
            } catch (e) {
                if (e.response && e.response.data) {
                    this.error = e.response.data.message[0].messages[0].message
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
