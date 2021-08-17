<template>
    <section class="section">
        <div class="container">
            <h2 class="title">My Profile</h2>
            <div class="content">
                <p>
                    <strong>Username:</strong>
                    {{ $strapi.user.username }}
                </p>
                <p>
                    <strong>Email:</strong>
                    {{ $strapi.user.email }}
                </p>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    middleware: 'authenticated'
}
</script>
