<template>
    <section class="section">
        <div class="container">
            <Breadcrumbs
                v-if="navObject?.navPath?.length > 1"
                :nav-path="navObject.navPath"
            />
            <div v-if="!data?.article">
                <h1 class="title">{{ navObject?.currentNav?.title }}</h1>
                <p class="subtitle">{{ navObject?.currentNav?.description }}</p>
                <article
                    v-for="child in navObject?.navChildren"
                    :key="child.path"
                    class="media"
                >
                    <div class="media-content">
                        <div class="content">
                            <nuxt-link :to="{ path: child.path }">
                                <strong>{{ child.title }}</strong>
                            </nuxt-link>
                            <p>
                                {{ child.description }}
                            </p>
                        </div>
                    </div>
                </article>
            </div>
            <article v-else class="content">
                <ContentRenderer :value="data.article" />
            </article>
        </div>
    </section>
</template>

<script setup>
import Breadcrumbs from '~/components/content/Breadcrumbs.vue'

const route = useRoute()
const { path } = route

const { data } = await useAsyncData(`content-${path}`, async () => {
    const article = await queryCollection('docs').path(path).first()
    return { article }
})

const { data: navigation } = await useAsyncData('navigation', () =>
    queryCollectionNavigation('docs')
)

const navObject = computed(() => {
    if (!navigation?.value) return null
    const result = getNavObject(navigation.value[0], path)
    if (!result) return null
    return {
        navPath: result.navPath.reverse(),
        navChildren: result.navChildren,
        currentNav: result.currentNav
    }
})

function getNavObject(element, matchingPath, navPath = []) {
    if (element.path.replace(/\/$/, '') === matchingPath.replace(/\/$/, '')) {
        navPath.push({
            title: element.title,
            path: element.path,
            description: element.description
        })
        return {
            navPath,
            currentNav: element,
            navChildren: element.children
                ? element.children.map((child) => ({
                      title: child.title,
                      path: child.path,
                      description: child.description
                  }))
                : null
        }
    } else if (element.children != null) {
        let result = null
        for (let i = 0; result == null && i < element.children.length; i++) {
            result = getNavObject(element.children[i], matchingPath, navPath)
        }
        navPath.push({
            title: element.title,
            path: element.path,
            description: element.description
        })
        return result
    }
    return null
}
</script>
