<template>
  <div class="panel-wrapper collapse in">
    <table class="table table-hover">
      <draggable tag="tbody" v-model="draggableLessons" draggable=".item" handle=".handle" animation="200" @change="changeLessonsOrder">
          <curriculum-lesson
            v-for="lesson in draggableLessons"
            :key="lesson.id"
            :lesson="lesson"
            v-on:deleteLesson="deleteLesson"
          />
      </draggable>
    </table>
  </div>
</template>

<script>
import CurriculumLesson from "./CurriculumLesson.vue";
import draggable from "vuedraggable";
export default {
  components: { draggable, CurriculumLesson },
  props: ["lessons", "course_id"],
  data() {
    return {
      draggableLessons: this.lessons,
    }
  },

  methods: {
      changeLessonsOrder() {
          this.draggableLessons.map((lesson, index) => {
              lesson.sortOrder = index + 1;
          })

          axios.put(`/api/instructor/course/${this.course_id}/update-lessons-order`, {
              lessons: this.draggableLessons
          })
          .then(() => {
              this.$notify({
                    group: 'alert',
                    title: 'Success',
                    text: 'Order position changed successfully!'
                });
          })
      },

      deleteLesson(id) {
          let index = this.draggableLessons.map(lesson => lesson.id).indexOf(id)
          this.draggableLessons.splice(index, 1);
      }
  }
};
</script>
