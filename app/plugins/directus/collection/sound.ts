import type { ExtractCollectionFields } from './utils';

export const soundFieldSets = {
    default: [
        'id',
        'date_created',
        'name',
        'description',
        'slug',
        'url',
        'type',
        'duration',
        'photo',
        'like_count',
        'likes',
        { dj: ['id', 'name', 'slug', 'city'] },
        { genres: [{ genre_id: ['*'] }] }
    ] as const,
    detailed: [
        'id',
        'date_created',
        'name',
        'description',
        'slug',
        'url',
        'type',
        'duration',
        'photo',
        'like_count',
        'likes',
        { dj: ['id', 'name', 'slug', 'city'] },
        { genres: ['genre_id'] }
    ] as const,
    form: [
        'id',
        'name',
        'description',
        'slug',
        'url',
        'dj',
        'type',
        'duration',
        'photo',
        { genres: ['genre_id'] },
        'status'
    ] as const
};

export type ISoundDefault = ExtractCollectionFields<
    'sound',
    typeof soundFieldSets.default
>;
export type ISoundDetailed = ExtractCollectionFields<
    'sound',
    typeof soundFieldSets.detailed
>;
export type ISoundForm = ExtractCollectionFields<
    'sound',
    typeof soundFieldSets.form
>;
