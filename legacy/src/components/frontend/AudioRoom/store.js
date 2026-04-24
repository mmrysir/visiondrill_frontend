import Vue from 'vue';
import { selectIsLocalAudioEnabled } from '@100mslive/hms-video-store';
import { hmsStore } from '../../../utils/hms';

export default Vue.observable({
    roomName: '',
    activeRoomId: '',
    isLocalAudioEnabled: hmsStore.getState(selectIsLocalAudioEnabled),
});
