<template>
    <UNavigationMenu
        :items="djItems"
        :ui="{ root: 'flex flex-col gap-4' }"
        orientation="vertical"
        class="w-full"
        @select="$emit('select')"
    />
</template>

<script setup lang="ts">
const { getUser } = useUserStore();
const { $i18n } = useNuxtApp();

defineEmits<{ select: [] }>();

const djItems = computed(() => {
    const user = getUser();
    const menuGroups = [];

    const deejayGroup = [];
    if (!user?.djs?.length) {
        deejayGroup.push({
            label: $i18n.t('dj.create_profile'),
            icon: 'i-lucide-plus',
            to: '/djs/manage/new'
        });
    } else {
        user.djs.forEach((dj) => {
            deejayGroup.push({
                label: dj.name,
                icon: 'i-lucide-disc',
                children: [
                    {
                        label: $i18n.t('dj.profile'),
                        icon: 'i-lucide-contact',
                        to: `/djs/${dj.slug}`
                    },
                    {
                        label: $i18n.t('sound.add'),
                        icon: 'i-lucide-plus',
                        to: '/sounds/manage/new'
                    }
                ]
            });
        });
    }

    if (deejayGroup.length) {
        menuGroups.push(deejayGroup);
    }

    return menuGroups;
});
</script>
