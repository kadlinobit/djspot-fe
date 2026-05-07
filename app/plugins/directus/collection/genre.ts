import type { ExtractCollectionFields } from './utils';

export const genreFieldSets = {
    default: ['id', 'name'] as const
};

export type IGenreDefault = ExtractCollectionFields<'genre', typeof genreFieldSets.default>;
