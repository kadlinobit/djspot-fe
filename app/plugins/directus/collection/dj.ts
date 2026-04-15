import type { ExtractCollectionFields } from './utils.js';
import { soundFieldSets } from './sound.js';

export const djFieldSets = {
    default: [
        'id',
        'name',
        'email',
        'bio',
        'slug',
        'photo',
        'follow_count',
        'follows',
        { city: ['*'] },
        { genres: [{ genre_id: ['*'] }] }
    ] as const,
    withSounds: [
        'id',
        'name',
        'email',
        'bio',
        'slug',
        'photo',
        'follow_count',
        'follows',
        { city: ['*'] },
        { genres: [{ genre_id: ['*'] }] },
        // { sounds: ['id', 'slug', 'name', 'url', 'type'] }
        { sounds: soundFieldSets.default }
    ] as const,
    form: [
        'id',
        'name',
        'email',
        'bio',
        'slug',
        'photo',
        'city',
        { genres: ['genre_id'] }
    ] as const
};

export type IDjDefault = ExtractCollectionFields<
    'dj',
    typeof djFieldSets.default
>;
export type IDjWithSounds = ExtractCollectionFields<
    'dj',
    typeof djFieldSets.withSounds
>;
export type IDjForm = ExtractCollectionFields<'dj', typeof djFieldSets.form>;
