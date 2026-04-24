<template>
    <div class="bg-white rounded shadow-sm p-4 mb-5 rating-review-select-page" id="leaveComment">
        <h5 class="mb-4">Leave Comment</h5>
        <p class="mb-2">Rate the Instructor</p>
        <div class="mb-4">
            <span class="star-rating">
                 <a href="#" class="star active" :class="{'text-danger': index <= rating, 'text-secondary': index >= rating}" v-for="index in 5" :key="index" @click.prevent="setRating(index)">
                     <i class="icofont-ui-rating icofont-2x"></i>
                </a>
            </span> <b class="text-black ml-2">{{ rating }} star</b>
        </div>
        <form @submit.prevent="submitReview()">
            <div class="form-group">
                <label>Your Comment</label>
                <textarea class="form-control" v-model="description" required></textarea>
            </div>
            <div class="form-group">
                <button class="btn-blue" type="submit" :disabled="loading">
                    <span v-if="!loading">Submit Comment</span>
                    <span v-if="loading">Submitting...</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        props: ['courseId', 'userId'],

        data() {
            return {
                rating: 5,
                description: '',
                loading: false,
            }
        },

        methods: {
            setRating(value) {
                this.rating = value;
            },

            submitReview() {
                this.loading = true;
                axios.post(`/api/courses/${this.courseId}/review/create`, {
                    rating: this.rating,
                    description: this.description,
                    given_by: this.userId,
                })
                .then(() => {
                    this.loading = false;
                    this.description = '';
                    this.$notify({
                      group: 'foo',
                      title: 'Success!',
                      text: 'Review submitted successfully.'
                    });
                })
            }
        }
    }
</script>
