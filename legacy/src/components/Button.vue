<script>
export default {
    props: {
        type: {
            type: String,
            default: 'button',
        }
    }
}
</script>

<template>
    <button :type="type" class="px-6 py-2 text-white rounded-lg bg-blue">
        <slot />
    </button>
</template>
