<template>
    <div class="dj-control-box level is-mobile">
        <div class="level-left">
            <div class="level-item">
                <b-responsive-button
                    icon-left="eye"
                    :type="dj.isFollowedByMe ? 'is-dark' : 'is-light'"
                    @click="onToggleFollow"
                >
                    {{
                        dj.followsCount > 0
                            ? `${dj.followsCount} ${$t('dj.followers')}`
                            : $t('dj.follow')
                    }}
                </b-responsive-button>
            </div>
        </div>
        <div class="level-right">
            <b-responsive-button
                type="is-dark"
                icon-left="pencil"
                tag="nuxt-link"
                :to="{ path: `/djs/manage/edit/` }"
            >
                {{ $t('form.edit') }}
            </b-responsive-button>
        </div>
    </div>
</template>

<script>
import BResponsiveButton from '~/components/form/BResponsiveButton.vue'
export default {
    components: {
        BResponsiveButton
    },
    props: {
        dj: {
            type: Object,
            required: true
        },
        onToggleFollow: {
            type: Function,
            required: true
        }
    }
}
</script>
