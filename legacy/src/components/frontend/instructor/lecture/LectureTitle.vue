<template>
    <div class="col-lg-9 col-sm-8 col-md-8 col-xs-12">
            <h4 v-if="!editing" class="page-title">
            <a :href="'/instructor/courses/'+lesson.course_id+'/curriculum'" ><i class="sticon ti-angle-left  m-r-10"></i></a>{{ lesson.title }}
            <a href="#" @click.prevent="editing=true"><i class="sticon ti-pencil"></i></a>
            </h4>
            <span v-if="editing">
                <input type="text" name="title" v-model="lesson.title"/>
                <button @click.prevent="saveTitle()"  type="button" class="btn btn-info btn-circle"><i class="fa fa-check"></i> </button>
                <button @click.prevent="cancel()" type="button" class="btn btn-warning btn-circle"><i class="fa fa-times"></i> </button>
            </span>
        </div>
</template>

<script>
    export default {
        data() {
            return {
                editing: false,
                originaltitle: null
            }
        },
        props: ['lesson'],
        methods: {
            cancel() {
                this.editing = false;
                this.lesson.title = this.originaltitle;
            },
            saveTitle() {
                axios.post('/api/instructor/lecture/'+this.lesson.id+'/update', {
                    title: this.lesson.title
                })
                .then(() => {
                    this.editing = false;
                    this.originaltitle = this.lesson.title;
                })
            }
        },
        created() {
            this.originaltitle = this.lesson.title;
        }
    }
</script>