<template>
    <div v-if="question">
        <h3 class="text-xl font-bold">Question {{ questionNumber }}:</h3>
        <br />
        <h3 v-if="question.type !== 'fill_in_the_blank'">
            {{ question.text }}
        </h3>

        <div v-if="question.type === 'fill_in_the_blank'">
            <h3 class="my-2">Fill in the blanks:</h3>
            <span v-html="this.replacedText()"></span>
        </div>

        <div v-if="question.type === 'tf'">
            <input
                type="radio"
                name="currentQuestion"
                id="trueAnswer"
                v-model="answer"
                value="t"
            /><label for="trueAnswer">True</label><br />
            <input
                type="radio"
                name="currentQuestion"
                id="falseAnswer"
                v-model="answer"
                value="f"
            /><label for="falseAnswer">False</label><br />
        </div>

        <div v-if="question.type === 'multiple_choice'">
            <div
                v-for="(mcanswer, index) in question.answers"
                :key="index"
                class="flex items-center mt-4"
            >
                <input
                    type="radio"
                    :id="'answer' + index"
                    class="mr-2 w-5 h-5 cursor-pointer md:w-5 md:h-5 lg:w-5 lg:h-5"
                    name="currentQuestion"
                    v-model="answer"
                    :value="mcanswer"
                /><label :for="'answer' + index">{{ mcanswer }}</label
                ><br />
            </div>
        </div>

        <div v-if="question.type === 'multi_answer'">
            <div
                v-for="(cbanswer, index) in question.answers"
                :key="index"
                class="flex items-center mt-4"
            >
                <input
                    type="checkbox"
                    :id="'answer' + index"
                    name="currentQuestion"
                    v-model="answer"
                    :value="cbanswer"
                    class="mr-2 w-5 h-5 cursor-pointer md:w-5 md:h-5 lg:w-5 lg:h-5"
                />
                <label :for="'answer' + index">{{ cbanswer }}</label
                ><br />
            </div>
        </div>

        <div v-if="question.type === 'essay'">
            <div class="mt-4 text-center">
                <a
                    :href="question.file_path"
                    download
                    class="px-4 py-1 text-white bg-teal-600 rounded border-2 focus:outline-none"
                    >Download Essay File</a
                >
            </div>
            <!--            <label for="uploadEssayAnswer">Upload Answer</label><br>-->
            <!--            <input id="uploadEssayAnswer" type="file" name="currentQuestion" class="px-3 w-full text-sm placeholder-gray-800 border-b blankInput focus:outline-none">-->

            <div class="mb-4">
                <label for="quizfile">Upload Answer</label>
                <input
                    type="file"
                    class="form-control"
                    id="quizfile"
                    @change="selectQuizFile"
                />
<!--                <button-->
<!--                    class="px-4 py-1 text-white bg-teal-600 rounded border-2 focus:outline-none"-->
<!--                    @click.prevent="uploadQuizFile(question)"-->
<!--                    :disabled="uploading"-->
<!--                >-->
<!--                    <span v-if="!uploading">Upload</span>-->
<!--                    <span v-if="uploading">Uploading...</span>-->
<!--                </button>-->
            </div>
        </div>

        <div class="mt-4">
            <button
                v-if="question.type == 'essay'"
                @click.prevent="uploadQuizFile(question)"
                :disabled="uploading"
                class="px-4 py-1 text-white rounded border-2 bg-primary focus:outline-none"
            >
                <span v-if="!uploading">Answer</span>
                <span v-if="uploading">Uploading...</span>
            </button>
            <button
                v-else
                @click="submitAnswer"
                class="px-4 py-1 text-white rounded border-2 bg-primary focus:outline-none"
            >
                Answer
            </button>
        </div>
    </div>
</template>
<script>
export default {
    props: ["question", "question-number", "quizId"],
    data() {
        return {
            answer: null,
            quizfile: null,
            uploading: false,
        };
    },
    created() {
        // Initialize answer based on question type when component is created
        this.initializeAnswer();
    },
    watch: {
        'question': {
            handler: function(newQuestion) {
                // Reset answer when question changes
                if (newQuestion) {
                    this.initializeAnswer();
                }
            },
            immediate: true
        }
    },
    methods: {
        initializeAnswer() {
            if (this.question) {
                if (this.question.type === "multi_answer" || this.question.type === "fill_in_the_blank") {
                    this.answer = [];
                } else {
                    this.answer = null;
                }
            }
        },
        submitAnswer: function() {
            if (!this.question) {
                console.error("Question is undefined");
                return;
            }
            
            let answerToEmit = null;
            
            if (this.question.type === "fill_in_the_blank") {
                // Use $el to find inputs within this component's DOM
                let inputs = this.$el ? this.$el.getElementsByClassName("blankInput") : [];
                inputs = Array.prototype.slice.call(inputs);
                
                // If not found in $el, try document (fallback)
                if (inputs.length === 0) {
                    inputs = document.getElementsByClassName("blankInput");
                    inputs = Array.prototype.slice.call(inputs);
                }
                
                let answerArray = [];
                if (inputs.length > 0) {
                    inputs.forEach(input => {
                        // Collect all values, including empty strings to maintain array structure
                        const value = input.value || "";
                        answerArray.push(value.trim());
                    });
                    answerToEmit = answerArray;
                    console.log("Fill-in-the-blank answers collected:", answerArray);
                } else {
                    // If no inputs found, send empty array
                    console.warn("No blankInput inputs found for fill-in-the-blank question. Question ID:", this.question.id);
                    answerToEmit = [];
                }
            } else if (this.question.type === "multi_answer") {
                // For multi_answer, answer is already an array from v-model
                answerToEmit = Array.isArray(this.answer) ? this.answer : [];
            } else if (this.question.type === "multiple_choice" || this.question.type === "tf") {
                // For multiple_choice and tf, answer should be a string
                // Convert to string
                answerToEmit = this.answer !== null && this.answer !== undefined ? String(this.answer) : "";
            } else {
                answerToEmit = this.answer;
            }
            
            // Emit the answer
            this.$emit("answer", { answer: answerToEmit });
            
            // Reset answer based on question type for next question
            if (this.question.type === "multi_answer" || this.question.type === "fill_in_the_blank") {
                this.answer = [];
            } else {
                this.answer = null;
            }
        },

        replacedText() {
            if (!this.question || !this.question.text) {
                return '';
            }
            let inputField =
                '<input type="text" name="currentQuestion" class="px-3 w-3/12 text-sm placeholder-gray-800 border-b blankInput focus:outline-none">';
            let originalText = this.question.text;
            let modifiedText = originalText.replace(/\[Blank\]/g, inputField);
            return modifiedText;
        },

        selectQuizFile(event) {
            this.quizfile = event.target.files[0];
        },

        uploadQuizFile() {
            this.uploading = true;
            const data = new FormData();
            data.append("quizfile", this.quizfile);
            data.append("quizId", this.quizId);
            axios
                .post(
                    "/api/quiz-question/" +
                        this.question.id +
                        "/upload-quiz-essay-answer",
                    data
                )
                .then(() => {
                    Vue.notify({
                        group: "foo",
                        title: "Success!",
                        text: "Quiz answer uploaded successfully."
                    });
                    this.$emit("answer", { answer: this.answer });
                    this.answer = [];
                })
                .finally(() => {
                    this.uploading = false;
                });
        }
    }
};
</script>
