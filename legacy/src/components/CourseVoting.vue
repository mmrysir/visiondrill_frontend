<template>
    <span>
        <li>
            <p>
                <a href="#" @click.prevent="upVote">
                    <!-- <span class="icon-thumbs-up mr-2"></span> -->
                    <span class="text-lg">
                        <i class="text-blue fa fa-thumbs-up mr-2"></i>
                    </span>
                </a>{{ this.likecount}}</p>
        </li>
        <li>
            <p>
                <a href="#" @click.prevent="downVote">
                    <!-- <span class="icon-thumbs-down mr-2"></span> -->
                    <span class="text-lg">
                        <i class="fa fa-thumbs-down mr-2 text-red"></i>
                    </span>
                </a>{{ this.dislikecount }}</p>
        </li>
    </span>
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
