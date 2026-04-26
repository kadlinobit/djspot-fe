import Url from 'url-parse';
import _ from 'lodash';
// @ts-expect-error no type declarations for base-64
import base64 from 'base-64';
import utf8 from 'utf8';
import { defineNuxtPlugin } from '#app';

export interface AudioUrls {
    stream: string | null;
    download: string | null;
}

export interface AudioApi {
    getAudioUrls(url: string): Promise<AudioUrls | null>;
    convertTimeHHMMSS(seconds: number): string;
    formatSoundForPlaylist(sound: Record<string, unknown>): Record<string, unknown>;
}

declare module '#app' {
    interface NuxtApp {
        $audio: AudioApi;
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $audio: AudioApi;
    }
}

export default defineNuxtPlugin(() => {
    function isValidUrl(url: string): boolean {
        try {
            new URL(url);
        } catch (e) {
            console.warn('FAILED URL FORMAt');
            return false;
        }
        return true;
    }

    function getDropboxUrls(parsedUrl: Url<Record<string, string | undefined>>): AudioUrls {
        const audioUrls = {} as AudioUrls;

        parsedUrl.set('query', { dl: 1 });
        audioUrls.stream = parsedUrl.toString();

        parsedUrl.set('query', { dl: 1 });
        audioUrls.download = parsedUrl.toString();

        return audioUrls;
    }

    function getHearThisUrls(parsedUrl: Url<Record<string, string | undefined>>): AudioUrls {
        return {
            stream: `https://hearthis.app${parsedUrl.pathname}listen`,
            download: null
        };
    }

    function getOneDriveUrls(parsedUrl: Url<Record<string, string | undefined>>): AudioUrls {
        const base64value = base64.encode(utf8.encode(parsedUrl.toString()));
        const encodedUrl = base64value
            .replace(/=+$/, '')
            .replace('/', '_')
            .replace('+', '-');
        const resultUrl = `https://api.onedrive.com/v1.0/shares/u!${encodedUrl}/root/content`;

        return { stream: resultUrl, download: resultUrl };
    }

    async function getAudioUrls(url: string): Promise<AudioUrls | null> {
        if (!isValidUrl(url)) {
            return null;
        }

        const parsedUrl = new Url(url, true);

        if (parsedUrl.host.includes('dropbox.com')) {
            return getDropboxUrls(parsedUrl);
        } else if (parsedUrl.host.includes('hearthis.at')) {
            return getHearThisUrls(parsedUrl);
        } else if (parsedUrl.host.includes('1drv.ms')) {
            return getOneDriveUrls(parsedUrl);
        } else {
            return { stream: url, download: url };
        }
    }

    function convertTimeHHMMSS(seconds: number): string {
        const hhmmss = new Date(seconds * 1000).toISOString().substr(11, 8);
        return hhmmss.indexOf('00:') === 0 ? hhmmss.substr(3) : hhmmss;
    }

    function formatSoundForPlaylist(sound: Record<string, unknown>): Record<string, unknown> {
        return _.pick(sound, ['duration', 'dj', 'id', 'name', 'type', 'url']);
    }

    return {
        provide: {
            audio: {
                getAudioUrls,
                convertTimeHHMMSS,
                formatSoundForPlaylist
            } satisfies AudioApi
        }
    };
});
