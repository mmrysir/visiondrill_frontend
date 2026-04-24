<script>
import { hmsActions, hmsStore, hmsNotifications, HMSNotificationTypes } from '../../../utils/hms';
import { selectPeers } from '@100mslive/hms-video-store';
import { selectPeerMetadata } from '@100mslive/hms-video-store';
import Footer from "./Footer.vue";
import User from './User.vue';
import store from './store.js';

export default {
    components: { User, Footer },

    data() {
        return {
            speakers: [],
            listeners: [],
            roomName: store.roomName,
        };
    },
    methods: {
        renderPeers(peers) {
            this.speakers = peers.filter(peer => peer.roleName === "speaker" || peer.roleName === 'moderator');
            this.listeners = peers.filter(peer => peer.roleName === "listener");
            console.log("list of peers", peers);
        },
    },
    mounted() {
        hmsStore.subscribe(this.renderPeers, selectPeers);

        hmsNotifications.onNotification((notification) => {
            switch (notification.type) {
                case HMSNotificationTypes.METADATA_UPDATED:
                    const peer = notification.data;
                    const { isHandRaised } = hmsStore.getState(selectPeerMetadata(peer.id))
                    if (isHandRaised && !peer.isLocal) {
                        console.log(peer);
                        this.$notify({
                            group: 'audio-room',
                            title: 'Hand Raised',
                            text: `${peer.name} is raising hand.`,
                            duration: -1,
                        });
                    }
                    break;
                case HMSNotificationTypes.CHANGE_TRACK_STATE_REQUEST:
                    const { requestedBy, track, enabled } = notification.data;
                    if (enabled) {
                        Swal.fire({
                            title: 'Unmute Request',
                            text: "Moderator wants you to unmute your mic.",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes, unmute mic!'
                        }).then(async(result) => {
                            console.log('result is', result);
                            if (result.value) {
                                await hmsActions.setEnabledTrack(track.id, enabled);
                                Swal.fire(
                                    'Unmuted!',
                                    'You are unmuted now.',
                                    'success'
                                )
                            }
                        })
                        // let answer = window.confirm('Moderator wants you to unmute mic');
                        // if (answer) {
                        //     hmsActions.setEnabledTrack(track.id, enabled);
                        // }
                    }
                    break;
            }
        });
    },
}
</script>

<template>
    <div>
        <notifications group="audio-room" />
        <div class="px-4 md:px-6 mb-2">
            <h2 class="text-xl font-medium text-gray">
                {{ roomName }}
            </h2>
        </div>
        <div class="px-4 md:px-6">
            <h2 class="text-lg font-medium text-gray">Speakers</h2>
            <div class="flex mt-6">
                <User v-for="peer in speakers" :peer="peer" :key="peer.id" class="mr-6" />
            </div>
        </div>

        <div class="px-4 mt-8 md:px-6">
            <h2 class="text-lg font-medium text-gray">Listeners</h2>
            <div class="flex mt-6">
                <User v-for="peer in listeners" :peer="peer" :key="peer.id" />
            </div>
        </div>

        <Footer :count="speakers.length + listeners.length" />
    </div>


</template>
