<template>
    <div>
        <notifications group="foo" />
        <div class="bg-white rounded shadow-sm p-4 mb-4 clearfix graph-star-rating" id="ratingAndReview">
            <h5 class="mb-4">Ratings and Reviews</h5>
            <div class="graph-star-rating-header">
                <div class="star-rating">
                    <a href="#" class="star"><i class="icofont-ui-rating active"></i></a>
                    <a href="#" class="star"><i class="icofont-ui-rating active"></i></a>
                    <a href="#" class="star"><i class="icofont-ui-rating active"></i></a>
                    <a href="#" class="star"><i class="icofont-ui-rating active"></i></a>
                    <a href="#" class="star"><i class="icofont-ui-rating"></i></a> <b class="text-black ml-2">{{ ratingStat.total_reviews }}</b>
                </div>
                <p class="text-black mb-4 mt-2">Rated {{ ratingStat.average_rating }} out of 5</p>
            </div>
            <div class="graph-star-rating-body" style="overflow: scroll;">
                <div class="rating-list">
                    <div class="rating-list-left text-black">
                        5 Star
                    </div>
                    <div class="rating-list-center">
                        <div class="progress">
                            <div :style="'width:' + ratingStat.five_star_percentage + '%'" aria-valuemax="5" aria-valuemin="0" aria-valuenow="5" role="progressbar" class="progress-bar bg-primary">
                                <span class="sr-only">{{ ratingStat.five_star_percentage }}% Complete (danger)</span>
                            </div>
                        </div>
                    </div>
                    <div class="rating-list-right text-black">{{ ratingStat.five_star_percentage }}%</div>
                </div>
                <div class="rating-list">
                    <div class="rating-list-left text-black">
                        4 Star
                    </div>
                    <div class="rating-list-center">
                        <div class="progress">
                            <div :style="'width:' + ratingStat.four_star_percentage + '%'" aria-valuemax="5" aria-valuemin="0" aria-valuenow="5" role="progressbar" class="progress-bar bg-primary">
                                <span class="sr-only">{{ ratingStat.four_star_percentage }}% Complete (danger)</span>
                            </div>
                        </div>
                    </div>
                    <div class="rating-list-right text-black">{{ ratingStat.four_star_percentage }}%</div>
                </div>
                <div class="rating-list">
                    <div class="rating-list-left text-black">
                        3 Star
                    </div>
                    <div class="rating-list-center">
                        <div class="progress">
                            <div :style="'width:' + ratingStat.three_star_percentage + '%'" aria-valuemax="5" aria-valuemin="0" aria-valuenow="5" role="progressbar" class="progress-bar bg-primary">
                                <span class="sr-only">{{ ratingStat.three_star_percentage }}% Complete (danger)</span>
                            </div>
                        </div>
                    </div>
                    <div class="rating-list-right text-black">{{ ratingStat.three_star_percentage }}%</div>
                </div>
                <div class="rating-list">
                    <div class="rating-list-left text-black">
                        2 Star
                    </div>
                    <div class="rating-list-center">
                        <div class="progress">
                            <div :style="'width:' + ratingStat.two_star_percentage + '%'" aria-valuemax="5" aria-valuemin="0" aria-valuenow="5" role="progressbar" class="progress-bar bg-primary">
                                <span class="sr-only">{{ ratingStat.two_star_percentage }}% Complete (danger)</span>
                            </div>
                        </div>
                    </div>
                    <div class="rating-list-right text-black">{{ ratingStat.two_star_percentage }}%</div>
                </div>
                <div class="rating-list">
                    <div class="rating-list-left text-black">
                        1 Star
                    </div>
                    <div class="rating-list-center">
                        <div class="progress">
                            <div :style="'width:' + ratingStat.one_star_percentage + '%'" aria-valuemax="5" aria-valuemin="0" aria-valuenow="5" role="progressbar" class="progress-bar bg-primary">
                                <span class="sr-only">{{ ratingStat.one_star_percentage }}% Complete (danger)</span>
                            </div>
                        </div>
                    </div>
                    <div class="rating-list-right text-black">{{ ratingStat.one_star_percentage }}%</div>
                </div>
            </div>
            <!-- <div class="graph-star-rating-footer text-center mt-3 mb-3">
                <button type="button" class="btn btn-outline-primary btn-sm">Rate and Review</button>
            </div> -->
        </div>
        <review-list :course-id="courseId"></review-list>
        <review-comment-form :course-id="courseId" :user-id="userId"></review-comment-form>
    </div>
</template>

<script>
import ReviewList from './ReviewList.vue';
import ReviewCommentForm from './ReviewCommentForm.vue';
    export default {
        props: ['courseId', 'userId'],

        data() {
            return {
                ratingStat: '',
            }
        },

        components: {
            ReviewList,
            ReviewCommentForm,
        },

        methods: {
            //
        },

        mounted() {
            axios.get(`/api/courses/${this.courseId}/rating-stat`)
            .then(({data}) => {
                this.ratingStat = data;
            })
        }
    }
</script>

<style>
.bg-primary {
    background-color: #0073AD !important;
}
.star {
    color: #0073AD;
}
.total-like-user-main a {
    display: inline-block;
    margin: 0 -17px 0 0;
}
.total-like {
    border: 1px solid;
    border-radius: 50px;
    display: inline-block;
    font-weight: 500;
    height: 34px;
    line-height: 33px;
    padding: 0 13px;
    vertical-align: top;
}
.restaurant-detailed-ratings-and-reviews hr {
    margin: 0 -24px;
}
.graph-star-rating-header .star-rating {
    font-size: 17px;
}
.progress {
    background: #f2f4f8 none repeat scroll 0 0;
    border-radius: 0;
    height: 30px;
}
.rating-list {
    display: inline-flex;
    margin-bottom: 15px;
    width: 100%;
}
.rating-list-left {
    height: 16px;
    line-height: 29px;
    width: 10%;
}
.rating-list-center {
    width: 80%;
}
.rating-list-right {
    line-height: 29px;
    text-align: right;
    width: 10%;
}
.restaurant-slider-pics {
    bottom: 0;
    font-size: 12px;
    left: 0;
    z-index: 999;
    padding: 0 10px;
}
.restaurant-slider-view-all {
    bottom: 15px;
    right: 15px;
    z-index: 999;
}
.offer-dedicated-nav .nav-link.active,
.offer-dedicated-nav .nav-link:hover,
.offer-dedicated-nav .nav-link:focus {
    border-color: #3868fb;
    color: #3868fb;
}
.offer-dedicated-nav .nav-link {
    border-bottom: 2px solid #fff;
    color: #000000;
    padding: 16px 0;
    font-weight: 600;
}
.offer-dedicated-nav .nav-item {
    margin: 0 37px 0 0;
}
.restaurant-detailed-action-btn {
    margin-top: 12px;
}
.restaurant-detailed-header-right .btn-success {
    border-radius: 3px;
    height: 45px;
    margin: -18px 0 18px;
    min-width: 130px;
    padding: 7px;
}
.text-black {
    color: #000000;
}
.icon-overlap {
    bottom: -23px;
    font-size: 74px;
    opacity: 0.23;
    position: absolute;
    right: -32px;
}
.menu-list img {
    width: 41px;
    height: 41px;
    object-fit: cover;
}
.restaurant-detailed-header-left img {
    width: 88px;
    height: 88px;
    border-radius: 3px;
    object-fit: cover;
    box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075)!important;
}
.reviews-members .media .mr-3 {
    width: 56px;
    height: 56px;
    object-fit: cover;
}
.rounded-pill {
    border-radius: 50rem!important;
}
.total-like-user {
    border: 2px solid #fff;
    height: 34px;
    box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075)!important;
    width: 34px;
}
.total-like-user-main a {
    display: inline-block;
    margin: 0 -17px 0 0;
}
.total-like {
    border: 1px solid;
    border-radius: 50px;
    display: inline-block;
    font-weight: 500;
    height: 34px;
    line-height: 33px;
    padding: 0 13px;
    vertical-align: top;
}
.restaurant-detailed-ratings-and-reviews hr {
    margin: 0 -24px;
}
.graph-star-rating-header .star-rating {
    font-size: 17px;
}
.progress {
    background: #f2f4f8 none repeat scroll 0 0;
    border-radius: 0;
    height: 30px;
}
.rating-list {
    display: inline-flex;
    margin-bottom: 15px;
    width: 100%;
}
.rating-list-left {
    height: 16px;
    line-height: 29px;
    width: 10%;
}
.rating-list-center {
    width: 80%;
}
.rating-list-right {
    line-height: 29px;
    text-align: right;
    width: 10%;
}
.restaurant-slider-pics {
    bottom: 0;
    font-size: 12px;
    left: 0;
    z-index: 999;
    padding: 0 10px;
}
.restaurant-slider-view-all {
    bottom: 15px;
    right: 15px;
    z-index: 999;
}

.progress {
    background: #f2f4f8 none repeat scroll 0 0;
    border-radius: 0;
    height: 30px;
}
</style>
