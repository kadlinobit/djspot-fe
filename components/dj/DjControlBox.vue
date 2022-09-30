<template>
    <div class="dj-control-box level is-mobile">
        <div class="level-left">
            <div class="level-item">
                <o-responsive-button
                    icon-left="eye"
                    :variant="followButtonVariant"
                    :disabled="isToggleFollowLoading"
                    @click="$emit('toggleFollow')"
                >
                    {{
                        dj.follow_count > 0
                            ? `${dj.follow_count} ${$i18n.t('dj.followers')}`
                            : $i18n.t('dj.follow')
                    }}
                </o-responsive-button>
            </div>
        </div>
        <div class="level-right">
            <o-responsive-button
                variant="light"
                icon-left="pencil"
                tag="nuxt-link"
                :to="{ path: `/djs/manage/edit/` }"
            >
                {{ $i18n.t('form.edit') }}
            </o-responsive-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import OResponsiveButton from '~/components/form/OResponsiveButton.vue'

const { $i18n, $auth } = useNuxtApp()

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
    if (!$auth.loggedIn) return 'light'
    return props.dj.follows.length > 0 ? 'dark' : 'light'
})
</script>
