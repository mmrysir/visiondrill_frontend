<template>
    <div>
        <div class="reviews-members pt-4 pb-4">
            <div class="media" style="overflow: scroll;">
                <a href="#"><img alt="User image" :src="review.user.student_picture" class="mr-3 rounded-pill"></a>
                <div class="media-body">
                    <div class="reviews-members-header">
                        <span class="star-rating float-right">
                          <a href="#" class="star" v-for="index in review.rating" :key="index"><i class="icofont-ui-rating active"></i></a>
                        </span>
                        <h6 class="mb-1"><a class="text-black" href="#">{{ review.user.fullname }}</a></h6>
                        <p class="text-gray">{{ review.created_at }}</p>
                    </div>
                    <div class="reviews-members-body">
                        <p>{{ review.description }}</p>
                    </div>
                    <!-- <div class="reviews-members-footer">
                        <a class="total-like" href="#"><i class="icofont-thumbs-up"></i> 856M</a> <a class="total-like" href="#"><i class="icofont-thumbs-down"></i> 158K</a>
                        <span class="total-like-user-main ml-2" dir="rtl">
                              <a data-toggle="tooltip" data-placement="top" title="" href="#" data-original-title="Gurdeep Osahan"><img alt="Generic placeholder image" src="http://bootdey.com/img/Content/avatar/avatar5.png" class="total-like-user rounded-pill"></a>
                              <a data-toggle="tooltip" data-placement="top" title="" href="#" data-original-title="Gurdeep Singh"><img alt="Generic placeholder image" src="http://bootdey.com/img/Content/avatar/avatar2.png" class="total-like-user rounded-pill"></a>
                              <a data-toggle="tooltip" data-placement="top" title="" href="#" data-original-title="Askbootstrap"><img alt="Generic placeholder image" src="http://bootdey.com/img/Content/avatar/avatar3.png" class="total-like-user rounded-pill"></a>
                              <a data-toggle="tooltip" data-placement="top" title="" href="#" data-original-title="Osahan"><img alt="Generic placeholder image" src="http://bootdey.com/img/Content/avatar/avatar4.png" class="total-like-user rounded-pill"></a>
                              </span>
                    </div> -->
                </div>
            </div>
        </div>
    <hr>
</div>
</template>

<script>
    export default {
        props: ['review']
    }
</script>
