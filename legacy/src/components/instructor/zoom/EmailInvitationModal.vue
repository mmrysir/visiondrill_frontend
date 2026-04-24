<script>
import { Form } from "vform";
import { HasError } from 'vform/src/components/bootstrap4'
import VueTagsInput from "@johmun/vue-tags-input";
Vue.component(HasError.name, HasError);

export default {
    props: ["meeting"],
    components: {
        VueTagsInput,
    },
    data() {
        return {
            tag: "",
            tags: [],
            autocompleteItems: [],
            debounce: null,
            emailSegments: '',
            selectedSegment: '',
            loading: false,
            emails: "",
            form: new Form({
                id: ""
            })
        };
    },
    methods: {
        sendInvitation() {
            this.loading = true;
            axios
                .post("/instructor/zoom-meetings/send-email-invitation", {
                    meeting: this.meeting,
                    emails: this.tags
                })
                .then(() => {
                    this.loading = false;
                    $("#emailInvitationModal").modal("hide");
                    Swal.fire(
                        "Success!",
                        "Invitation sent successfully.",
                        "success"
                    );
                    $('#saveEmailForLaterUseModal').modal('show');
                    this.$emit('emailInvitationSent', this.tags);
                });
        },

        getEmailSegments() {
            axios.get('/business/conferences/email-segments')
                .then((response) => {
                    this.emailSegments = response.data;
                });
        },

        selectSegment(id) {
            this.selectedSegment = id;
        },

        initItems() {
            if (this.tag.length < 2) return;

            const url = `/business/conferences/suggested-emails`;
            clearTimeout(null);
            this.debounce = setTimeout(() => {
                axios.get(url).then(response => {
                    this.autocompleteItems = response.data.map(a => {
                        return { text: a };
                    });
                }).catch(() => console.warn('Oh. something went wrong'));
            }, 600);
        }
    },

    watch: {
        selectedSegment: function (newSegment, oldSegment) {
            if (typeof (newSegment) === 'number') {
                axios.get(`/email-segments/${newSegment}`)
                    .then((response) => {
                        this.tags = response.data;
                    });
            }
        },
        'tag': 'initItems',
    },

    computed: {
        filteredItems() {
            return this.autocompleteItems.filter(i => {
                return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
            });
        }
    }
};
</script>

<template>
    <div id="emailInvitationModal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog"
        aria-labelledby="myLargeModalLabel" aria-hidden="true" style="display: none;">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        ×
                    </button>
                    <h4 class="modal-title" id="myLargeModalLabel">
                        Invite Members via Email
                    </h4>
                </div>
                <form @submit.prevent="sendInvitation()">
                    <div class="modal-body">
                        <div class="form-body">
                            <div class="form-group" :class="{
                                'has-warning': form.errors.has('name')
                            }">

                                <div class="d-flex justify-content-between">
                                    <label for="name">Emails *</label>
                                    <div class="btn-group">
                                        <button @click="getEmailSegments" aria-expanded="false" data-toggle="dropdown"
                                            class="btn border-none btn-secondary btn-sm dropdown-toggle waves-effect waves-light"
                                            type="button"><i class="fa fa-history"></i> Use Previously Saved <span
                                                class="caret"></span></button>
                                        <ul role="menu" class="dropdown-menu">
                                            <li v-if="emailSegments.length <= 0"><a href="#">Empty</a></li>
                                            <li @click.prevent="selectSegment(segment.id)"
                                                v-for="segment in emailSegments" :key="segment.id"><a href="#">{{
                                                        segment.name
                                                }}</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <vue-tags-input v-model="tag" :tags="tags" @tags-changed="newTags => tags = newTags"
                                    :autocomplete-items="filteredItems" placeholder="Enter email and press enter" />
                                <has-error :form="form" field="name"></has-error>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-success btn-rounded btn-outline waves-effect text-left"
                            :class="{ disabled: loading }">
                            <span v-if="loading">Sending...</span>
                            <span v-else="loading"><i class="fa fa-send"></i> Send
                                Invitation</span>
                        </button>
                        <button type="button" class="btn btn-danger waves-effect text-left btn-rounded btn-outline"
                            data-dismiss="modal">
                            <i class="fa fa-close"></i> Close
                        </button>
                    </div>
                </form>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
</template>

<style scoped>
.modal-dialog {
    margin-top: 220px;
}

.vdatetime-popup__header {
    background-color: red !important;
}
</style>
<style lang="css">
/* style the background and the text color of the input ... */
.vue-tags-input {
    background: #324652;
    min-width: 100%;
}

.vue-tags-input .ti-new-tag-input {
    background: transparent;
    color: #b7c4c9;
    font-size: 18px;
}

.vue-tags-input .ti-input {
    padding: 4px 10px;
    transition: border-bottom 200ms ease;
}

/* we cange the border color if the user focuses the input */
.vue-tags-input.ti-focus .ti-input {
    /*border: 1px solid #ebde6e;*/
}

/* some stylings for the autocomplete layer */
.vue-tags-input .ti-autocomplete {
    background: #283944;
    border: 1px solid #8b9396;
    border-top: none;
    color: white;
    padding: 6px 0px 6px 0px;
}

/* the selected item in the autocomplete layer, should be highlighted */
.vue-tags-input .ti-item.ti-selected-item {
    background: #ebde6e;
    color: #283944;
}

/* style the placeholders color across all browser */
.vue-tags-input ::-webkit-input-placeholder {
    color: #a4b1b6;
}

.vue-tags-input ::-moz-placeholder {
    color: #a4b1b6;
}

.vue-tags-input :-ms-input-placeholder {
    color: #a4b1b6;
}

.vue-tags-input :-moz-placeholder {
    color: #a4b1b6;
}

/* default styles for all the tags */
.vue-tags-input .ti-tag {
    position: relative;
    background: #ebde6e;
    color: #283944;
    font-size: 18px;
}

/* we defined a custom css class in the data model, now we are using it to style the tag */
.vue-tags-input .ti-tag.custom-class {
    background: transparent;
    border: 1px solid #ebde6e;
    color: #ebde6e;
    margin-right: 4px;
    border-radius: 0px;
    font-size: 13px;
}

/* the styles if a tag is invalid */
.vue-tags-input .ti-tag.ti-invalid {
    background-color: #e88a74;
}

/* if the user input is invalid, the input color should be red */
.vue-tags-input .ti-new-tag-input.ti-invalid {
    color: #e88a74;
}

/* if a tag or the user input is a duplicate, it should be crossed out */
.vue-tags-input .ti-duplicate span,
.vue-tags-input .ti-new-tag-input.ti-duplicate {
    text-decoration: line-through;
}

/* if the user presses backspace, the complete tag should be crossed out, to mark it for deletion */
.vue-tags-input .ti-tag:after {
    transition: transform .2s;
    position: absolute;
    content: '';
    height: 2px;
    width: 108%;
    left: -4%;
    top: calc(50% - 1px);
    background-color: #000;
    transform: scaleX(0);
}

.ti-tag:before {
    content: '';
}

.vue-tags-input .ti-deletion-mark:after {
    transform: scaleX(1);
}

.my-2 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}

.mx-datepicker {
    width: 100%;
}
</style>
