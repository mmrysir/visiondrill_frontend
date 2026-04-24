<template>
    <div class="flex flex-col overflow-hidden rounded-lg shadow-lg" style="cursor: pointer;">
        <div class="relative">
            <img class="object-cover w-full h-48" v-lazy="course.thumbnail" alt="Course Thumbnail"
                @click.prevent="showCourse(course.slug)" />
            <div class="absolute top-0 right-0" @click.prevent="handle">
                <div class="flex items-center justify-center w-8 h-8 mt-3 mr-3 bg-white rounded-full"
                    :class="{ 'bg-red text-white': userHasBookmarked }" style="cursor: pointer;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                        class="fill-current bi bi-bookmark" viewBox="0 0 16 16">
                        <path
                            d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                    </svg>
                </div>
            </div>
            <div class="absolute bottom-0 left-0">
                <div class="flex items-center justify-center w-16 h-8 ml-3 text-center bg-white rounded-t-lg ">
                    <span>
                        <i class="fa fa-eye text-darkblue"></i>
                    </span>
                    <span class="ml-3">{{ course.view }}</span>
                </div>
            </div>
        </div>
        <div class="flex flex-col justify-between flex-1 px-3 py-4 bg-white">
            <div class="">
                <a :href="`/course/${course.slug}/learn`">
                    <p class="text-lg font-medium text-gray line-clamp">
                        {{ course.course_title }}
                    </p>
                </a>
            </div>
            <div class="flex items-center py-4 border-b border-lightgray"
                :class="{ 'pt-11': hasOneLineTitle(course.course_title) }">
                <a href="#" class="w-10">
                    <img class="w-10 h-10 rounded-full" :src="course.author.picture" alt="" />
                </a>
                <div class="ml-3">
                    <p class="text-sm font-medium text-mediumgray">
                        <a href="#" class="hover:underline">
                            {{ course.author.fullname }}
                        </a>
                    </p>
                </div>
            </div>
            <div class="flex items-center justify-end mt-3 text-lg text-gray">
                <!-- <div
          class="flex items-center"
          @click.prevent="upVote"
          style="cursor: pointer"
        >
          <i class="mr-2 fa fa-thumbs-up text-darkblue"></i>
          <span>{{ this.likecount }}</span>
        </div>
        <div
          class="flex items-center"
          @click.prevent="downVote"
          style="cursor: pointer"
        >
          <i class="mr-2 fa fa-thumbs-down text-red"></i>
          <span>{{ this.dislikecount }}</span>
        </div> -->
                <div>
                    <span v-if="!course.is_unlocked">
                        <span v-if="course.is_private">
                            <a href="#"><i class="mr-1 fa fa-lock" style="font-size: 16px"></i>
                                Private</a>
                        </span>
                    </span>
                    <span v-if="!course.is_private">
                        <a href="#">
                            {{ course.isPaid ? "$" + course.formattedPrice : "Free" }}
                        </a>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["course"],

    data() {
        return {
            likecount: "0",
            dislikecount: "0",
            userHasLiked: this.course.userHasLiked,
            userHasDisliked: this.course.userHasDisliked,
            course_id: this.course.id,
            userHasBookmarked: this.course.hasBookmarked,
            course_id: this.course.id,
        };
    },
    methods: {
        getVotes() {
            axios
                .get("/course/" + this.course_id + "/countvotes")
                .then((response) => {
                    this.likecount = response.data.like;
                    this.dislikecount = response.data.dislike;
                });
        },
        upVote() {
            if (!this.userHasLiked) {
                axios.get("/course/" + this.course_id + "/like");
                this.likecount++;
                if (this.userHasLiked == false && this.userHasDisliked == false) {
                    this.dislikecount;
                } else {
                    this.dislikecount--;
                }
                this.userHasLiked = true;
                this.userHasDisliked = false;
            }
        },
        downVote() {
            if (!this.userHasDisliked) {
                axios.get("/course/" + this.course_id + "/dislike");
                this.dislikecount++;
                if (this.userHasLiked == false && this.userHasDisliked == false) {
                    this.likecount;
                } else {
                    this.likecount--;
                }
                this.userHasDisliked = true;
                this.userHasLiked = false;
            }
        },

        addToWishlist() {
            axios.post("/course/" + this.course_id + "/create-bookmark");
            this.userHasBookmarked = true;
        },

        removeFromWishlist() {
            axios.delete("/course/" + this.course_id + "/delete-bookmark");
            this.userHasBookmarked = false;
        },

        handle() {
            if (this.userHasBookmarked == true) {
                this.removeFromWishlist();
            } else {
                this.addToWishlist();
            }
        },

        showCourse(slug) {
            window.location.href = `/course/${slug}/learn`;
        },

        formatCourseTitle(title) {
            if (title.length >= 40) {
                return title.substring(0, 40) + '...';
            }

            return title;
        },

        hasOneLineTitle(title) {
            return title.length < 24;
        }
    },
    mounted() {
        // this.getVotes();
    },
};
</script>

<style>
.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
