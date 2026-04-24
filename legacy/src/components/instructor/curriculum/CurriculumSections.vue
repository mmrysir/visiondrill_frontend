<template>
  <div>
    <notifications group="alert" position="bottom center" type="success" />
    <draggable
      v-model="draggableSections"
      handle=".handle"
      animation="200"
      @change="changeSectionsOrder"
    >
      <transition-group>
        <div class="row" v-for="section in draggableSections" :key="section.id">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="panel panel-default">
              <curriculum-section
                :section="section"
                v-on:deleteSection="deleteSection"
              />
            </div>
          </div>
        </div>
      </transition-group>
    </draggable>
    <div style="border: 1px dashed gray" class="py-5 text-center h4">
      <a href="#" @click.prevent="showAddNewSectionForm">+ Add New Section</a>
    </div>

    <div
      class="modal fade-in"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="exampleModalLabel">Add section for your course.</h4>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="storeNewSection">
              <div class="form-group">
                <label for="recipient-name" class="form-label"
                  >Section Name:</label
                >
                <input v-model="sectionTitle" type="text" class="form-control" id="recipient-name" placeholder="e.g. Introduction" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="submit" @click.prevent="storeNewSection" class="btn btn-info">Add Section</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import CurriculumSection from "./CurriculumSection.vue";

export default {
  components: { draggable, CurriculumSection },
  props: ["sections", "course_id"],
  data() {
    return {
      draggableSections: this.sections,
      courseId: this.course_id,
      sectionTitle: '',
    };
  },

  methods: {
    changeSectionsOrder() {
      this.draggableSections.map((section, index) => {
        section.sortOrder = index + 1;
      });

      axios
        .put(`/api/instructor/course/1/update-sections-order`, {
          sections: this.draggableSections,
        })
        .then(() => {
          this.$notify({
            group: "alert",
            title: "Success",
            text: "Order position changed successfully!",
          });
        });
    },

    showAddNewSectionForm() {
      $(".modal").modal("show");
    },

    storeNewSection() {
        axios.post(`/instructor/courses/${this.course_id}/sections/create`, {
            title: this.sectionTitle
        })
        .then(({data}) => {
            this.draggableSections.push({id: data.id, course_id: data.course_id, title: data.title})
            $(".modal").modal("hide");
            this.sectionTitle = '';
            this.$notify({
                group: 'alert',
                title: 'Success',
                text: 'New section added successfully!'
            });
        });
    },

    deleteSection(id) {
      let index = this.draggableSections
        .map((section) => section.id)
        .indexOf(id);
      this.draggableSections.splice(index, 1);
    },
  },
};
</script>
