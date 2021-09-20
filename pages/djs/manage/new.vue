<template>
    <section class="section">
        <div class="container">
            <h1 class="title">{{ $t('dj.create_profile') }}</h1>
            <DjForm
                :on-form-submit="createDj"
                :error-in="error"
                :success-in="success"
                :is-loading-in="isLoading"
                :initial-data="null"
                mode="new"
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
        async createDj(formDataJSON) {
            try {
                this.isLoading = true
                const formData = new FormData()

                if (formDataJSON.photo) {
                    formData.append('files.photo', formDataJSON.photo, formDataJSON.photo.name)
                }
                formData.append(
                    'data',
                    JSON.stringify({
                        name: formDataJSON.name,
                        slug: formDataJSON.slug,
                        email: formDataJSON.email,
                        bio: formDataJSON.bio,
                        city: formDataJSON.city,
                        genres: formDataJSON.genres
                            ? formDataJSON.genres.map((genre) => parseInt(genre.id))
                            : null
                    })
                )

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
