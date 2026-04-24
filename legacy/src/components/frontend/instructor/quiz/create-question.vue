<script>
    export default {
        data() {
            return {
                question: null,
                answer: {
                    text:null,
                    correct: false
                },
                answers: [{text:'', correct:true}],
                addAnswer: false,
                addQuestion: false,
                addQuiz: false,
                questions: {}
            }
        },
        computed: {
            countCorrect: function() {
                return this.answers.filter(function(obj){
                    return obj.correct === true
                }).length
            }
        },
        props: [
            'lesson'
        ],
        methods: {
            saveAnswer() {
                this.answers.push({
                    text: this.answer.text,
                    correct: this.answer.correct
                });
                this.answer.text = null;
                this.answer.correct = false;
                this.addAnswer = false;
            },

            removeAnswer(index){
                this.answers.splice(index, 1);
            },
            saveQuestion(){
                axios.post('/api/instructor/quiz/'+this.lesson.id+'/question', {
                    lesson_id: this.lesson.id,
                    question: this.question,
                    answers: this.answers
                }).then(function (response){
                    this.question = null;
                    this.answers = [];
                    this.answer.text = null;
                    this.answer.correct = false;
                    this.answer.explanation = null;
                    this.addAnswer = false;
                    this.addQuestion = false;
                    this.loadQuestions();
                    this.addQuiz = true;
                    this.addInput();
                }.bind(this)).catch(function (error){
                    console.log(error);
                })
            },
            cancelEdit(){
                this.addQuestion = false
                this.answers = [],
                this.addAnswer = false
            },
            addInput() {
                this.answers.push({
                    text:'',
                    correct: false
                });
            },
            loadQuestions() {
                axios.get('/api/instructor/quiz/'+this.lesson.id+'/question', {
                    lesson_id: this.lesson.id
                })
                .then(({data}) => (this.questions = data));
            },
            deleteQuestion(id) {
                axios.delete('/api/instructor/quiz/question/'+id)
                .then(() => {
                    this.loadQuestions();
                })
            }
        },
        created() {
            this.loadQuestions();
        }
    }
</script>

        