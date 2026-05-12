<template>
    <UApp>
        <login-modal />
        <SidebarMenu v-if="getIsLoggedIn()" />
        <Navbar />
        <div class="pb-24">
            <slot />
        </div>
        <BottomBar />
    </UApp>
</template>

<script setup lang="ts">
import Navbar from '~/components/layout/Navbar.vue';
import SidebarMenu from '~/components/layout/SidebarMenu.client.vue';
import BottomBar from '~/components/layout/BottomBar.client.vue';
import LoginModal from '~/components/login/LoginModal.vue';

import { useUserStore, useNotificationsStore } from '~/stores';
const { getIsLoggedIn } = useUserStore();
useNotificationsStore();
</script>
