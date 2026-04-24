<script>
import { hmsActions, hmsStore } from '../../../utils/hms';
import AudioButton from './AudioButton.vue';
import { selectIsLocalAudioEnabled, selectLocalPeerID, selectPeerMetadata } from '@100mslive/hms-video-store';
import { selectLocalPeer } from '@100mslive/hms-video-store';
import HandRaiseIcon from './HandRaiseIcon.vue';
import HandRaiseOnIcon from './HandRaiseOnIcon.vue';
import HandRaiseOffIcon from './HandRaiseOffIcon.vue';
import UserCount from './UserCount.vue';
import store from './store';
import ShareIcon from './ShareIcon.vue';

export default {
    props: {
        count: {
            type: Number,
            required: true,
        }
    },

    components: {
        AudioButton,
        HandRaiseIcon,
        UserCount,
        HandRaiseOnIcon,
        HandRaiseOffIcon,
        ShareIcon,
    },

    data() {
        return {
            // isLocalAudioEnabled: hmsStore.getState(selectIsLocalAudioEnabled),
            isLocalHandRaised: false,
        };
    },
    methods: {
        async toggleAudio() {
            const enabled = hmsStore.getState(selectIsLocalAudioEnabled);
            await hmsActions.setLocalAudioEnabled(!enabled);
            // console.log('local peer id', hmsStore.getState(selectLocalPeer).id);
            // hmsActions.setLocalAudioEnabled(! this.isLocalAudioEnabled).then(() => {
            //     store.isLocalAudioEnabled = hmsStore.getState(selectIsLocalAudioEnabled);
            // });
        },

        leaveRoom() {
            hmsActions.leave();
        },

         toggleRaiseHand() {
            const localPeerId = hmsStore.getState(selectLocalPeerID);
            console.log('local peer id', localPeerId);
            const metadata = hmsStore.getState(selectPeerMetadata(localPeerId));
            const newMetadata = { ...metadata, isHandRaised: !metadata.isHandRaised };
            this.isLocalHandRaised = newMetadata.isHandRaised;
            hmsActions.changeMetadata(newMetadata);
            console.log('toggle hand raise finished.');
            console.log('meta data is', store.activeRoomId);
        },

        copyShareLink() {
            navigator.clipboard.writeText(`${window.location.href}?id=${store.activeRoomId}`);
            this.$notify({
                group: 'audio-room',
                title: 'Copied to clipboard',
                text: `Sharing link copied to clipboard.`,
            });
        }
    },
    computed: {
        isLocalAudioEnabled() {
            return store.isLocalAudioEnabled;
        }
    }
}
</script>

<template>
    <div class="fixed inset-x-0 bottom-0 flex items-center justify-between px-4 py-3 mt-16 md:static bg-gray rounded-b-md">
        <div class="flex items-center">
            <UserCount :count="count" />

            <span class="mr-2 cursor-pointer" @click.prevent="toggleRaiseHand">
                <HandRaiseIcon v-if="isLocalHandRaised" />
                <HandRaiseOffIcon v-else />
            </span>

            <AudioButton @toggleAudio="toggleAudio" :active="isLocalAudioEnabled" />

            <span @click="copyShareLink" class="ml-4 text-white bg-red-100 rounded-full cursor-pointer">
                <ShareIcon />
            </span>
        </div>
        <div>
            <button @click.prevent="leaveRoom()" class="px-4 py-1 text-sm text-white rounded-lg bg-red">
                Leave quietly
            </button>
        </div>
    </div>
</template>
