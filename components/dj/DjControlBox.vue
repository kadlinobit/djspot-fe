<template>
    <div class="dj-control-box level is-mobile">
        <div class="level-left">
            <div class="level-item">
                <o-button
                    icon-left="eye"
                    :variant="followButtonVariant"
                    :disabled="isToggleFollowLoading"
                    size="responsive"
                    @click="$emit('toggleFollow')"
                >
                    {{
                        dj.follow_count > 0
                            ? `${dj.follow_count} ${$i18n.t('dj.followers')}`
                            : $i18n.t('dj.follow')
                    }}
                </o-button>
            </div>
        </div>
        <div class="level-right">
            <nuxt-link :to="{ path: `/djs/manage/edit/` }">
                <o-button
                    variant="light"
                    icon-left="pencil"
                    tag="nuxt-link"
                    size="responsive"
                >
                    {{ $i18n.t('form.edit') }}
                </o-button>
            </nuxt-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/directus'

const { $i18n } = useNuxtApp()
const auth = useAuth()

defineEmits(['toggleFollow'])

interface Props {
    dj: object
    isToggleFollowLoading: boolean
}

const props = withDefaults(defineProps<Props>(), {
    dj: null,
    isToggleFollowLoading: false
})

const followButtonVariant = computed(() => {
    if (!auth.loggedIn.value) return 'light'
    return props.dj.follows.length > 0 ? 'dark' : 'light'
})
</script>
