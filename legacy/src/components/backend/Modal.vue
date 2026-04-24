<template>
    <div id="createBusinessModal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" style="display: none;">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title" id="myLargeModalLabel">Add New Business</h4>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-body">
                            <div class="form-group">
                                <label for="name">Business name *</label>
                                <input type="text" class="form-control" id="name" placeholder="Enter business name..." v-model="form.businessName">
                            </div>
                            <div class="form-group">
                                <label for="name">Business Address</label>
                                <input type="text" class="form-control" id="name" placeholder="Enter business address..." v-model="form.businessAddress">
                            </div>
                            <div class="form-group">
                                <label for="person_name">Associated Person Name *</label>
                                <input type="text" class="form-control" id="person_name" placeholder="Enter associated person name..." v-model="form.personName">
                            </div>
                            <div class="form-group">
                                <label for="contact_number">Contact Number</label>
                                <input type="text" class="form-control" id="contact_number" placeholder="Enter contact number..." v-model="form.contactNumber">
                            </div>
                            <h5 class="box-title font-bold">ACCOUNT INFO DETAILS</h5>
                            <div class="form-group">
                                <label for="email">Account Email *</label>
                                <input type="email" class="form-control" id="email" placeholder="Enter account email..." v-model="form.email">
                            </div>
                            <div class="form-group">
                                <label for="password">Account Password *</label>
                                <input type="password" class="form-control" id="password" placeholder="Enter account password..." v-model="form.password">
                            </div>
                            <div class="form-group">
                                <label for="password_confirmation">Re-Enter Account Password*</label>
                                <input type="password" class="form-control" id="password_confirmation" placeholder="Re-Enter account password..." v-model="form.passwordConfirmation">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button @click.prevent="store()" type="button" class="btn btn-success waves-effect text-left"><i class="fa fa-save"></i> Save</button>
                    <button type="button" class="btn btn-danger waves-effect text-left" data-dismiss="modal"><i class="fa fa-close"></i> Close</button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->
</template>
<script>
import { Form, HasError, AlertError } from 'vform'
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

export default {
    props: ['item'],
    data() {
        return {
            form: new Form({
                businessName: '',
                businessAddress: '',
                personName: '',
                contactNumber: '',
                email: '',
                password: '',
                passwordConfirmation: '',
            }),
        }
    },

    methods: {
        store() {
            this.form.post('/admin/business/create')
                .then(() => {
                    console.log('done');
                })
        },

        edit(item) {
            this.form.fill(item);
            $('#createBusinessModal').modal('show');
        }
    }
}

</script>
<style scoped>
.modal-dialog {
    margin-top: 220px;
}

</style>
