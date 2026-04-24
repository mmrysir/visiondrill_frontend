<template>
  <tr class="item">
    <td style="width: 10px;">
      <i class="sticon ti-move text-secondary m-l-0 pl-2 handle" style="cursor: move"></i>
    </td>
    <td>
      {{ lesson.title }}
      <a
        :href="`/instructor/courses/${lesson.course_id}/curriculum/lectures/${lesson.id}/video`"
        ><i class="sticon ti-pencil"></i
      ></a>
    </td>
    <td class="text-center">
      <a
        v-if="!lesson.preview"
        href="/"
        @click.prevent="toggleFreePreview"
        class="m-r-20"
      >
        <i class="sticon ti-eye text-muted" title="Allow Free Preview"></i>
      </a>
      <a
        v-if="lesson.preview"
        href="#"
        @click.prevent="toggleFreePreview"
        class="m-r-20"
        title="Deny Free Preview"
      >
        <i class="sticon ti-eye text-success"></i>
      </a>
      <a href="#" @click.prevent="deleteLesson(lesson.id)" class="m-r-20">
        <i class="sticon ti-trash text-danger"></i>
      </a>
    </td>
  </tr>
</template>

<script>
export default {
  props: ["lesson"],

  methods: {
    toggleFreePreview() {
      this.lesson.preview = !this.lesson.preview;
      axios
        .put(`/api/instructor/lesson/${this.lesson.id}/toggle-free-preview`)
        .then(() => {
          this.$notify({
            group: "alert",
            title: "Success",
            text: "Lesson preview status changed successfully!",
          });
        });
    },

    deleteLesson(id) {
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
            axios.delete(`/api/instructor/lesson/${id}/delete`)
            .then(() => {
                this.$emit('deleteLesson', id);
                Swal.fire("Deleted!", "Lesson has been deleted.", "success");
            })
        }
      });
    },
  },
};
</script>
