import {
    readItems,
    type RestCommand,
    type Query,
    type CollectionType,
    type RegularCollections,
    type DirectusUser,
    type MergeCoreCollection
} from '@directus/sdk';
import type { ApiCollections } from '../types';

type DirectusUserCustom = MergeCoreCollection<
    ApiCollections,
    'directus_users',
    DirectusUser
>;

type ApiCollectionsWithCustomUser = Omit<ApiCollections, 'directus_users'> & {
    directus_users: DirectusUserCustom[];
};

type ExtractObject<T> =
    T extends RestCommand<infer U, any>
        ? U extends (infer Item)[]
            ? Item
            : U
        : never;

/**
 * Utility to extract collection type based on list of fields provided.
 * @param C name of collection in the Collections object (e.g. 'directus_user', 'dj', 'sound', etc.)
 * @param F list of fields in a const array, such as: typeof ['id', 'name', {djs: ['id', 'slug']}] as const
 * Example usage: ExtractCollectionFields<'dj', ['id', 'name', {sounds: ['id', 'url']}]>
 */
export type ExtractCollectionFields<
    C extends RegularCollections<ApiCollectionsWithCustomUser>,
    F extends Query<
        ApiCollectionsWithCustomUser,
        CollectionType<ApiCollectionsWithCustomUser, C>
    >['fields']
> = ExtractObject<
    ReturnType<
        typeof readItems<
            ApiCollectionsWithCustomUser,
            C,
            { readonly fields: F }
        >
    >
>;
