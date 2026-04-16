<template>
    <section class="section">
        <div class="container">
            <h1 class="title">{{ $i18n.t('help') }}</h1>
            <ContentList path="/help">
                <template v-slot="{ list }">
                    <article
                        class="media"
                        v-for="article in list"
                        :key="article._path"
                    >
                        <div class="media-content">
                            <div class="content">
                                <h3>
                                    <nuxt-link :to="article._path">
                                        {{ article.title }}
                                    </nuxt-link>
                                </h3>
                                <p>{{ article.description }}</p>
                            </div>
                        </div>
                    </article>
                </template>
            </ContentList>
        </div>
    </section>
</template>

<script setup lang="ts">
const { $i18n } = useNuxtApp()
</script>
