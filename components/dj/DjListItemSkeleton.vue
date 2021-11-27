<template>
    <li class="dj-list-item columns is-vcentered">
        <div class="column is-narrow">
            <o-skeleton animated rounded height="64px" width="64px"></o-skeleton>
        </div>
        <div class="column">
            <o-skeleton animated rounded height="1.5em" :width="randomWidth(18, 26)"></o-skeleton>
            <o-skeleton animated rounded :width="randomWidth(15, 22)"></o-skeleton>
        </div>
    </li>
</template>

<script>
import _ from 'lodash'

export default {
    computed: {
        randomWidth() {
            return (lower, upper) => _.random(lower, upper, false) + '%'
        }
    }
}
</script>
