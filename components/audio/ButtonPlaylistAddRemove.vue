<template>
    <client-only>
        <div class="button-playlist-add-remove">
            <o-button
                v-if="!currentSound || currentSound.id !== sound.id"
                :disabled="isPlayerLoading"
                :variant="variant"
                :size="size"
                :icon-left="isSoundInPlaylist(sound) ? 'delete-sweep' : 'playlist-plus'"
                @click="() => handleAddOrRemovePlaylistSound(sound)"
            />
            <o-icon
                v-else
                custom-class="level-item"
                icon="checkbox-blank-circle"
                variant="success m-3"
                size="small"
            />
        </div>
    </client-only>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    props: {
        sound: {
            type: Object,
            required: true
        },
        size: {
            type: String,
            default: null
        },
        variant: {
            type: String,
            default: 'text'
        }
    },
    computed: {
        ...mapGetters('player', {
            currentSound: 'currentSound',
            isPlayerLoading: 'isLoading'
        }),
        ...mapGetters('playlist', ['isSoundInPlaylist'])
    },
    methods: {
        ...mapActions('playlist', ['handleAddOrRemovePlaylistSound'])
    }
}
</script>
