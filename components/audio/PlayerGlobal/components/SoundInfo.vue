<template>
    <o-notification v-if="isError" variant="danger pt-3 pb-3" role="alert">
        {{ $t('player.error_loading_file') }}
    </o-notification>
    <div v-else class="columns is-vcentered is-mobile is-relative">
        <!--  -->
        <div class="column is-narrow">
            <div class="tag is-secondary">
                {{ $audio.convertTimeHHMMSS(currentSeconds) }}
            </div>
        </div>
        <div v-if="isLoading" class="column">
            <o-loading
                :full-page="false"
                :active.sync="isLoading"
                :overlay="false"
                :can-cancel="false"
                icon-size="small"
            ></o-loading>
        </div>
        <div v-else class="column has-text-centered has-text-weight-semibold is-text-ellipsis">
            <span v-if="currentSound">
                {{ `${currentSound.dj.name} - ${currentSound.name}` }}
            </span>
        </div>
        <div class="column is-narrow">
            <div class="tag is-secondary">
                {{ $audio.convertTimeHHMMSS(durationSeconds) }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters('player', [
            'currentSound',
            'currentSeconds',
            'durationSeconds',
            'isLoading',
            'isError'
        ])
    }
}
</script>
