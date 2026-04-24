<template>
    <div>
        <div v-if="!userHasBookmarked" class="icon-bookmark-o" @click.prevent="handle"></div>
        <div v-if="userHasBookmarked" class="icon-bookmarked-o" @click.prevent="handle"></div>
    </div>
</template>

<script>
export default {
    props: ['course'],

    data() {
        return {
            userHasBookmarked: this.course.hasBookmarked,
            course_id: this.course.id
        }
    },

    methods: {
        addToWishlist() {
            axios.post('/course/' +this.course_id + '/create-bookmark');
            this.userHasBookmarked = true;
        },

        removeFromWishlist() {
            axios.delete('/course/' +this.course_id + '/delete-bookmark');
            this.userHasBookmarked = false;
        },

        handle() {
            if(this.userHasBookmarked == true) {
                this.removeFromWishlist();
            } else {
                this.addToWishlist();
            }
        }
    }
}
</script>
