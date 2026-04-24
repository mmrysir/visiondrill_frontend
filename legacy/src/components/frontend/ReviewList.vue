<template>
    <div class="bg-white rounded shadow-sm p-4 mb-4 restaurant-detailed-ratings-and-reviews">
        <!-- <a href="#" class="btn btn-outline-primary btn-sm float-right">Top Rated</a> -->
        <h5 class="mb-1">All Ratings and Reviews</h5>
        <review v-for="review in reviews" :key="review.id" :review="review"></review>
        <a class="text-center w-100 d-block mt-4 font-weight-bold star" href="#" @click.prevent="getReviews()">See All Reviews</a>
    </div>
</template>
<script>
import Review from './Review.vue';
    export default {
        props: ['courseId'],

        components: {
            Review,
        },

        data() {
            return {
                reviews: '',
            }
        },

        methods: {
            getReviews() {
                axios.get(`/api/courses/${this.courseId}/reviews`)
                .then(({data}) => {
                    this.reviews = data;
                })
            }
        },

        mounted() {
            this.getReviews();
        },
    }
</script>
