<script>
import { hmsStore, hmsActions } from '../../../utils/hms';
import { selectPeerAudioByID } from '@100mslive/hms-video-store';
import { selectIsPeerAudioEnabled } from '@100mslive/hms-video-store';
import { selectLocalPeer } from '@100mslive/hms-video-store';
import UserMicOffIcon from './UserMicOffIcon.vue';
import UserMicOnIcon from './UserMicOnIcon.vue';
import store from './store.js';

export default {
    props: {
        peer: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            level: hmsStore.getState(selectPeerAudioByID(this.peer.id)) || 0,
            audioEnabled: '',
            isModerator: hmsStore.getState(selectLocalPeer).roleName === 'moderator',
            localPeerId: hmsStore.getState(selectLocalPeer).id,
        };
    },
    methods: {
        onAudioChange(newAudioState) {
            this.audioEnabled = newAudioState;
            if (this.peer.id === this.localPeerId) {
                store.isLocalAudioEnabled = newAudioState;
            }
        },

        updateAudioLevel(audioLevel) {
            this.level = audioLevel;
        },

        async mutePeer() {
            try {
                if (this.peer.id === hmsStore.getState(selectLocalPeer).id) {
                    Swal.fire({
                        title: 'You cannot mute yourself as a moderator',
                        text: 'Please use mute button to mute yourself.',
                        type: 'error',
                        confirmButtonText: 'OK',
                    });
                } else {
                    if (this.audioEnabled === false) {
                        this.$notify({
                            group: 'audio-room',
                            title: 'Request Sent!',
                            text: `Unmute request sent successfully!`,
                        });
                    }
                    await hmsActions.setRemoteTrackEnabled(this.peer.audioTrack, ! this.audioEnabled);
                }
            } catch (error) {
                // Permission denied or invalid track ID or not connected to room
                console.error(error);
            }
        },

        changeRole(role) {
            hmsActions.changeRole(this.peer.id, role, true);
        },
    },

    mounted() {
        console.log('peer information', this.peer);
        hmsStore.subscribe(this.onAudioChange, selectIsPeerAudioEnabled(this.peer.id));
        hmsStore.subscribe(this.updateAudioLevel, selectPeerAudioByID(this.peer.id));
    },

    components: { UserMicOffIcon, UserMicOnIcon }
}
</script>

<template>
    <div class="flex flex-col">
        <div class="relative flex dropdown">
            <div class="flex items-center justify-center w-16 h-16 border-2 rounded-full border-blue"
                :style="{ 'boxShadow': `0px 0px ${level || 0 / 4}px red` }">
                <span>
                    <img :src="JSON.parse(peer.metadata).photoUrl" class="w-12 h-12 rounded-full" />
                </span>
            </div>
            <span v-if="isModerator">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-three-dots" viewBox="0 0 16 16">
                    <path
                        d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg>
            </span>
            <div v-if="isModerator" class="absolute z-10 ml-10 text-gray-700 bg-white rounded-lg shadow-xl w-max dropdown-content">
                <a href="#" @click.prevent="mutePeer"
                    class="block px-2 py-2 rounded-t-lg hover:bg-dimgray hover:text-white">
                    <span v-if="audioEnabled">Mute</span>
                    <span v-else>Unmute</span>
                 </a>
                <a href="#" @click.prevent="changeRole('listener')"
                    class="block px-2 py-2 rounded-b-lg hover:bg-dimgray hover:text-white">Make Listener</a>
                <a href="#" @click.prevent="changeRole('speaker')"
                    class="block px-2 py-2 rounded-b-lg hover:bg-dimgray hover:text-white">Make Speaker</a>
            </div>
            <span class="mt-6 -ml-6">
                <UserMicOnIcon v-if="audioEnabled" />
                <UserMicOffIcon v-else />
            </span>
        </div>
        <h3 class="mt-2">{{ peer.name }}</h3>
    </div>
</template>

<style scoped>
/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}
</style>
