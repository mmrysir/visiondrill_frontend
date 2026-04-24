<template>
    <div class="row">
        <div class="col-sm-12">
            <div class="white-box">
                <div class="col-lg-3 col-sm-4 col-xs-12">
                    <button @click.prevent="create()" class="btn btn-outline btn-rounded btn-info"><i
                            class="fa fa-plus"></i> Create New Conference</button>
                </div>
                <div class="table-responsive">
                    <table class="table table-striped mt-4" data-form="deleteForm">
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>Conference Name</th>
                                <th>Start Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in conferences.data" :key="item.id">
                                <td>{{  index + 1  }}</td>
                                <td>
                                    {{  item.name  }}<br>
                                    <a :href="rootUrl + '/instructor/conferences/' + item.slug" target="_blank">Go
                                        Live</a> <i class="fa fa-external-link"></i>
                                </td>
                                <td><i class="fa fa-clock-o"></i> {{  toLocalTime(item.start_time)  }}</td>
                                <td>
                                    <button v-clipboard:copy="rootUrl + '/instructor/conferences/' + item.slug"
                                        v-clipboard:success="onCopy" type="button"
                                        class="btn  btn-success btn-rounded my-2" data-toggle="tooltip"
                                        title="Copy Conference Link"><i class="fa fa-copy"></i></button>
                                    <button type="button" @click.prevent="showInvitationModal(item)"
                                        class="btn  btn-success btn-rounded my-2" data-toggle="tooltip"
                                        title="Invite via Email"><i class="fa fa-envelope"></i></button>
                                    <button v-show="item.is_locked" type="button" @click.prevent="removePassword(item)"
                                        class="btn  btn-success btn-rounded my-2" data-toggle="tooltip"
                                        title="Remove password"><i class="fa fa-lock"></i></button>
                                    <button v-show="!item.is_locked" type="button"
                                        @click.prevent="showAddPasswordModal(item)"
                                        class="btn  btn-warning btn-rounded my-2" data-toggle="tooltip"
                                        title="Add Password"><i class="fa fa-unlock"></i></button>
                                    <button type="button" @click.prevent="edit(item)"
                                        class="btn btn-success btn-rounded my-2" data-toggle="tooltip" title="Edit"><i
                                            class="fa fa-pencil"></i></button>
                                    <button type="button" @click.prevent="destroy(item)"
                                        class="btn btn-danger btn-rounded my-2" data-toggle="tooltip" title="Delete"><i
                                            class="fa fa-trash"></i></button><br>
                                </td>
                            </tr>
                            <tr v-if="!conferences.data">
                                <td colspan="4" style="text-align: center;">
                                    <loading></loading>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="d-flex justify-item-center" v-if="conferences.length == 0" colspan="6">
                        <img src="/images/no-record-found.png">
                    </div>
                    <pagination :data="conferences" @pagination-change-page="index"></pagination>
                </div>
            </div>
        </div>
        <!-- modal start -->
        <div id="createConferenceModal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog"
            aria-labelledby="myLargeModalLabel" aria-hidden="true" style="display: none;">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myLargeModalLabel">
                            <span v-if="!editMode">Add New</span>
                            <span v-if="editMode">Edit</span> Conference
                        </h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    </div>
                    <form @submit.prevent="editMode ? updateConference() : createConference()">
                        <div class="modal-body">
                            <div class="form-body">
                                <div class="form-group" :class="{ 'has-error': form.errors.has('name') }">
                                    <label for="name">Conference name *</label>
                                    <input type="text" class="form-control"
                                        :class="{ 'form-control-error': form.errors.has('name') }" id="name"
                                        placeholder="Enter business name..." v-model="form.name">
                                    <has-error :form="form" field="name"></has-error>
                                </div>

                                <div class="form-group">
                                    <label for="time_range">Start Time & End Time *</label><br>
                                    <date-picker v-model="form.time_range" range type="datetime" format="YYYY-MM-DD hh:mm a"
                                        input-class="form-control" class="{ 'form-control-error': form.errors.has('time_range') }"></date-picker>
                                    <has-error :form="form" class="text-error" field="time_range"></has-error>
                                </div>
                                <!-- <div class="form-group">
                                    <label for="start_time">Start Time( Default NOW)</label><br>
                                    <datetime v-model="form.start_time" type="datetime" input-class="form-control" value-zone="Asia/Kathmandu" use12-hour></datetime>
                                </div> -->
                                <div class="form-group" :class="{ 'has-error': form.errors.has('password') }">
                                    <label for="password">Password *</label>
                                    <input type="text" class="form-control"
                                        :class="{ 'form-control-error': form.errors.has('password') }" id="password"
                                        placeholder="Enter conference password..." v-model="form.password">
                                    <has-error :form="form" field="password" class="text-error"></has-error>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-success waves-effect text-left"
                                :class="{ 'disabled': loading }">
                                <span v-if="loading">Loading...</span>
                                <span v-else="loading"><i class="fa fa-save"></i> Save</span>
                            </button>
                            <button type="button" class="btn btn-danger waves-effect text-left" data-dismiss="modal"><i
                                    class="fa fa-close"></i> Close</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <!-- modal end -->
        <!-- modal start -->
        <div id="emailInvitationModal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog"
            aria-labelledby="myLargeModalLabel" aria-hidden="true" style="display: none;">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myLargeModalLabel">
                            Invite Members via Email
                        </h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    </div>
                    <form @submit.prevent="sendInvitation()">
                        <div class="modal-body">
                            <div class="form-body">
                                <!-- <div class="form-group" :class="{ 'has-warning': form.errors.has('name') }">
                                    <div class="d-flex justify-content-between mb-2">
                                        <div>
                                            <label for="name">Email Segments</label>
                                            <span class="mytooltip tooltip-effect-2">
                                                <span class="tooltip-item py-1 rounded-circle"> <i
                                                        class="fa fa-question"></i></span>
                                                <span class="tooltip-content clearfix">
                                                    <span class="px-4 tooltip-text">
                                                        If you have not created any segments then you can choose
                                                        create a new segment option so that later on you can choose the
                                                        segment
                                                        to fill
                                                        out emails quickly.
                                                    </span>
                                                </span>
                                            </span>
                                        </div>

                                        <a href="#" @click.prevent="getEmailSegments()"
                                            class="mb-1 d-flex align-items-center justify-content-end"><i
                                                class="mr-2 fa fa-refresh"></i> Refresh List</a>
                                    </div>

                                    <select class="form-control" v-model="selectedSegment">
                                        <option value="">Select Segment Option</option>
                                        <option value="create">Create a New Segment</option>
                                        <option v-for="segment in emailSegments" :value="segment.id">{{  segment.name  }}
                                        </option>
                                    </select>
                                    <has-error :form="form" field="name"></has-error>
                                </div> -->

                                <!-- <div v-if="selectedSegment === 'create'" class="form-group"
                                    :class="{ 'has-warning': form.errors.has('name') }">
                                    <label for="name">Segment Name *</label>
                                    <input v-model="segmentName" type="text" class="form-control"
                                        placeholder="Eg: Internal teams email" />
                                    <has-error :form="form" field="name"></has-error>
                                </div> -->

                                <div class="form-group" :class="{ 'has-warning': form.errors.has('name') }">
                                    <div class="d-flex justify-content-between">
                                        <label for="name">Emails *</label>
                                        <div class="btn-group">
                                            <button @click="getEmailSegments" aria-expanded="false"
                                                data-toggle="dropdown"
                                                class="btn border-none btn-secondary btn-sm dropdown-toggle waves-effect waves-light"
                                                type="button"><i class="fa fa-history"></i> Use Previously Saved <span
                                                    class="caret"></span></button>
                                            <ul role="menu" class="dropdown-menu">
                                                <li v-if="emailSegments.length <= 0"><a href="#">Empty</a></li>
                                                <li @click.prevent="selectSegment(segment.id)"
                                                    v-for="segment in emailSegments" :key="segment.id"><a href="#">{{
                                                         segment.name  }}</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <vue-tags-input v-model="tag" :tags="tags" @tags-changed="newTags => tags = newTags"
                                        :autocomplete-items="filteredItems" placeholder="Enter email and press enter" />
                                    <has-error :form="form" field="name"></has-error>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-success btn-rounded btn-outline waves-effect text-left"
                                :class="{ 'disabled': loading }">
                                <span v-if="loading">Sending...</span>
                                <span v-else="loading"><i class="fa fa-send"></i> Send Invitation</span>
                            </button>
                            <button type="button" class="btn btn-danger waves-effect text-left btn-rounded btn-outline"
                                data-dismiss="modal"><i class="fa fa-close"></i> Close</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <!-- modal end -->
        <!-- save emails for later use modal start -->
        <div id="saveEmailForLaterUseModal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog"
            aria-labelledby="myLargeModalLabel" aria-hidden="true" style="display: none;">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myLargeModalLabel">
                            Do you want to save these emails for later use?
                        </h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    </div>
                    <form @submit.prevent="saveEmailSegment()">
                        <div class="modal-body">
                            <div class="form-body">
                                <div class="form-group" :class="{ 'has-warning': form.errors.has('name') }">
                                    <label for="name">Name *</label>
                                    <input v-model="segmentName" type="text" class="form-control"
                                        placeholder="Eg: My favourite emails" />
                                    <has-error :form="form" field="name"></has-error>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-success btn-rounded btn-outline waves-effect text-left"
                                :class="{ 'disabled': loading }">
                                <span v-if="loading">Loading...</span>
                                <span v-else="loading"><i class="fa fa-save"></i> Save Emails</span>
                            </button>
                            <button type="button" class="btn btn-danger waves-effect text-left btn-rounded btn-outline"
                                data-dismiss="modal"><i class="fa fa-close"></i> Don't Save</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <!-- save emails for later use modal end-->
        <!-- add password modal start -->
        <div id="addPasswordModal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog"
            aria-labelledby="myLargeModalLabel" aria-hidden="true" style="display: none;">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title" id="myLargeModalLabel">
                            Make conference <strong>password</strong> protected
                        </h4>
                        <h5><i class="fa fa-question-circle"></i> This ask users to enter password to attend video
                            conference session</h5>
                    </div>
                    <form @submit.prevent="addPassword()">
                        <div class="modal-body">
                            <div class="form-body">
                                <div class="form-group" :class="{ 'has-warning': form.errors.has('name') }">
                                    <label for="name">Password *</label>
                                    <input type="text" v-model="passwordForm.password" class="form-control">
                                    <has-error :form="passwordForm" field="password"></has-error>
                                </div>
                                <!-- <div class="form-group" :class="{ 'has-warning': form.errors.has('name')}">
                                    <label for="name">Password Confirmation *</label>
                                    <input type="password" v-model="passwordForm.password_confirmation" class="form-control">
                                    <has-error :form="passwordForm" field="password"></has-error>
                                </div> -->
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-success btn-rounded btn-outline waves-effect text-left"
                                :class="{ 'disabled': loading }">
                                <span v-if="loading">Loading...</span>
                                <span v-else="loading"><i class="fa fa-lock"></i> Add Password</span>
                            </button>
                            <button type="button" class="btn btn-danger waves-effect text-left btn-rounded btn-outline"
                                data-dismiss="modal"><i class="fa fa-close"></i> Close</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <!-- add password modal end -->
        <notifications group="foo" position="center bottom" />
    </div>
</template>
<script>

var moment = require('moment-timezone');
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import { Form } from 'vform'
import { HasError, AlertError } from 'vform/src/components/bootstrap4'
import VueClipboard from 'vue-clipboard2'
import VueTagsInput from '@johmun/vue-tags-input';
Vue.use(VueClipboard)
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
export default {
    components: {
        VueTagsInput,
        DatePicker
    },
    data() {
        return {
            tag: '',
            tags: [],
            autocompleteItems: [],
            debounce: null,
            passwordForm: new Form({
                password: '',
                password_confirmation: ''
            }),
            conferenceId: '',
            emailSegments: '',
            selectedSegment: '',
            segmentName: '',
            emails: '',
            editMode: false,
            loading: false,
            conferences: {},
            form: new Form({
                id: '',
                name: '',
                time_range: '',
                password: '',
            }),
        }
    },

    methods: {
        toLocalTime(timestamp) {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const date = moment.unix(timestamp).tz(timeZone);
            return date.format('YYYY-MM-DD h:mm:ss A (z)');
        },

        index(page = 1) {
            axios.get('/instructor/conferences?page=' + page)
                .then((response) => {
                    this.conferences = response.data;
                })
        },

        create() {
            this.editMode = false;
            this.form.reset();
            this.form.errors.clear();
            $('#createConferenceModal').modal('show');
        },

        store() {
            this.loading = true;
            this.form.post('/admin/business/create')
                .then(() => {
                    Vue.notify({
                        group: 'foo',
                        type: 'primary',
                        title: 'Success!',
                        text: 'Business account created successfully.'
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
        },

        edit(item) {
            this.editMode = true;
            this.form.errors.clear();
            this.form.fill(item);
            this.form.time_range = [new Date(this.toLocalTime(item.start_time)), new Date(this.toLocalTime(item.end_time))];
            $('#createConferenceModal').modal('show');
        },

        destroy(item) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value) {
                    axios.delete('/instructor/conferences/' + item.id)
                        .then(() => {
                            Swal.fire(
                                'Deleted!',
                                'Conference has been deleted.',
                                'success'
                            )
                            this.$emit('updated');
                        })

                }
            })
        },

        onCopy() {
            Vue.notify({
                group: 'foo',
                type: 'primary',
                title: 'Success!',
                text: 'Conference link copied successfully.'
            })
        },

        showInvitationModal(item) {
            this.conferenceId = item.id
            $('#emailInvitationModal').modal('show');
        },

        getEmailSegments() {
            axios.get('/business/conferences/email-segments')
                .then((response) => {
                    this.emailSegments = response.data;
                });
        },

        selectSegment(id) {
            this.selectedSegment = id;
        },

        sendInvitation() {
            this.loading = true;
            axios.post('/business/conferences/send-email-invitation', {
                selectedSegment: this.selectedSegment,
                segmentName: this.segmentName,
                conferenceId: this.conferenceId,
                emails: this.tags
            })
                .then(() => {
                    this.loading = false;
                    $('#emailInvitationModal').modal('hide');
                    Vue.notify({
                        group: 'foo',
                        type: 'primary',
                        title: 'Success!',
                        text: 'Invitation sent successfully.'
                    })
                    $('#saveEmailForLaterUseModal').modal('show');
                })
        },

        saveEmailSegment() {
            this.loading = true;
            axios.post('/business/conferences/save-email-segment', {
                segmentName: this.segmentName,
                emails: this.tags
            })
                .then(() => {
                    this.loading = false;
                    $('#saveEmailForLaterUseModal').modal('hide');
                    Vue.notify({
                        group: 'foo',
                        type: 'primary',
                        title: 'Success!',
                        text: 'Emails saved successfully.'
                    })
                })
        },

        createConference() {
            this.loading = true;
            this.form.post('/instructor/conferences/create')
                .then(() => {
                    Vue.notify({
                        group: 'foo',
                        type: 'primary',
                        title: 'Success!',
                        text: 'Conference created successfully.'
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
        },

        updateConference() {
            this.loading = true;
            this.form.patch('/instructor/conferences/' + this.form.id + '/edit')
                .then(() => {
                    Vue.notify({
                        group: 'foo',
                        type: 'primary',
                        title: 'Success!',
                        text: 'Conference updated successfully.'
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
        },

        showAddPasswordModal(item) {
            this.conferenceId = item.id
            $('#addPasswordModal').modal('show')
        },

        addPassword() {
            this.loading = true;
            this.passwordForm.post('/instructor/conferences/' + this.conferenceId + '/add-password')
                .then(() => {
                    Vue.notify({
                        group: 'foo',
                        type: 'primary',
                        title: 'Success!',
                        text: 'Conference password added successfully.'
                    })
                    this.passwordForm.reset();
                    this.loading = false;
                    this.$emit('updated');
                    $('#addPasswordModal').modal('hide');
                })
        },

        removePassword(item) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You want to remove password",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, remove password!'
            }).then((result) => {
                if (result.value) {
                    axios.put('/business/conferences/' + item.id + '/remove-password')
                        .then(() => {
                            Swal.fire(
                                'Removed!',
                                'Conference password has been removed.',
                                'success'
                            )
                            this.$emit('updated');
                        })

                }
            })
        },

        initItems() {
            if (this.tag.length < 2) return;

            const url = `/business/conferences/suggested-emails`;
            clearTimeout(null);
            this.debounce = setTimeout(() => {
                axios.get(url).then(response => {
                    this.autocompleteItems = response.data.map(a => {
                        return { text: a };
                    });
                }).catch(() => console.warn('Oh. something went wrong'));
            }, 600);
        }

    },

    created() {
        this.index();
        this.$on('updated', () => { this.index() });
        // this.getEmailSegments();
    },

    computed: {
        rootUrl: function () {
            return window.rootUrl;
        },

        filteredItems() {
            return this.autocompleteItems.filter(i => {
                return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
            });
        }
    },

    watch: {
        selectedSegment: function (newSegment, oldSegment) {
            if (typeof (newSegment) === 'number') {
                console.log('is a number');
                axios.get(`/email-segments/${newSegment}`)
                    .then((response) => {
                        this.tags = response.data;
                    });
            }
        },
        'tag': 'initItems',
    }
}

</script>
<style scoped>
.modal-dialog {
    margin-top: 220px;
}

.vdatetime-popup__header {
    background-color: red !important;
}
</style>
<style lang="css">
/* style the background and the text color of the input ... */
.vue-tags-input {
    background: #324652;
    min-width: 100%;
}

.vue-tags-input .ti-new-tag-input {
    background: transparent;
    color: #b7c4c9;
    font-size: 18px;
}

.vue-tags-input .ti-input {
    padding: 6px 10px;
    transition: border-bottom 200ms ease;
}

/* we cange the border color if the user focuses the input */
.vue-tags-input.ti-focus .ti-input {
    /*border: 1px solid #ebde6e;*/
}

/* some stylings for the autocomplete layer */
.vue-tags-input .ti-autocomplete {
    background: #283944;
    border: 1px solid #8b9396;
    border-top: none;
    color: white;
    padding: 6px 0px 6px 0px;
}

/* the selected item in the autocomplete layer, should be highlighted */
.vue-tags-input .ti-item.ti-selected-item {
    background: #ebde6e;
    color: #283944;
}

/* style the placeholders color across all browser */
.vue-tags-input ::-webkit-input-placeholder {
    color: #a4b1b6;
}

.vue-tags-input ::-moz-placeholder {
    color: #a4b1b6;
}

.vue-tags-input :-ms-input-placeholder {
    color: #a4b1b6;
}

.vue-tags-input :-moz-placeholder {
    color: #a4b1b6;
}

/* default styles for all the tags */
.vue-tags-input .ti-tag {
    position: relative;
    background: #ebde6e;
    color: #283944;
    font-size: 18px;
}

/* we defined a custom css class in the data model, now we are using it to style the tag */
.vue-tags-input .ti-tag.custom-class {
    background: transparent;
    border: 1px solid #ebde6e;
    color: #ebde6e;
    margin-right: 4px;
    border-radius: 0px;
    font-size: 13px;
}

/* the styles if a tag is invalid */
.vue-tags-input .ti-tag.ti-invalid {
    background-color: #e88a74;
}

/* if the user input is invalid, the input color should be red */
.vue-tags-input .ti-new-tag-input.ti-invalid {
    color: #e88a74;
}

/* if a tag or the user input is a duplicate, it should be crossed out */
.vue-tags-input .ti-duplicate span,
.vue-tags-input .ti-new-tag-input.ti-duplicate {
    text-decoration: line-through;
}

/* if the user presses backspace, the complete tag should be crossed out, to mark it for deletion */
.vue-tags-input .ti-tag:after {
    transition: transform .2s;
    position: absolute;
    content: '';
    height: 2px;
    width: 108%;
    left: -4%;
    top: calc(50% - 1px);
    background-color: #000;
    transform: scaleX(0);
}

.ti-tag:before {
    content: '';
}

.vue-tags-input .ti-deletion-mark:after {
    transform: scaleX(1);
}

.my-2 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}

.mx-datepicker {
    width: 100%;
}
</style>
