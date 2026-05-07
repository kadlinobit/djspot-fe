import Url from 'url-parse';
// @ts-expect-error no type declarations for base-64
import base64 from 'base-64';
import utf8 from 'utf8';

export interface AudioUrls {
    stream: string | null;
    download: string | null;
}

function getDropboxUrls(parsedUrl: Url<Record<string, string | undefined>>): AudioUrls {
    parsedUrl.set('query', { dl: 1 });
    const url = parsedUrl.toString();
    return { stream: url, download: url };
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

export default defineEventHandler((event): AudioUrls | null => {
    const { url } = getQuery(event) as { url?: string };

    if (!url) {
        return null;
    }

    try {
        new URL(url);
    } catch {
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
});
