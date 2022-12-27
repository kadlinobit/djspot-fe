<template>
    <section class="section">
        <div class="container">
            <Breadcrumbs
                v-if="navObject.navPath.length > 1"
                :navPath="navObject.navPath"
            />
            <div v-if="data.article._path === path && !data.article._id">
                <h1 class="title">{{ data.article._dir.title }}</h1>
                <p class="subtitle">{{ data.article._dir.description }}</p>
                <article
                    class="media"
                    v-for="child in navObject.navChildren"
                    :key="child.path"
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
                <ContentDoc />
            </article>
        </div>
    </section>
</template>

<script setup>
import Breadcrumbs from '~~/components/content/Breadcrumbs.vue'
const route = useRoute()
const { path } = route

const { data } = await useAsyncData(`content-${path}`, async () => {
    // fetch document where the document path matches with the cuurent route
    let article = queryContent().where({ _path: path }).findOne()

    // get the surround information,
    // which is an array of documeents that come before and after the current document
    let surround = queryContent()
        .only(['_path', 'title', 'description'])
        .sort({ date: 1 })
        .findSurround(path)
    return {
        article: await article,
        surround: await surround
    }
})

const navObject = computed(() => {
    if (!data.value.article._path || !navigation?.value) return null
    const { navPath, navChildren } = getNavObject(
        navigation.value[0],
        data.value.article._path
    )
    return {
        navPath: navPath.reverse(),
        navChildren
    }
})

function getNavObject(element, matchingPath, navPath = []) {
    if (element._path.replace(/\/$/, '') === matchingPath.replace(/\/$/, '')) {
        navPath.push({
            title: element.title,
            path: element._path,
            description: element.description
        })
        return {
            navPath,
            navChildren: element.children
                ? element.children.map((child) => ({
                      title: child.title,
                      path: child._path,
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
            path: element._path,
            description: element.description
        })
        return result
    }
    return null
}

const { data: navigation } = await useAsyncData('navigation', async () =>
    fetchContentNavigation()
)

console.log('data.value.article')
console.log(data.value.article)

// console.log('navigation.value')
// console.log(navigation.value)

// console.log(getNavObject(navigation.value[0], data.value.article._path))
</script>
