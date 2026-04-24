<script>
var moment = require('moment-timezone');
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);
export default {
    props: ["meeting", "index"],
    data() {
        return {
            meetingId: ""
        };
    },
    methods: {
        toLocalTime(timestamp) {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const date = moment.unix(timestamp).tz(timeZone);
            return date.format('YYYY-MM-DD h:mm:ss A (z)');
        },
        showInvitationModal(meeting) {
            this.meetingId = meeting.id;
            this.$emit("clickedInviteViaEmail", meeting);
            $("#emailInvitationModal").modal("show");
        },
        copiedMeetingUrl() {
            Swal.fire("Success!", "Meeting URL copied successfully.", "success");
        },
        editMeeting(meeting) {
            this.$emit('editMeeting', meeting);
        },
        deleteMeeting(meeting) {
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
                    axios.delete('/instructor/zoom-meetings/' + meeting.id)
                        .then(() => {
                            Swal.fire(
                                'Deleted!',
                                'Zoom meeting has been deleted.',
                                'success'
                            )
                            this.$emit('updated');
                        })

                }
            })
        }
    }
};
</script>

<template>
    <tr>
        <td>{{ index + 1 }}</td>
        <td>
            {{ meeting.topic }} <br />
            <a :href="meeting.join_url" target="_blank">Go Live</a> <i class="fa fa-external-link"></i>
        </td>
        <td>{{ toLocalTime(meeting.start_time) }}</td>
        <td>
            <button v-clipboard:copy="meeting.join_url" v-clipboard:success="copiedMeetingUrl" type="button"
                class="btn  btn-success btn-rounded my-2" data-toggle="tooltip" title="Copy Meeting URL">
                <i class="fa fa-copy"></i>
            </button>
<!--            <button type="button" @click.prevent="showInvitationModal(meeting)"-->
<!--                class="btn  btn-success btn-rounded my-2" data-toggle="tooltip" title="Invite via Email">-->
<!--                <i class="fa fa-envelope"></i>-->
<!--            </button>-->
            <button type="button" @click.prevent="editMeeting(meeting)" class="btn btn-success btn-rounded my-2"
                data-toggle="tooltip" title="Edit"><i class="fa fa-pencil"></i></button>
            <button type="button" @click.prevent="deleteMeeting(meeting)" class="btn btn-danger btn-rounded my-2"
                data-toggle="tooltip" title="Delete"><i class="fa fa-trash"></i></button><br>
        </td>
    </tr>
</template>
