<script>
import Meeting from "./Meeting"
import EmailInvitationModal from './EmailInvitationModal'
import CreateZoomMeetingModal from './CreateZoomMeetingModal'
import BallClip from '../../../components/animations/BallClip';
import SaveEmailForLaterUseModal from "./SaveEmailForLaterUseModal.vue";
export default {
    components: {
        Meeting,
        EmailInvitationModal,
        BallClip,
        CreateZoomMeetingModal,
        SaveEmailForLaterUseModal
    },
    data() {
        return {
            meetings: "",
            selectedMeeting: '',
            loading: true,
            editing: false,
            tags: '',
        };
    },
    mounted() {
        console.log("mounted hook");
    },
    created() {
        this.loading = true;
        this.loadMeetings();
    },
    methods: {
        loadMeetings() {
            axios.get('/instructor/zoom-meetings?ajax=1').then(response => {
                this.meetings = response.data;
                this.loading = false;
            });
        },
        editMeeting(meeting) {
            this.$refs.createZoomMeetingModal.handleEditMeeting(meeting);
        },
        handleAddNewMeeting() {
            this.$refs.createZoomMeetingModal.handleAddNewMeeting();
        },
        handleClickedInviteViaEmail(meeting) {
            this.selectedMeeting = meeting;
        },
        handleEmailInvitationSent(tags) {
            this.tags = tags;
        }
    }
};
</script>

<template>
    <div class="row">
        <div class="col-sm-12">
            <button class="btn btn-primary btn-rounded mb-4" @click="handleAddNewMeeting"><i class="fa fa-plus"></i> Add
                New Meeting</button>
            <div class="white-box">
                <div class="table-responsive">
                    <table id="myTable" class="table table-striped" data-form="deleteForm">
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>Topic</th>
                                <th>Start Time</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            <Meeting v-for="(meeting, index) in meetings" :key="index" :meeting="meeting" :index="index"
                                v-on:clickedInviteViaEmail="handleClickedInviteViaEmail" v-on:updated="loadMeetings"
                                v-on:editMeeting="editMeeting" />
                            <tr v-if="loading">
                                <td style="text-align: -webkit-center;" colspan="7">
                                    <BallClip class="text-center" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <CreateZoomMeetingModal ref="createZoomMeetingModal" v-on:loadMeetings="loadMeetings" />

<!--        <EmailInvitationModal :meeting="selectedMeeting" v-on:emailInvitationSent="handleEmailInvitationSent" />-->

        <SaveEmailForLaterUseModal :tags="tags" />
    </div>
</template>
