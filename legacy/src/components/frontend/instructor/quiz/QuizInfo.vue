<template>
    <div>
        <notifications group="foo" />
        <form class="mt-4 form-horizontal">
            <div class="form-group">
                <label class="col-md-12">Quiz Heading *</label>
                <div class="col-md-12">
                    <input type="text" v-model="form.heading" class="form-control">
                    <has-error :form="form" field="heading"></has-error>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-12">Quiz Description *</label>
                <div class="col-md-12">
                    <textarea v-model="form.description" class="form-control" rows="5"></textarea>
                    <has-error :form="form" field="description"></has-error>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-12">Quiz Duration * <input type="checkbox" id="makeUnlimited" v-model="form.unlimitedTime">
                <label for="makeUnlimited">Unlimited Time</label></label>

                <div class="col-sm-12" v-if="!form.unlimitedTime">
                    <input type="number" v-model="form.duration" class="form-control">
                    <has-error :form="form" field="duration"></has-error>
                    <span class="help-block"><small>In Minutes</small></span>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-12">
                    <input type="checkbox" id="isGroupWork" v-model="form.is_group_work">
                    <label for="isGroupWork">Group Work (Only group leader can submit)</label>
                </label>
            </div>
            <button @click.prevent="saveQuizInfo" class="btn btn-success btn-rounded"><i class="icon icon-paper-plane"></i>
                <span>Save Changes</span>
            </button>
            <button v-if="questions.length == '' && this.quizData != ''" @click.prevent="addQuestion" class="btn btn-info btn-rounded"><i class="icon icon-plus"></i> Add New Question</button>
        </form>
    </div>
</template>
<script>
import { Form, HasError, AlertError } from 'vform'
    export default {
        props: ['questions', 'lessonId'],
        data() {
            return {
                quizData: '',
                form: new Form({
                    heading: '',
                    description: '',
                    duration: '',
                    unlimitedTime: false,
                    is_group_work: false,
                })
            }
        },

        methods: {
            saveQuizInfo() {
                this.form.post('/instructor/quiz-info/' + this.lessonId + '/create')
                .then(({data}) => {
                    this.quizData = data
                    Vue.notify({
                        group: 'foo',
                        type: 'primary',
                        title: 'Success!',
                        text: 'Quiz info saved successfully.'
                    })
                })
            },

            getQuizInfo() {
                axios.get('/api/quiz-info/' + this.lessonId + '/show')
                .then(({data}) => {
                    this.form.fill(data)
                    this.quizData = data
                    if(data.duration == 0) {
                        this.form.unlimitedTime = true;
                    }
                    // Ensure is_group_work is properly set as boolean
                    if (data.hasOwnProperty('is_group_work')) {
                        this.form.is_group_work = Boolean(data.is_group_work);
                    }
                })
            },

            addQuestion() {
                this.$emit('add-question')
            }
        },

        mounted() {
            this.getQuizInfo()
        }
    }
</script>
