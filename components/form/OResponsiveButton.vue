<template>
    <div>
        <o-button size="small" class="is-hidden-tablet" v-bind="$attrs" v-on="$listeners">
            <slot />
        </o-button>
        <o-button class="is-hidden-mobile" v-bind="$attrs" v-on="$listeners">
            <slot />
        </o-button>
    </div>
</template>
