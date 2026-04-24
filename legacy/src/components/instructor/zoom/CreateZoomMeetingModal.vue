<template>
    <div>
        <!-- modal start -->
        <div id="createConferenceModal" class="modal fade bs-example-modal-lg mt-4" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title" id="myLargeModalLabel">
                            <span v-if="!editing">Add New</span>
                            <span v-if="editing">Edit</span> Conference
                        </h4>import { Form, HasError, AlertError } from 'vform'
                    </div>
                    <form @submit.prevent="editing ? updateZoomMeeting() : createZoomMeeting()">
                        <div class="modal-body">
                            <div class="form-body">
                                <div class="form-group" :class="{ 'has-error': form.errors.has('name')}">
                                    <label for="name">Meeting Topic *</label>
                                    <input type="text" class="form-control" :class="{ 'form-control-error': form.errors.has('topic') }" id="topic" placeholder="Enter meeting topic..." v-model="form.topic">
                                    <has-error :form="form" field="topic"></has-error>
                                </div>
                                <div class="form-group">
                                    <label for="start_time">Start Time(Timezone will be the same as the one you used on Zoom)</label><br>
                                    <date-picker v-model="form.start_time" type="datetime" format="YYYY-MM-DD hh:mm a" input-class="form-control"></date-picker>
                                </div>
                                <div class="form-group" :class="{ 'has-error': form.errors.has('password')}">
                                    <label for="password">Password </label>
                                    <input type="text" class="form-control" :class="{ 'form-control-error': form.errors.has('password') }" id="password" placeholder="Enter password for meeting..." v-model="form.password">
                                    <has-error :form="form" field="password" class="text-error"></has-error>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-success waves-effect text-left" :class="{'disabled': loading}">
                                <span v-if="loading">Loading...</span>
                                <span v-else="loading"><i class="fa fa-save"></i> Save</span>
                            </button>
                            <button type="button" class="btn btn-danger waves-effect text-left" data-dismiss="modal"><i class="fa fa-close"></i> Close</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <!-- modal end -->
        <notifications group="foo" position="center bottom" />
    </div>
</template>

<script>
import { Form, HasError, AlertError } from 'vform'
var moment = require('moment-timezone');
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
    export default {
        components: {
            DatePicker,
        },

        data() {
            return {
                editing: false,
                loading: false,
                form: new Form({
                    id: '',
                    topic: '',
                    start_time: '',
                    password: '',
                }),
            }
        },

        methods: {
            handleAddNewMeeting() {
                this.editing = false;
                this.form.reset();
                this.form.errors.clear();
                $('#createConferenceModal').modal('show');
            },

            handleEditMeeting(meeting) {
                this.editing = true;
                this.form.errors.clear();
                this.form.fill(meeting);
                $('#createConferenceModal').modal('show');
            },

            createZoomMeeting() {
                this.loading = true;
                this.form.post('/instructor/zoom-meetings/create')
                .then(() => {
                    Vue.notify({
                        group: 'foo',
                        type: 'primary',
                        title: 'Success!',
                        text: 'Zoom meeting created successfully.'
                    })
                    this.$emit('updated');
                    $('#createConferenceModal').modal('hide');
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
            },

            updateZoomMeeting() {
                this.loading = true;
                this.form.put('/instructor/zoom-meetings/' + this.form.id + '/edit')
                .then(() => {
                    Vue.notify({
                        group: 'foo',
                        type: 'primary',
                        title: 'Success!',
                        text: 'Zoom meeting updated successfully.'
                    })
                    this.$emit('updated');
                    $('#createConferenceModal').modal('hide');
                    this.loading = false;
                })
                .catch(() => {
                    Vue.notify({
                        group: 'foo',
                        type: 'error',
                        title: 'Error!',
                        text: 'Make sure all fields are entered correctly.'
                    })
                    this.loading = false;
                })
            }
        },

        created() {
            this.$on('updated', () => { this.$emit('loadMeetings') });
        }
    }
</script>

<style scoped>
.my-2 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}

.mx-datepicker {
    width: 100%;
}
</style>
