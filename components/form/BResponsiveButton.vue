<template>
    <div>
        <b-button size="is-small" class="is-hidden-tablet" v-bind="$attrs" v-on="$listeners">
            <slot />
        </b-button>
        <b-button class="is-hidden-mobile" v-bind="$attrs" v-on="$listeners">
            <slot />
        </b-button>
    </div>
</template>
