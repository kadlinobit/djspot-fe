<template>
    <section class="section">
        <div class="container">
            <h1 class="title">
                {{ $t('sound.add') }}
            </h1>
            <sound-form
                :on-form-submit="createSound"
                :error-in="error"
                :success-in="success"
                :is-loading-in="isLoading"
                :initial-data="null"
            />
        </div>
    </section>
</template>

<script>
import SoundForm from '~/components/form/SoundForm.vue'

export default {
    components: {
        SoundForm
    },
    data() {
        return {
            error: null,
            success: null,
            isLoading: false
        }
    },
    methods: {
        async createSound(formDataObj) {
            try {
                this.isLoading = true

                await this.$strapi.create('sounds', formDataObj)
                await this.$strapi.fetchUser()

                // this.$router.push(`/djs/${dj.slug}`)

                this.$buefy.toast.open({
                    message: this.$t(`${formDataObj.type}.add_success`, [formDataObj.name]),
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
