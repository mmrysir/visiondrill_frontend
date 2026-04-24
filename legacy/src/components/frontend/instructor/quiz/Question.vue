<template>
  <div class="content-wrap">
    <notifications group="foo" />
    <quiz-info
      :questions="questions"
      :lesson-id="lesson.id"
      v-on:add-question="addQuestion"
    ></quiz-info>
    <div
      class="row mt-5"
      v-for="(question, index) in questions"
      :key="question.id"
    >
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div class="panel panel-default">
          <div class="panel-heading d-flex justify-content-between">
            <span>Question Type</span>

            <select class="p-2 px-4" v-model="question.type">
              <!-- <option value="multiple_choice">Multiple Choice</option> -->
              <option value="multi_answer">Multiple Choice</option>
              <option value="essay">Essay</option>
              <option value="fill_in_the_blank">Fill in the Blank</option>
            </select>
          </div>
          <div class="panel-wrapper collapse in">
            <div class="panel-body">
              <form>
                <div class="form-group">
                  <dismissable-alert
                    v-if="question.type === 'fill_in_the_blank'"
                    type="alert-info"
                    alert-text=" Earth has a population of [Blank], and there are [Blank] continents on Earth"
                  >
                  </dismissable-alert>
                    <div class="mb-4">
                        <label for="exampleInputEmail1">Question</label>
                        <textarea
                            type="text"
                            class="form-control"
                            id="exampleInputEmail1"
                            placeholder="Enter Question"
                            v-model="question.question"
                            rows="3"
                        ></textarea>
                    </div>
                    <div class="mb-4" v-if="question.type == 'essay'">
                        <label for="quizfile">Upload Quiz</label>
                        <input
                            type="file"
                            class="form-control"
                            id="quizfile"
                            @change="selectQuizFile"
                        >
                        <button
                            class="btn btn-secondary btn-sm mt-2"
                            @click.prevent="uploadQuizFile(question)"
                            :disabled="uploading"
                        >
                            <span v-if="!uploading">Upload</span>
                            <span v-if="uploading">Uploading...</span>
                        </button>
                    </div>
                </div>
                <div v-if="isMultipleChoice(question)">
                  <div v-for="(answer, i) in question.answers" class="d-flex">
                    <label v-if="question.type == 'multi_answer'">
                      <input
                        class="border"
                        title="Mark as correct answer"
                        type="checkbox"
                        :value="answer.answer"
                        @input="toggleCheckboxAnswer(question, answer)"
                        :checked="answer.is_right"
                      />&nbsp;
                    </label>
                    <label v-if="question.type == 'multiple_choice'">
                      <input
                        title="Mark as correct answer"
                        type="radio"
                        name="option_one"
                        :checked="answer.is_right"
                        @change="answerChanged(question, answer)"
                      />&nbsp;
                    </label>
                    <div
                      contenteditable="true"
                      style="width: 655px; position: relative"
                      tabindex="0"
                      spellcheck="true"
                      role="textbox"
                      aria-label="false"
                      @blur="answerTextChanged($event, answer)"
                    >
                      {{ answer.answer }}
                    </div>
                    <a
                      href="#"
                      @click.prevent="deleteAnswer(question, i, answer)"
                      style="
                        float: right;
                        display: block;
                        text-decoration: none;
                      "
                      ><i class="fa fa-trash"></i
                    ></a>
                  </div>
                  <div
                    v-if="question.type !== 'essay'"
                    class="mt-2 d-flex"
                    @click.prevent="addNewOption(index, question.type)">
                    <!-- <label><input type="checkbox" disabled />&nbsp;</label> -->
                    <button class="btn btn-primary btn-rounded">
                        <i class="icon icon-plus"></i>
                        Add New Answer
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="panel-footer">
            <button
              @click="saveChanges(question)"
              class="btn btn-success btn-rounded"
            >
              <i class="icon icon-paper-plane"></i> Save Changes
            </button>
            <button
              v-if="isLastQuestion(index)"
              :disabled="!canAddQuestion(index)"
              @click="addQuestion"
              class="btn btn-info btn-rounded"
            >
              <i class="icon icon-plus"></i> Add New Question
            </button>
            <button
              @click.prevent="deleteQuestion(question, index)"
              class="btn btn-default btn-rounded"
            >
              <i class="icon icon-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QuizInfo from "./QuizInfo.vue";
export default {
  props: ["lesson"],
  components: {
    QuizInfo,
  },
  data() {
    return {
      questions: [],
      changedText: "",
        quizfile: null,
      uploading: false,
    };
  },

  methods: {
    loadQuestions() {
      axios
        .get("/api/instructor/quiz/" + this.lesson.id + "/questions", {
          lesson_id: this.lesson.id,
        })
        .then(({ data }) => (this.questions = data.data));
    },

    addQuestion() {
      this.questions.push({
        question: "",
        type: "multiple_choice",
        answers: [
          {
            answer: "New Answer",
            is_right: false,
          },
        ],
      });

      axios
        .post("/api/instructor/quiz/" + this.lesson.id + "/add-new-question")
        .then(() => {
          this.loadQuestions();
        });
    },

    deleteQuestion(question, index) {
      console.log(question);
      this.questions.splice(index, 1);
      axios.delete("/api/instructor/quiz/question/" + question.id).then(() => {
        Vue.notify({
          group: "foo",
          title: "Success!",
          text: "Question deleted successfully.",
        });
      });
    },

    changeQuestionType(question) {
      question = this.questions.find((question) => question.id == question);
      question.type = "checkbox";
    },

    isMultipleChoice(question) {
      if (
        question.type == "multiple_choice" ||
        question.type == "multi_answer" ||
        question.type === "fill_in_the_blank" ||
        question.type === "essay"
      ) {
        return true;
      }

      return false;
    },

    canAddQuestion(index) {
      const questionsCount = this.questions.length;
      // check if it is last question and it is saved with answers
      if (questionsCount === index + 1) {
        const question = this.questions[index];

        if (question.type === 'essay') {
            return true;
        }

        if (question.answers.length > 0) {
          return question.answers[0].hasOwnProperty("id");
        }
      }

      return false;
    },

    isLastQuestion(index) {
      return this.questions.length === index + 1;
    },

    answerChanged(question, answer) {
      question.answers.forEach((ans) => (ans.is_right = false));
      answer.is_right = true;
    },

    answerTextChanged($event, ans) {
      ans.answer = $event.target.innerText;
    },

    toggleCheckboxAnswer(question, answer) {
      answer.is_right = !answer.is_right;
    },

    saveChanges(question) {
      const correctAnswers = question.answers.filter(
        (answer) => answer.is_right === true
      );

      if (question.type !== 'essay' && question.type !== 'fill_in_the_blank' && correctAnswers.length <= 0) {
        return alert("Please mark one answer as correct");
      }

      axios
        .post("/api/instructor/quiz/" + this.lesson.id + "/save-question", {
          lesson_id: this.lesson.id,
          question: question,
        })
        .then((response) => {
          Vue.notify({
            group: "foo",
            title: "Success!",
            text: "Quiz saved successfully.",
          });
          question.answers = response.data.answers;
        });
    },

    addNewOption(index, questionType) {
      this.questions[index].answers.push({
        answer: "Answer: Edit this Answer Text",
        is_right: false,
      });
    },

    chooseIsRightOption(questionType) {
      if (questionType !== "fill_in_the_blank" || questionType != "essay") {
        return false;
      }
      return true;
    },

    deleteAnswer(question, index, answer) {
      question.answers.splice(index, 1);
      if (answer.id) {
        axios.delete("/api/instructor/quiz/answer/" + answer.id).then(() => {
          console.log("answer deleted");
        });
      }
    },

      selectQuizFile(event) {
          this.quizfile = event.target.files[0];
      },

      uploadQuizFile(question) {
          this.uploading = true;
          const data = new FormData();
          data.append("quizfile", this.quizfile);
          axios
              .post("/api/quiz-question/" + question.id + "/upload-quiz-file", data)
              .then(() => {
                  Vue.notify({
                      group: "foo",
                      title: "Success!",
                      text: "Quiz file uploaded successfully.",
                  });
              }).finally(() => {
              this.uploading = false;
          });
      },
  },

    created() {
    this.loadQuestions();
  },
};
</script>
