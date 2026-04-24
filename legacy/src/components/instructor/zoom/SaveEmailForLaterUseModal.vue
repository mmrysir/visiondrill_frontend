<script>
import { Form } from 'vform';
import { HasError } from 'vform/src/components/bootstrap4'
Vue.component(HasError.name, HasError);

export default {
    props: ['tags'],

    data() {
        return {
            loading: false,
            segmentName: '',
            form: new Form({
                id: '',
            })
        }
    },

    methods: {
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
    }
}
</script>

<template>
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
        </div>
    </div>
</template>

<style scoped>
.modal-dialog {
    margin-top: 220px;
}
</style>
