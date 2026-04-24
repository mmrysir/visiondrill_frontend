<template>
    <div class="row">
        <div class="col-sm-12">
            <div class="white-box">
                <div class="col-lg-2 col-sm-4 col-xs-12">
                    <button @click.prevent="create()" class="btn btn-block btn-info"><i class="fa fa-plus"></i> Add New</button>
                </div>
                <div class="table-responsive">
                    <table class="table table-striped mt-4" data-form="deleteForm">
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>Business Details</th>
                                <th>Associated Account</th>
                                <th>Contact Number</th>
                                <th>Registered At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in business.data" :key="item.id">
                                <td>{{ index + 1 }}</td>
                                <td>
                                    <strong>Name:</strong> {{ item.name }}<br>
                                    <strong>Address:</strong> {{ item.address }}
                                </td>
                                <td>
                                    {{ item.user.email }}<br>
                                    <span v-if="item.user.is_approved" class="label label-rouded label-success">ACTIVE</span>
                                    <span v-if="!item.user.is_approved" class="label label-rouded label-danger">DEACTIVE</span>
                                </td>
                                <td>{{ item.contact_number }}</td>
                                <td>{{ item.created_at }}</td>
                                <td>
                                    <button type="button" @click.prevent="edit(item)" class="btn  btn-success" data-toggle="tooltip" title="Edit"><i class="fa fa-pencil"></i></button>
                                    <button type="button" @click.prevent="destroy(item)" class="btn btn-danger" data-toggle="tooltip" title="Delete"><i class="fa fa-trash"></i></button><br>
                                    <button v-if="!item.user.is_approved" type="button" @click.prevent="activateAccount(item)" class="btn btn-primary mt-2" data-toggle="tooltip" title="Activate Account">Activate Account.</button>
                                    <button v-if="item.user.is_approved" type="button" @click.prevent="deactivateAccount(item)" class="btn btn-danger mt-2" data-toggle="tooltip" title="Activate Account">Deactivate Account.</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="d-flex justify-item-center" v-if="business.data.length == 0" colspan="6">
                        <img src="/images/no-record-found.png">
                    </div>
                    <pagination :data="business" @pagination-change-page="index"></pagination>
                </div>
            </div>
        </div>
        <!-- modal start -->
        <div id="createBusinessModal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" style="display: none;">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title" id="myLargeModalLabel">
                            <span v-if="!editMode">Add New</span>
                            <span v-if="editMode">Edit</span> Business
                        </h4>
                    </div>
                    <form @submit.prevent="editMode ? update() : store()">
                        <div class="modal-body">
                            <div class="form-body">
                                <div class="form-group" :class="{ 'has-warning': form.errors.has('name')}">
                                    <label for="name">Business name *</label>
                                    <input type="text" class="form-control" :class="{ 'form-control-warning': form.errors.has('name') }" id="name" placeholder="Enter business name..." v-model="form.name">
                                    <has-error :form="form" field="name"></has-error>
                                </div>
                                <div class="form-group" :class="{ 'has-warning': form.errors.has('address')}">
                                    <label for="name">Business Address</label>
                                    <input type="text" class="form-control" :class="{'form-control-warning': form.errors.has('address')}" id="name" placeholder="Enter business address..." v-model="form.address">
                                    <has-error :form="form" field="address"></has-error>
                                </div>
                                <div class="form-group">
                                    <label for="contact_number">Contact Number</label>
                                    <input type="text" class="form-control" id="contact_number" placeholder="Enter contact number..." v-model="form.contact_number">
                                </div>
                                <h5 class="box-title font-bold">ACCOUNT INFO DETAILS</h5>
                                <div class="row">
                                    <div class="form-group col-md-6" :class="{'has-warning': form.errors.has('first_name')}">
                                        <label for="person_name">Associated Person First Name *</label>
                                        <input type="text" class="form-control" :class="{'form-control-warning': form.errors.has('first_name')}" id="person_name" placeholder="Enter associated person firstname..." v-model="form.user.first_name">
                                        <has-error :form="form" field="first_name"></has-error>
                                    </div>
                                    <div class="form-group col-md-6" :class="{'has-warning': form.errors.has('last_name')}">
                                        <label for="person_name">Associated Person Last Name *</label>
                                        <input type="text" class="form-control" :class="{'form-control-warning': form.errors.has('last_name')}" id="person_name" placeholder="Enter associated person lastname..." v-model="form.user.last_name">
                                        <has-error :form="form" field="last_name"></has-error>
                                    </div>
                                </div>
                                <div class="form-group" :class="{'has-warning': form.errors.has('email')}">
                                    <label for="email">Account Email *</label>
                                    <input type="email" class="form-control" :class="{'form-control-warning': form.errors.has('email')}" id="email" placeholder="Enter account email..." v-model="form.user.email">
                                    <has-error :form="form" field="email"></has-error>
                                </div>
                                <div v-if="!editMode" class="form-group" :class="{'has-warning': form.errors.has('password')}">
                                    <label for="password">Account Password *</label>
                                    <input type="password" class="form-control" :class="{'form-control-warning': form.errors.has('password')}" id="password" placeholder="Enter account password..." v-model="form.password">
                                    <has-error :form="form" field="password"></has-error>
                                </div>
                                <div v-if="!editMode" class="form-group">
                                    <label for="password_confirmation">Re-Enter Account Password*</label>
                                    <input type="password" class="form-control" id="password_confirmation" placeholder="Re-Enter account password..." v-model="form.password_confirmation">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-success waves-effect text-left" :class="{'disabled': loading}">
                                <span v-if="loading">Loading...</span>
                                <span v-else="loading"><i class="fa fa-save"></i> Save</span>
                            </button>
                            <button type="button" class="btn btn-danger waves-effect text-left" data-dismiss="modal"><i class="fa fa-close"></i> Close</button>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <!-- modal end -->
        <notifications group="foo" position="center bottom" />
    </div>
</template>
<script>
import { Form } from 'vform'
import { HasError, AlertError } from 'vform/src/components/bootstrap4'
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
export default {
    data() {
        return {
            editMode: false,
            loading: false,
            business: {},
            form: new Form({
                id: '',
                name: '',
                address: '',
                contact_number: '',
                password: '',
                password_confirmation: '',
                user: {
                    first_name: '',
                    last_name: '',
                    email: '',
                },
            }),
        }
    },

    methods: {
        index(page = 1) {
            axios.get('/admin/business?page=' + page)
                .then((response) => {
                    this.business = response.data;
                })
        },

        create() {
            this.editMode = false;
            this.form.reset();
            this.form.errors.clear();
            $('#createBusinessModal').modal('show');
        },

        store() {
            this.loading = true;
            this.form.post('/admin/business/create')
                .then(() => {
                    Vue.notify({
                        group: 'foo',
                        type: 'primary',
                        title: 'Success!',
                        text: 'Business account created successfully.'
                    })
                    this.$emit('updated');
                    $('#createBusinessModal').modal('hide');
                    this.loading = false;
                })
                .catch(() => {
                    Vue.notify({
                        group: 'foo',
                        type: 'error',
                        title: 'Error!',
                        text: 'Make sure all fields are entered correctly.'
                    })
                    this.loading = false;
                })
        },

        edit(item) {
            this.editMode = true;
            this.form.errors.clear();
            this.form.fill(item);
            $('#createBusinessModal').modal('show');
        },

        update() {
            this.loading = true;
            this.form.put('/admin/business/' + this.form.id + '/edit')
                .then(() => {
                    Vue.notify({
                        group: 'foo',
                        type: 'primary',
                        title: 'Success!',
                        text: 'Business account updated successfully.'
                    })
                    this.$emit('updated');
                    $('#createBusinessModal').modal('hide');
                    this.loading = false;
                })
        },

        destroy(item) {
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
                    axios.delete('/admin/business/' + item.id)
                        .then(() => {
                            Swal.fire(
                                'Deleted!',
                                'Business account has been deleted.',
                                'success'
                            )
                            this.$emit('updated');
                        })

                }
            })
        },

        activateAccount(item) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You are going to activate this corporate account!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, activate it!'
            }).then((result) => {
                if (result.value) {
                    axios.post('/admin/business/' + item.id + '/activate-account')
                        .then(() => {
                            Swal.fire(
                                'Activated!',
                                'Business account has been activated.',
                                'success'
                            )
                            this.$emit('updated');
                        })

                }
            })
        },

        deactivateAccount(item) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You are going to deactivate this corporate account!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, deactivate it!'
            }).then((result) => {
                if (result.value) {
                    axios.post('/admin/business/' + item.id + '/deactivate-account')
                        .then(() => {
                            Swal.fire(
                                'Deactivated!',
                                'Business account has been deactivated.',
                                'success'
                            )
                            this.$emit('updated');
                        })

                }
            })
        }

    },

    created() {
        this.index();

        this.$on('updated', () => { this.index() });
    }
}

</script>
<style scoped>
.modal-dialog {
    margin-top: 220px;
}

</style>
