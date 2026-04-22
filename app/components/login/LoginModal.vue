<template>
    <UModal v-model:open="mainStore.isLoginOpen">
        <template #content>
            <div class="p-6">
                <div class="mb-6 flex items-center justify-between">
                    <h4 class="text-2xl font-bold text-gray-900 dark:text-white">
                        {{
                            $i18n.t(
                                `user.${mainStore.loginActiveComponent}`.replace(
                                    '-',
                                    '_'
                                )
                            )
                        }}
                    </h4>
                    <UButton
                        color="neutral"
                        variant="ghost"
                        icon="i-heroicons-x-mark-20-solid"
                        class="-mr-2"
                        @click="mainStore.setIsLoginOpen(false)"
                    />
                </div>

                <div>
                    <login
                        v-if="mainStore.loginActiveComponent === 'login'"
                        display-type="modal"
                        @login-success="afterLoginSuccess"
                    />
                    <forgot-password
                        v-else-if="mainStore.loginActiveComponent === 'forgot-password'"
                        display-type="modal"
                    />
                    <register
                        v-else-if="mainStore.loginActiveComponent === 'register'"
                        display-type="modal"
                    />
                </div>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import Login from './Login.vue';
import ForgotPassword from './ForgotPassword.vue';
import Register from './Register.vue';
import { useMainStore } from '~/stores';

const { $i18n } = useNuxtApp();
const mainStore = useMainStore();
const toast = useToast();

function afterLoginSuccess() {
    mainStore.setIsLoginOpen(false);
    toast.add({
        title: $i18n.t('user.login_success'),
        color: 'success',
        icon: 'i-heroicons-check-circle'
    });
}
</script>
