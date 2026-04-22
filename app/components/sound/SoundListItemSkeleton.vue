<template>
    <div class="flex items-center gap-4 py-2 border-b dark:border-gray-800 animate-pulse">
        <!-- Cover Image Skeleton -->
        <div class="flex-shrink-0">
            <USkeleton class="h-12 w-12 rounded-lg" />
        </div>
        
        <!-- Play Button Skeleton -->
        <div class="flex-shrink-0">
            <USkeleton class="h-10 w-10 rounded-full" />
        </div>
        
        <!-- Text Content Skeleton -->
        <div class="flex flex-1 flex-col justify-center overflow-hidden">
            <USkeleton class="h-5 w-1/3 mb-2" />
            <USkeleton class="h-4 w-1/4" />
        </div>
    </div>
</template>

<script setup lang="ts"></script>
