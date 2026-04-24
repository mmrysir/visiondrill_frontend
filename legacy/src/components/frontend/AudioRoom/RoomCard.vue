<script>
import getToken from '../../../utils/getToken.js';
import { hmsActions, hmsStore } from '../../../utils/hms.js';
import { selectLocalPeer } from '@100mslive/hms-video-store';
import TrashIcon from '../../../components/icons/TrashIcon.vue';
import Swal from 'sweetalert2';
import store from './store.js';
var moment = require('moment-timezone');

export default {
    props: {
        room: {
            type: Object,
            required: true,
        },

        username: {
            type: String,
            required: true,
        },
        photoUrl: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        }
    },

    components: {
        TrashIcon,
    },

    data() {
        return {
            //
        }
    },

    computed: {
        activeRoomId() {
            return store.activeRoomId;
        }
    },

    methods: {
        joinRoom() {
            if (new Date(this.toLocalTime(this.room.start_time)) >= new Date()) {
                alert('This room is scheduled for: ' + this.toLocalTime(this.room.start_time));
                return;
            }
            this.$emit('isConnecting', true);
            this.$emit('joiningRoom', this.room.name);
            store.roomName = this.room.name;
            getToken(this.role, this.room.room_id)
                .then((token) => {
                    console.log('here is token', token);
                    hmsActions.join({
                        userName: this.username || 'Anonymous',
                        authToken: token,
                        settings: {
                            isAudioMuted: true,
                        },
                        initEndpoint: undefined,
                        metaData: JSON.stringify({
                            photoUrl: this.photoUrl,
                            roomName: this.room.name,
                        }),
                    });
                })
                .catch((error) => {
                    console.log('Token API Error', error);
                });
        },

        deleteRoom() {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                console.log('here is the result', result);
                if (result.value) {
                    axios.delete(`/api/rooms/${this.room.id}`)
                    .then(response => {
                        Swal.fire(
                            'Deleted!',
                            'Room deleted successfully.',
                            'success'
                        );
                        this.$emit('roomDeleted');
                    });
                }
            })
        },

        toLocalTime(timestamp) {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const date = moment.unix(timestamp).tz(timeZone);
            return date.format('YYYY-MM-DD h:mm A');
        },
    }
}
</script>

<template>
    <div @click.stop.prevent="joinRoom" :class="{'border-2': activeRoomId === room.room_id}" class="px-5 py-6 mb-10 text-lg rounded-md cursor-pointer bg-lightblue text-gray hover:shadowd hover:border-2 hover:border-dashed">
        <div class="relative flex justify-between font-semibold poiner-events-none">
            <span>{{ room.name }}</span>
            <span class="absolute top-0 right-0 z-20" v-if="role === 'moderator'" @click.stop="deleteRoom">
                <TrashIcon />
            </span>
        </div>
        <div class="flex pt-4">
            <div class="flex mr-3">
                <div class="flex items-center justify-center border-4 border-white rounded-full h-14 w-14">
                    <span>
                        <img :src="room.moderator_avatar" class="w-12 h-12 rounded-full" />
                    </span>
                </div>
                <div class="flex items-center justify-center -ml-6 border-4 border-white rounded-full h-14 w-14">
                    <span>
                        <img src="https://picsum.photos/200" class="w-12 h-12 rounded-full" />
                    </span>
                </div>
                <div class="flex items-center justify-center -ml-6 border-4 border-white rounded-full h-14 w-14">
                    <span>
                        <img src="https://picsum.photos/200" class="w-12 h-12 rounded-full" />
                    </span>
                </div>
            </div>
            <div class="flex flex-col ml-3 text-mediumgray">
                <span>{{ room.moderator_name }}</span>
                <span>Others +</span>
            </div>
        </div>
        <div v-if="room.is_scheduled" class="mt-4">
            <div>
                <button class="p-1 text-xs text-white bg-teal-600 rounded">SCHEDULED</button>
                <div class="mt-1 flex justify-between items-center">
                    <span class="text-xs">{{ toLocalTime(room.start_time) }}</span>
                    <a @click.stop :href="room.add_to_google_calendar_link" target="_blank" class="text-sm hover:text-teal-600">Add to Calendar</a>
                </div>
            </div>
            <!-- <div class="flex flex-col bg-blue h-auto">
                <a @click.stop :href="room.add_to_google_calendar_link" target="_blank" class="text-sm hover:text-teal-600 align-bottom">Add to Calendar</a>
            </div> -->
        </div>
    </div>
</template>
