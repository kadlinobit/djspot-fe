import type { ExtractCollectionFields } from './utils';

export const cityFieldSets = {
    default: ['id', 'name', 'gps', 'district', 'region', 'zip'] as const
};

export type ICityDefault = ExtractCollectionFields<'city', typeof cityFieldSets.default>;
