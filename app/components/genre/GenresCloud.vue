<template>
    <div class="flex flex-wrap gap-2 leading-tight">
        <NuxtLink
            v-for="genre in genres"
            :key="genre.id"
            :to="`/sounds?genres=${genre.id}`"
            :style="{ fontSize: fontSize(genre.sounds_count) }"
            class="cursor-pointer transition-colors duration-150"
        >
            {{ genre.name }}<span class="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-normal leading-none">{{ genre.sounds_count }}</span>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
interface Genre {
    id: string;
    name: string;
    sounds_count: number;
}

const { data } = await useFetch<{ data: Genre[] }>(
    '/directus/genres/sounds-count'
);

const genres = computed(() => data.value?.data ?? []);

const minSize = 0.75;
const maxSize = 2.5;

const logMin = computed(() => {
    const counts = genres.value.map((g) => g.sounds_count).filter((c) => c > 0);
    return counts.length ? Math.log(Math.min(...counts)) : 0;
});

const logMax = computed(() => {
    const counts = genres.value.map((g) => g.sounds_count).filter((c) => c > 0);
    return counts.length ? Math.log(Math.max(...counts)) : 1;
});

function fontSize(count: number): string {
    if (logMax.value === logMin.value) return `${minSize}rem`;
    const t =
        (Math.log(Math.max(count, 1)) - logMin.value) /
        (logMax.value - logMin.value);
    return `${(minSize + t * (maxSize - minSize)).toFixed(2)}rem`;
}
</script>
