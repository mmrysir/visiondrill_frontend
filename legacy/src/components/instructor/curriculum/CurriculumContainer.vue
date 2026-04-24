<template>
    <div class="container-fluid">
    <div class="row bg-title">
        <div class="col-lg-3 col-md-4 col-sm-4 col-xs-12">
            <h4 class="page-title">
                <a href="/instructor/courses">
                    <i class="sticon ti-angle-left "></i>
                </a>&nbsp;Curriculum
            </h4>
        </div>
        <div class="col-lg-9 col-sm-8 col-md-8 col-xs-12">
            <!-- <a href="" class="btn btn-danger pull-right m-l-5 btn-rounded btn-outline  waves-effect waves-light">New Section
            </a>
            <a href="" class="btn btn-success pull-right m-l-20 btn-rounded btn-outline  waves-effect waves-light">Preview
            </a> -->
        </div>
    </div>
    <curriculum-sections :sections="sections" :course_id="course_id"></curriculum-sections>
</div>
</template>

<script>
import CurriculumSections from "./CurriculumSections.vue"
    export default {
        components: { CurriculumSections },
        props: ['sections', 'course_id'],
        mounted() {
            console.log(this.sections);
        }
    }
</script>
