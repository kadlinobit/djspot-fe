<template>
    <li class="dj-list-item columns is-vcentered">
        <div class="column is-narrow">
            <o-skeleton
                animated
                rounded
                height="64px"
                width="64px"
            />
        </div>
        <div class="column">
            <o-skeleton
                animated
                rounded
                height="1.5em"
                :width="randomWidth(18, 26)"
            />
            <o-skeleton
                animated
                rounded
                :width="randomWidth(15, 22)"
            />
        </div>
    </li>
</template>

<script setup lang="ts">
import _ from 'lodash'

const randomWidth = computed(() => {
    return (lower, upper) => _.random(lower, upper, false) + '%'
})
</script>
