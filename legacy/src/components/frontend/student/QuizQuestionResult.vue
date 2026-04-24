<template>
    <div>
        <h4>Q{{ index + 1 }} {{ question.question }}</h4>
        <div v-for="answer in question.answers" :key="answer.id">
            <div v-if="question.question_type.name === 'multiple_choice'" class="radio">
                <label :for="'answer-' + answer.id">
                    <input type="radio" :id="'answer-' + answer.id" :name="question.id" @change="answerChanged(question, answer)">
                    {{ answer.answer }}
                    <span v-if="answer.correct === 1 && answer.is_right === true">correct</span>
                    <span v-if="answer.correct === 0 && answer.is_right === false">incorrect</span>
                </label>
            </div>
            <div v-if="question.question_type.name === 'multi_answer'" class="checkbox">
                <label :for="'answer-' + answer.id">
                    <input type="checkbox" :id="'answer-' + answer.id" :name="question.id" @input="toggleCheckboxAnswer(question, answer)">
                    {{ answer.answer }}
                    <span>
                        <span v-if="answer.correct === 1 && answer.is_right === true">correct</span>
                        <span v-if="answer.correct === 0 && answer.is_right === false">incorrect</span>
                    </span>
                </label>
            </div>
            <div v-if="question.question_type.name === 'fill_in_the_blank'" class="checkbox">
                <label :for="'answer-' + answer.id">
                    <input type="text" :id="'answer-' + answer.id" :name="question.id" v-model="answer.answer">
                </label>
            </div>
            <div v-if="question.question_type.name === 'essay'" class="checkbox">
                <label :for="'answer-' + answer.id">
                    <textarea class="form-control"></textarea>
                </label>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['question', 'index'],
    data() {
        return {
            choosenAnswer: '',
        }
    },

    methods: {
        choose(answer) {
            this.choosenAnswer = answer;
            this.$emit('answer-choosen', this.question.id, this.choosenAnswer);
        },

        toggleCheckboxAnswer(question, answer) {
            answer.is_right = !answer.is_right;
        },

        answerChanged(question, answer) {
            question.answers.forEach(ans => ans.is_right = false);
            answer.is_right = true;
        },
    }
}

</script>
