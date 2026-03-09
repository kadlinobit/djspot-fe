import type { ExtractCollectionFields } from './utils';

export const userFieldSets = {
    default: [
        'id',
        'first_name',
        'last_name',
        'email',
        'location',
        'language'
    ] as const,
    withDjs: [
        'id',
        'first_name',
        'last_name',
        'email',
        'location',
        'language',
        { djs: ['id', 'name', 'slug'] }
    ] as const,
    form: ['first_name', 'last_name', 'email', 'location', 'language'] as const
};

export type IUserDefault = ExtractCollectionFields<
    'directus_users',
    typeof userFieldSets.default
>;
export type IUserWithDjs = ExtractCollectionFields<
    'directus_users',
    typeof userFieldSets.withDjs
>;
