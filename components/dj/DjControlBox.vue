<template>
    <div class="dj-control-box level is-mobile">
        <div class="level-left">
            <div class="level-item">
                <o-responsive-button
                    icon-left="eye"
                    :variant="followButtonVariant"
                    :disabled="isToggleFollowLoading"
                    @click="onToggleFollow"
                >
                    {{
                        dj.follow_count > 0
                            ? `${dj.follow_count} ${$t('dj.followers')}`
                            : $t('dj.follow')
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
                {{ $t('form.edit') }}
            </o-responsive-button>
        </div>
    </div>
</template>

<script>
import OResponsiveButton from '~/components/form/OResponsiveButton.vue'
export default {
    components: {
        OResponsiveButton
    },
    props: {
        dj: {
            type: Object,
            required: true
        },
        onToggleFollow: {
            type: Function,
            required: true
        },
        isToggleFollowLoading: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        followButtonVariant() {
            if (!this.$auth.loggedIn) return 'light'
            return this.dj.follows.length > 0 ? 'dark' : 'light'
        }
    }
}
</script>
