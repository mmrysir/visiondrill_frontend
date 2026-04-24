<template>
  <div>
    <div class="panel-heading">
      <i class="sticon ti-move handle" style="cursor: move"></i
      >&nbsp;
      <span v-if="!editing">
        {{ section.title }}
        <i class="sticon ti-pencil" @click="editSectionTitle(section.title)"></i
        >&nbsp;
      </span>
      <span v-if="editing">
        <input type="text" v-model="editingText" name="title" />
        <button
          @click.prevent="saveSectionTitle"
          type="button"
          class="btn btn-info btn-circle"
        >
          <i class="fa fa-check"></i>
        </button>
        <button
          @click="editing = false"
          type="button"
          class="btn btn-warning btn-circle"
        >
          <i class="fa fa-times"></i>
        </button>
      </span>
      <button type="button" @click="deleteSection(section.id)" class="border-0 pull-right bg-white p-0" data-toggle="tooltip" data-placement="top" title="Delete Section">
        <i class="sticon icon-trash text-danger"></i>
      </button>
    </div>
    <curriculum-lessons
      :lessons="section.lessons"
      :course_id="section.course_id"
    />
    <div style="border: 1px dashed gray;" class="text-center py-3">
        <a :href="`/instructor/courses/${section.course_id}/curriculum/${section.id}/lectures`">+ Add New Lecture</a>
    </div>
  </div>
</template>

<script>
import CurriculumLessons from "./CurriculumLessons.vue";
export default {
  components: { CurriculumLessons },
  props: ["section"],
  data() {
    return {
      editing: false,
      editingText: "",
    };
  },
  methods: {
    editSectionTitle(title) {
      this.editing = true;
      this.editingText = title;
    },

    saveSectionTitle() {
      axios
        .post(
          `/api/instructor/course/${this.section.course_id}/sections/${this.section.id}/edit`,
          {
            course_id: this.section.course_id,
            title: this.editingText,
          }
        )
        .then(() => {
          this.editing = false;
          this.section.title = this.editingText;
          this.$notify({
            group: "alert",
            title: "Success",
            text: "Section name changed successfully!",
          });
        });
    },

    deleteSection(id) {
        Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
            axios.delete(`/instructor/course-sections/${id}`)
            .then(() => {
                this.$emit('deleteSection', id);
                Swal.fire("Deleted!", "Section has been deleted.", "success");
            })
        }
      });
    }
  },
};
</script>
