<template>
    <UModal
        v-model:open="mainStore.isLoginOpen"
    >
        <template #content>
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <h4 class="title is-4">
                        {{
                            $i18n.t(
                                `user.${mainStore.loginActiveComponent}`.replace(
                                    '-',
                                    '_'
                                )
                            )
                        }}
                    </h4>
                </header>
                <section class="modal-card-body">
                    <login
                        v-if="mainStore.loginActiveComponent === 'login'"
                        display-type="modal"
                        @login-success="afterLoginSuccess"
                    />
                    <forgot-password
                        v-else-if="
                            mainStore.loginActiveComponent === 'forgot-password'
                        "
                        display-type="modal"
                    />
                    <register
                        v-else-if="
                            mainStore.loginActiveComponent === 'register'
                        "
                        display-type="modal"
                    />
                </section>
                <footer class="modal-card-foot"/>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { useOruga } from '@oruga-ui/oruga';
import Login from './Login.vue';
import ForgotPassword from './ForgotPassword.vue';
import Register from './Register.vue';
import { useMainStore } from '~/stores';

const $oruga = useOruga();
const { $i18n } = useNuxtApp();
const mainStore = useMainStore();

const router = useRouter();
const route = useRoute();

function afterLoginSuccess() {
    mainStore.setIsLoginOpen(false);
    $oruga.notification.open({
        message: $i18n.t('user.login_success'),
        variant: 'success'
    });
}
</script>
