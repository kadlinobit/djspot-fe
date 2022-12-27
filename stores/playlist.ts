import { defineStore } from 'pinia'
import { usePlayerStore } from './player'
import { useProgrammatic } from '@oruga-ui/oruga'

export const usePlaylistStore = defineStore('playlist', () => {
    const { $audio, $i18n } = useNuxtApp()
    const { oruga: $oruga } = useProgrammatic()
    const playerStore = usePlayerStore()

    const playlist = ref([])

    // GETTERS
    const playlistSize = computed(() => {
        return playlist.value.length
    })
    const isSoundInPlaylist = (sound: Sound) => {
        return playlist.value.some(
            (playlistSound: Sound) => playlistSound.id === sound.id
        )
    }
    const soundIndexInPlaylist = (sound: Sound) => {
        return playlist.value.findIndex(
            (playlistSound: Sound) => playlistSound.id === sound.id
        )
    }

    // ACTIONS
    function setPlaylist(value) {
        playlist.value = value
    }

    function deleteSound(sound) {
        playlist.value = playlist.value.filter(
            (playlistSound) => playlistSound.id !== sound.id
        )
        $oruga.notification.open({
            message: $i18n.t('playlist.removed_from_playlist', [
                `${sound.dj.name} – ${sound.name}`
            ]),
            variant: 'warning'
        })
    }

    function addSoundToIndex(sound, index) {
        playlist.value.splice(index, 0, $audio.formatSoundForPlaylist(sound))
    }

    function addSoundToEnd(sound) {
        playlist.value.push($audio.formatSoundForPlaylist(sound))
    }

    function handlePlaySound(sound) {
        if (
            !playlist.value.some(
                (playlistSound) => playlistSound.id === sound.id
            )
        ) {
            let index
            if (playerStore.currentSound) {
                index = playlist.value.findIndex(
                    (playlistSound) =>
                        playlistSound.id === playerStore.currentSound.id
                )
                index = index !== -1 ? index + 1 : 0
            }

            addSoundToIndex(sound, index)

            $oruga.notification.open({
                message: $i18n.t('playlist.added_to_playlist', [
                    `${sound.dj.name} – ${sound.name}`
                ]),
                variant: 'success'
            })
        }
    }

    function handleAddOrRemovePlaylistSound(sound) {
        if (
            !playlist.value.some(
                (playlistSound) => playlistSound.id === sound.id
            )
        ) {
            addSoundToEnd(sound)

            $oruga.notification.open({
                message: $i18n.t('playlist.added_to_playlist', [
                    `${sound.dj.name} – ${sound.name}`
                ]),
                variant: 'success'
            })
        } else {
            deleteSound(sound)
        }
    }

    return {
        playlist,

        // GETTERS
        playlistSize,
        isSoundInPlaylist,
        soundIndexInPlaylist,

        // ACTIONS
        setPlaylist,
        deleteSound,
        handlePlaySound,
        addSoundToIndex,
        addSoundToEnd,
        handleAddOrRemovePlaylistSound
    }
})
