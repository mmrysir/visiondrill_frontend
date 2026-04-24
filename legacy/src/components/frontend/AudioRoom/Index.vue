<script>
import RoomCard from './RoomCard.vue';
import Room from './Room.vue';
import Speakers from './Speakers.vue';
import Listeners from './Listeners.vue';
import Footer from './Footer.vue';
import { hmsStore, hmsActions } from '../../../utils/hms';
import { selectIsConnectedToRoom } from '@100mslive/hms-video-store';
import { selectRoomID } from '@100mslive/hms-video-store';
import Modal from '../../../components/Modal.vue';
import AppButton from '../../../components/Button.vue';
import store from './store.js';
import DatePicker from 'vue2-datepicker';
var moment = require('moment-timezone');
import 'vue2-datepicker/index.css';

export default {
    components: {
        Modal,
        RoomCard,
        Room,
        Speakers,
        Listeners,
        Footer,
        AppButton,
    },

    props: ['username', 'photoUrl', 'role'],

    data() {
        return {
            isConnected: false,
            rooms: '',
            isModalVisible: false,
            roomName: '',
            timeRange: '',
            isScheduled: false,
            loading: false,
            activeRoomId: store.activeRoomId,
            urlParams: null,
        }
    },

    methods: {
        onRoomStateChange(connected) {
            this.isConnected = connected;
            this.loading = false;
        },

        getRooms() {
            axios.get('/api/rooms')
                .then(({ data }) => {
                    if (this.urlParams.has('id')) {
                        this.rooms = data.filter((room) => room.room_id == this.urlParams.get('id'));
                    } else {
                        this.rooms = data;
                    }
                });
        },

        addRoom() {
            this.loading = true;
            axios.post('/api/rooms', {
                name: this.roomName,
                is_public: true,
                time_range: this.timeRange,
                is_scheduled: this.isScheduled,
            }).then(response => {
                Swal.fire(
                    'Success!',
                    'Room added successfully.',
                    'success'
                );
                this.loading = false;
                this.roomName = '';
                this.isScheduled = false;
                this.timeRange = '';
                this.closeModal();
                this.getRooms();
            });
        },

        showModal() {
            this.isModalVisible = true;
        },

        closeModal() {
            this.isModalVisible = false;
        },

        setJoiningRoom(roomName) {
            this.roomName = roomName;
        },

        setJoinedRoomId(roomId) {
            store.activeRoomId = roomId;
        }
    },

    mounted() {
        hmsStore.subscribe(this.onRoomStateChange, selectIsConnectedToRoom);
        hmsStore.subscribe(this.setJoinedRoomId, selectRoomID);
        window.addEventListener('beforeunload', () => hmsActions.leave());
        window.addEventListener('onunload', () => hmsActions.leave());
        this.getRooms();
        this.urlParams = new URLSearchParams(window.location.search);
    }
}
</script>

<template>
    <div>
        <div v-if="rooms.length > 0" class="flex flex-col px-4 pt-12 md:flex-row md:px-10 lg:px-20">
            <div class="flex flex-col order-2 mt-10 lg:mt-0 md:mt-0 md:order-1 md:mr-3 lg:mr-6 md:w-5/12 lg:w-3/12">
                <AppButton @click.native="showModal" class="mb-2">+ Add Room</AppButton>
                <!-- <AppButton v-if="role == 'speaker'" @click.native="showModal" class="mb-2">+ Add Room</AppButton> -->
                <RoomCard v-for="(room, index) in rooms" :key="index" :room="room" :username="username"
                    :photoUrl="photoUrl" :role="room.is_moderator ? 'moderator' : role" @roomDeleted="getRooms"
                    @isConnecting="loading = true" @joiningRoom="setJoiningRoom" />
            </div>
            <div class="order-1 rounded-md md:order-2 md:ml-0 lg:ml-4 md:w-7/12 lg:w-9/12">

                <div class="pt-4 bg-lightblue rounded-md">
                    <Room v-if="isConnected"></Room>
                    <div v-else-if="loading" class="flex justify-center items-center pb-4">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                    </div>
                    <div v-else class="py-16 text-center">Please click on any room to Join.</div>
                </div>
            </div>
        </div>
        <div v-else class="mt-20">
            <div class="text-center">
                <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    aria-hidden="true">
                    <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 class="mt-2 font-medium text-gray-900">No Audio Rooms Found</h3>
                <p class="mt-1 text-gray-500">Get started by adding a new room.</p>
                <div class="mt-6">
                    <!-- <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    aria-hidden="true">
                    <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg> -->
                    <!-- <AppButton v-if="role === 'speaker'" @click.native="showModal" class="mb-2">+ Add Room</AppButton> -->
                    <AppButton @click.native="showModal" class="mb-2">+ Add Room</AppButton>
                </div>
            </div>
        </div>
        <Modal v-show="isModalVisible" @close="closeModal">
            <template v-slot:header>
                Add Room
            </template>

            <template v-slot:body>
                <form class="space-y-4">
                    <div class="flex flex-col">
                        <label for="roomName">Room Name</label>
                        <input v-model="roomName" type="text" required
                            class="mt-1 text-black bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            id="roomName" placeholder="Enter room name" style="min-width: 20rem;">
                    </div>

                    <div>
                        <label for="is_scheduled">Schedule Room</label>
                        <input id="is_scheduled" v-model="isScheduled" type="checkbox" />
                    </div>

                    <div v-if="isScheduled" class="flex flex-col">
                        <label for="roomName">Start & End Time</label>
                        <div class="mt-1">
                            <date-picker v-model="timeRange" range type="datetime" format="YYYY-MM-DD hh:mm a"
                           ></date-picker>
                        </div>
                    </div>
                </form>
            </template>

            <template v-slot:footer>
                <AppButton @click.native="addRoom" :disabled="loading">
                    <span v-if="!loading">Create Room</span>
                    <span v-else class="flex justify-center">
                        <svg class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                    </span>
                </AppButton>
            </template>
        </Modal>
    </div>
</template>
