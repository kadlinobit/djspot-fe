import { defineStore } from 'pinia';
import { usePlayerStore } from './player';
import type { ISoundDefault } from '~/plugins/directus/collection/sound';

type PlaylistSound = Pick<ISoundDefault, 'duration' | 'dj' | 'id' | 'name' | 'type' | 'url'>;

export const usePlaylistStore = defineStore(
    'playlist',
    () => {
        const { $i18n } = useNuxtApp();
        const toast = useToast();
        const playerStore = usePlayerStore();

        const playlist = ref<PlaylistSound[]>([]);

        // GETTERS
        const playlistSize = computed(() => {
            return playlist.value.length;
        });
        const isSoundInPlaylist = (sound: ISoundDefault) => {
            return playlist.value.some(
                (playlistSound: PlaylistSound) => playlistSound.id === sound.id
            );
        };
        const soundIndexInPlaylist = (sound: ISoundDefault) => {
            return playlist.value.findIndex(
                (playlistSound: PlaylistSound) => playlistSound.id === sound.id
            );
        };

        function formatSoundForPlaylist(sound: ISoundDefault) {
            const { duration, dj, id, name, type, url } = sound;
            return { duration, dj, id, name, type, url };
        }

        // ACTIONS
        function setPlaylist(value) {
            playlist.value = value;
        }

        function deleteSound(sound: PlaylistSound) {
            playlist.value = playlist.value.filter(
                (playlistSound) => playlistSound.id !== sound.id
            );
            toast.add({
                title: $i18n.t('playlist.removed_from_playlist', [
                    `${sound.dj.name} – ${sound.name}`
                ]),
                color: 'warning'
            });
        }

        function addSoundToIndex(sound: ISoundDefault, index: number) {
            playlist.value.splice(
                index,
                0,
                formatSoundForPlaylist(sound)
            );
        }

        function addSoundToEnd(sound: ISoundDefault) {
            playlist.value.push(formatSoundForPlaylist(sound));
        }

        function handlePlaySound(sound: ISoundDefault) {
            if (
                !playlist.value.some(
                    (playlistSound) => playlistSound.id === sound.id
                )
            ) {
                let index = 0;
                const currentSound = playerStore.currentSound;
                if (currentSound) {
                    index = playlist.value.findIndex(
                        (playlistSound) => playlistSound.id === currentSound.id
                    );
                    index = index !== -1 ? index + 1 : 0;
                }

                addSoundToIndex(sound, index);

                toast.add({
                    title: $i18n.t('playlist.added_to_playlist', [
                        `${sound.dj.name} – ${sound.name}`
                    ]),
                    color: 'success'
                });
            }
        }

        function handleAddOrRemovePlaylistSound(sound: ISoundDefault) {
            if (
                !playlist.value.some(
                    (playlistSound) => playlistSound.id === sound.id
                )
            ) {
                addSoundToEnd(sound);

                toast.add({
                    title: $i18n.t('playlist.added_to_playlist', [
                        `${sound.dj.name} – ${sound.name}`
                    ]),
                    color: 'success'
                });
            } else {
                deleteSound(sound);
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
        };
    },
    { persist: true }
);
