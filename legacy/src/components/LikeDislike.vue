<template>
    <div class="row px-3 d-flex justify-content-end">
        <!-- <div class="left">
            <p>
                <a href="#" @click.prevent="upVote" tabindex="0">
                    <span class="text-lg">
                        <i class="text-blue fa fa-thumbs-up mr-2"></i>
                    </span>
                </a>
                {{ this.likecount}}
            </p>
        </div>
        <div class="mid">
            <p>
                <a href="#" @click.prevent="downVote" tabindex="0">
                    <span class="text-lg">
                        <i class="fa fa-thumbs-down mr-2 text-red"></i>
                    </span>
                </a>
                {{ this.dislikecount }}
            </p>
        </div> -->
        <div class="right">
            <span v-if="! course.is_unlocked">
                <span v-if="course.is_private">
                    <a href="#"><i class="fa fa-lock mr-1" style="font-size: 16px;"></i> Private</a>
                </span>
            </span>
            <span v-if="! course.is_private">
                <a href="#">
                    {{ course.isPaid ?  '$' + course.formattedPrice : 'Free' }}
                </a>
            </span>
        </div>
    </div>
</template>
<script>
export default {
    props: ['course'],

    data() {
        return {
            likecount: '0',
            dislikecount: '0',
            userHasLiked: this.course.userHasLiked,
            userHasDisliked: this.course.userHasDisliked,
            course_id: this.course.id
        }
    },
    methods: {
        getVotes() {
            axios.get('/course/' + this.course_id + '/countvotes')
                .then((response) => {
                    this.likecount = response.data.like
                    this.dislikecount = response.data.dislike
                })
        },
        upVote() {
            if (!this.userHasLiked) {
                axios.get('/course/' + this.course_id + '/like');
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
                axios.get('/course/' + this.course_id + '/dislike');
                this.dislikecount++;
                if (this.userHasLiked == false && this.userHasDisliked == false) {
                    this.likecount;
                } else {
                    this.likecount--;
                }
                this.userHasDisliked = true;
                this.userHasLiked = false;
            }
        }
    },
    mounted() {
        this.getVotes()
    }
}

</script>
