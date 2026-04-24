<template>
    <div class="align-center">
        <div v-if="duration != 0">
            <h4 class="text-right">Remaining Time: {{ duration }} min</h4>
        </div>
        <div v-if="introStage">
            <h1 class="text-3xl font-bold text-center">
                Welcome to the Quiz: {{ heading }}
            </h1>
            <p class="mt-2 font-thin text-gray-800 text-center">
                {{ description }}
            </p>
            <div class="mt-4 text-center" v-if="!quizAttempt">
                <div v-if="isGroupWork && !isGroupLeader" class="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
                    <p class="text-yellow-800">
                        <strong>Group Work:</strong> Only the group leader can submit this quiz. 
                        <span v-if="groupData">Your group: {{ groupData.group_name }}</span>
                    </p>
                    <p class="text-yellow-800 mt-2">
                        Waiting for your group leader to submit the quiz. Once submitted, you will be able to view the questions and answers here.
                    </p>
                </div>
                <button
                    v-if="!isGroupWork || isGroupLeader"
                    @click="startQuiz"
                    class="py-1 px-4 bg-primary text-white border-2 rounded focus:outline-none"
                >
                    ATTEMPT QUIZ!
                </button>
            </div>
            <!-- Show read-only view for non-leaders in group work -->
            <div v-if="quizAttempt && isGroupWork && !isGroupLeader" class="mt-4">
                <div class="mb-4 p-4 bg-blue-100 border border-blue-400 rounded">
                    <p class="text-blue-800">
                        <strong>Group Work - Read Only View:</strong> Your group leader has submitted this quiz. 
                        <span v-if="groupData">Group: {{ groupData.group_name }}</span>
                    </p>
                    <p class="text-blue-800 mt-2">
                        Below are the questions and the answers submitted by your group leader.
                    </p>
                </div>
                <h3 class="text-xl mb-4 font-bold">
                    Quiz Questions and Answers:
                </h3>
                <div
                    v-for="(question, index) in questions"
                    :key="question.id"
                    class="mb-6 p-4 border border-gray-300 rounded"
                >
                    <h3 class="text-lg font-semibold mb-2">Q. {{ index + 1 }} {{ question.text }}</h3>
                    <div class="mt-2">
                        <span class="font-semibold">Answer:</span>
                        <template v-if="question.type === 'essay'">
                            <template
                                v-if="
                                    questionAttempt.find(function(attempt) {
                                        return (
                                            attempt.quiz_question_id == question.id
                                        );
                                    })
                                "
                            >
                                <a
                                    :href="
                                        questionAttempt.find(function(attempt) {
                                            return (
                                                attempt.quiz_question_id ==
                                                question.id
                                            );
                                        }).answer_url
                                    "
                                    target="_blank"
                                    class="text-blue-600 underline ml-2"
                                >
                                    Download answer
                                </a>
                                <div
                                    class="mt-2 p-2 bg-gray-50 rounded"
                                    v-if="
                                        questionAttempt.find(function(attempt) {
                                            return (
                                                attempt.quiz_question_id ==
                                                question.id
                                            );
                                        }).instructor_feedback
                                    "
                                >
                                    <strong>Instructor Feedback:</strong>
                                    <p class="mt-1">
                                        {{
                                            questionAttempt.find(function(attempt) {
                                                return (
                                                    attempt.quiz_question_id ==
                                                    question.id
                                                );
                                            }).instructor_feedback
                                        }}
                                    </p>
                                </div>
                            </template>
                            <span v-else class="ml-2 text-gray-500">No answer submitted.</span>
                        </template>
                        <template v-else>
                            <span
                                v-if="
                                    questionAttempt.find(function(attempt) {
                                        return (
                                            attempt.quiz_question_id == question.id
                                        );
                                    })
                                "
                                class="ml-2"
                            >
                                {{ formatAnswer(question) }}
                            </span>
                            <span v-else class="ml-2 text-gray-500">No answer provided</span>
                            <span
                                v-if="isCorrectAnswer(question.id)"
                                class="text-green-600 font-bold ml-2"
                                >✓ Correct</span
                            >
                            <span
                                v-else-if="
                                    questionAttempt.find(function(attempt) {
                                        return (
                                            attempt.quiz_question_id == question.id
                                        );
                                    })
                                "
                                class="text-red-600 font-bold ml-2"
                                >✗ Incorrect</span
                            >
                        </template>
                    </div>
                </div>
            </div>
            <!-- Show normal view for leaders or individual quizzes -->
            <div v-if="quizAttempt && (!isGroupWork || isGroupLeader)">
                <div class="mb-4 text-center">
                    <button
                        @click="reattemptQuiz"
                        class="py-1 px-4 bg-red-600 text-white border-2 rounded focus:outline-none hover:bg-red-700"
                    >
                        {{ isGroupWork ? 'REATTEMPT QUIZ (Clears for all group members)' : 'REATTEMPT QUIZ' }}
                    </button>
                </div>
                <h3 class="text-xl mb-2">
                    You have already taken this quiz. Here is the response
                    preview:
                </h3>
                <div
                    v-for="(question, index) in questions"
                    :key="question.id"
                    class="mb-2"
                >
                    <h3>Q. {{ index + 1 }} {{ question.text }}</h3>
                    <span>Answer:</span>
                    <template v-if="question.type === 'essay'">
                        <template
                            v-if="
                                questionAttempt.find(function(attempt) {
                                    return (
                                        attempt.quiz_question_id == question.id
                                    );
                                })
                            "
                        >
                            <a
                                :href="
                                    questionAttempt.find(function(attempt) {
                                        return (
                                            attempt.quiz_question_id ==
                                            question.id
                                        );
                                    }).answer_url
                                "
                                target="_blank"
                                class="text-blue-600 underline"
                            >
                                Download your answer
                            </a>
                            <div
                                class="mt-1"
                                v-if="
                                    questionAttempt.find(function(attempt) {
                                        return (
                                            attempt.quiz_question_id ==
                                            question.id
                                        );
                                    }).instructor_feedback
                                "
                            >
                                Instructor Feedback:
                                {{
                                    questionAttempt.find(function(attempt) {
                                        return (
                                            attempt.quiz_question_id ==
                                            question.id
                                        );
                                    }).instructor_feedback
                                }}
                            </div>
                        </template>
                        <span v-else>No answer submitted.</span>
                    </template>
                    <template v-else>
                        <span
                            v-if="
                                questionAttempt.find(function(attempt) {
                                    return (
                                        attempt.quiz_question_id == question.id
                                    );
                                })
                            "
                        >
                            {{ formatAnswer(question) }}
                        </span>
                        <span v-else>No answer provided</span>
                        <span
                            v-if="isCorrectAnswer(question.id)"
                            class="text-green-600 font-weight-bold ml-2"
                            >✓ Correct</span
                        >
                        <span
                            v-else-if="
                                questionAttempt.find(function(attempt) {
                                    return (
                                        attempt.quiz_question_id == question.id
                                    );
                                })
                            "
                            class="text-red-600 font-weight-bold ml-2"
                            >✗ Incorrect</span
                        >
                    </template>
                </div>
            </div>
        </div>
        <div v-if="questionStage">
            <quiz-question
                :quizId="quizId"
                :question="questions[currentQuestion]"
                v-on:answer="handleAnswer"
                :question-number="currentQuestion + 1"
            ></quiz-question>
        </div>
        <div v-if="resultsStage">
            <h3 class="text-xl">
                You got {{ correct }} right out of
                {{ questions.length }} questions. Your percentage is
                {{ perc }}%.
            </h3>
        </div>
    </div>
</template>
<script>
import QuizQuestion from "./QuizQuestion.vue";
export default {
    props: ["lesson", "authId"],
    components: {
        QuizQuestion
    },
    data() {
        return {
            introStage: true,
            questionStage: false,
            resultsStage: false,
            title: "",
            questions: [],
            currentQuestion: 0,
            answers: [],
            correct: 0,
            perc: null,

            quizId: "",
            heading: "",
            description: "",
            duration: "",
            quizAttempt: false,
            questionAttempt: "",
            isGroupWork: false,
            isGroupLeader: false,
            groupData: null
        };
    },
    created() {
        axios
            .get("/api/lesson/" + this.lesson + "/quiz-questions")
            .then(({ data }) => {
                this.title = data.data.title;
                this.questions = data.data.questions;
                this.introStage = true;
            });

        this.getQuizInfo();
    },
    methods: {
        async startQuiz() {
            try {
                // Check if group work and user is not leader
                if (this.isGroupWork && !this.isGroupLeader) {
                    alert("Only the group leader can start this quiz.");
                    return;
                }
                
                await axios.post("/student/attempt-quiz", {
                    quiz_id: this.quizId
                });
                
                this.introStage = false;
                this.questionStage = true;
                
                // Ensure we have questions before proceeding
                if (!this.questions || this.questions.length === 0) {
                    alert("No questions available for this quiz.");
                    this.introStage = true;
                    this.questionStage = false;
                    return;
                }
                
                if (this.duration > 0) {
                    this.countDownTimer();
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    alert(error.response.data.error);
                } else {
                    alert("Failed to start quiz. Please try again.");
                }
            }
        },
        async handleAnswer(e) {
            let question = this.questions[this.currentQuestion];
            try {
                // Check if group work and user is not leader
                if (this.isGroupWork && !this.isGroupLeader) {
                    alert("Only the group leader can submit answers.");
                    return;
                }

                // For essay questions, the actual answer is the uploaded file.
                // The upload endpoint (/api/quiz-question/{id}/upload-quiz-essay-answer)
                // already creates/updates the QuestionAttempt with the file path.
                // Calling /student/question-attempt again would overwrite that file path
                // with an empty/null answer, so we intentionally skip the API call here.
                if (question.type !== "essay") {
                    await axios.post("/student/question-attempt", {
                        quiz_id: this.quizId,
                        question_id: question.id,
                        answer: e.answer
                    });
                }

                this.answers[this.currentQuestion] = e.answer;
                if (this.currentQuestion + 1 === this.questions.length) {
                    await this.handleResults();
                    this.questionStage = false;
                } else {
                    this.currentQuestion++;
                }
            } catch (error) {
                console.error("Error saving answer:", error);
                if (error.response && error.response.data && error.response.data.error) {
                    alert(error.response.data.error);
                } else {
                    alert("Failed to save answer. Please try again.");
                }
            }
        },
        async handleResults() {
            try {
                // Small delay to ensure all requests are processed
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Finish the quiz (this will assign results to group members if group work)
                await axios.post("/student/finish-quiz", {
                    quiz_id: this.quizId
                });
                
                alert("completed successfully!");
                window.location.reload();
                this.getQuizInfo();
            } catch (error) {
                console.error("Error finishing quiz:", error);
                alert("Failed to complete quiz. Please try again.");
            }
        },

        countDownTimer() {
            if (this.duration > 0) {
                setTimeout(() => {
                    this.duration -= 1;
                    this.countDownTimer();
                }, 60000);
            }

            if (this.duration == 0) {
                this.handleResults();
                this.questionStage = false;
                this.resultsStage = true;
            }
        },

        getQuizInfo() {
            axios
                .get(`/student/quiz-info/${this.lesson}/show`)
                .then(({ data }) => {
                    (this.heading = data.heading),
                        (this.description = data.description);
                    this.duration = data.duration;
                    this.quizId = data.id;
                    this.quizAttempt = Boolean(data.quiz_attempt);
                    this.questionAttempt = data.question_attempt || [];
                    
                    // Only set group work related data if quiz is group work
                    if (data.is_group_work) {
                        this.isGroupWork = true;
                        this.isGroupLeader = Boolean(data.is_group_leader);
                        this.groupData = data.group_data || null;
                        
                        // For non-leaders: if leader submitted, hide intro to show read-only view
                        if (!this.isGroupLeader && this.quizAttempt) {
                            this.introStage = false;
                        }
                    } else {
                        // Not group work - keep original behavior
                        this.isGroupWork = false;
                        this.isGroupLeader = false;
                        this.groupData = null;
                    }
                });
        },

        formatAnswer(question) {
            let attempt = this.questionAttempt.find(function(attempt) {
                return attempt.quiz_question_id == question.id;
            });

            if (!attempt || !attempt.answer) {
                return "No answer provided";
            }

            // Never display "[Blank]" as an answer - it's a placeholder, not an answer
            const answerStr = String(attempt.answer).trim();
            if (answerStr === "" || answerStr === "[Blank]" || answerStr === "null" || answerStr === "undefined") {
                return "No answer provided";
            }

            // Handle fill_in_the_blank - answer is JSON array
            if (question.type === "fill_in_the_blank") {
                try {
                    let answers = JSON.parse(attempt.answer);
                    if (Array.isArray(answers)) {
                        // Filter out empty strings, null, undefined, and "[Blank]" placeholders
                        const nonEmptyAnswers = answers.filter(a => {
                            const str = String(a || "").trim();
                            return str !== "" && str !== "[Blank]" && str !== "null" && str !== "undefined";
                        });
                        if (nonEmptyAnswers.length > 0) {
                            return nonEmptyAnswers.join(", ");
                        }
                    }
                    // If parsing failed or array is empty, return "No answer provided"
                    return "No answer provided";
                } catch (e) {
                    // If parsing fails, check if it's a valid string (not "[Blank]")
                    if (typeof attempt.answer === 'string' && 
                        attempt.answer.trim() !== '' && 
                        attempt.answer.trim() !== "[Blank]") {
                        return attempt.answer;
                    }
                    return "No answer provided";
                }
            }

            // For other question types, return the answer or "No answer provided"
            // Never return "[Blank]" as it's a placeholder
            if (answerStr === "[Blank]") {
                return "No answer provided";
            }
            
            return answerStr !== "" ? answerStr : "No answer provided";
        },

        isCorrectAnswer(questionId) {
            let attempt = this.questionAttempt.find(function(attempt) {
                return attempt.quiz_question_id == questionId;
            });

            if (!attempt || !attempt.answer || !attempt.right_answer) {
                return false;
            }

            // Find the question to check its type
            let question = this.questions.find(function(q) {
                return q.id == questionId;
            });

            if (!question) {
                return false;
            }

            // Handle fill_in_the_blank - compare arrays
            if (question.type === "fill_in_the_blank") {
                try {
                    let studentAnswers = JSON.parse(attempt.answer);
                    let correctAnswers = JSON.parse(attempt.right_answer);

                    if (
                        !Array.isArray(studentAnswers) ||
                        !Array.isArray(correctAnswers)
                    ) {
                        return false;
                    }

                    // Filter out empty strings before comparing
                    studentAnswers = studentAnswers
                        .filter(a => a && String(a).trim() !== "")
                        .map(a => String(a).toLowerCase().trim())
                        .sort();
                    correctAnswers = correctAnswers
                        .filter(a => a && String(a).trim() !== "")
                        .map(a => String(a).toLowerCase().trim())
                        .sort();

                    // Both arrays must have the same length and same values
                    if (studentAnswers.length !== correctAnswers.length) {
                        return false;
                    }

                    return (
                        JSON.stringify(studentAnswers) ===
                        JSON.stringify(correctAnswers)
                    );
                } catch (e) {
                    // If parsing fails, do simple string comparison
                    return String(attempt.answer).toLowerCase().trim() === 
                           String(attempt.right_answer).toLowerCase().trim();
                }
            }

            // For other question types, do simple comparison
            return (
                String(attempt.answer)
                    .toLowerCase()
                    .trim() ===
                String(attempt.right_answer)
                    .toLowerCase()
                    .trim()
            );
        },

        reattemptQuiz() {
            const confirmMessage = this.isGroupWork
                ? "Are you sure you want to clear this quiz attempt? This will clear attempts for ALL group members and allow you to start over."
                : "Are you sure you want to clear your current attempt and start over?";
            
            if (confirm(confirmMessage)) {
                // Check if group work and user is not leader
                if (this.isGroupWork && !this.isGroupLeader) {
                    alert("Only the group leader can reattempt this quiz.");
                    return;
                }
                
                axios
                    .post("/student/clear-quiz-attempt", {
                        quiz_id: this.quizId
                    })
                    .then(() => {
                        // Reset component state
                        this.quizAttempt = false;
                        this.questionAttempt = [];
                        this.introStage = true;
                        this.questionStage = false;
                        this.resultsStage = false;
                        this.currentQuestion = 0;
                        this.answers = [];
                        // Refresh quiz info to ensure state is synced
                        this.getQuizInfo();
                    })
                    .catch(error => {
                        console.error("Error clearing quiz attempt:", error);
                        const errorMessage = error.response && error.response.data && error.response.data.error
                            ? error.response.data.error
                            : "Failed to clear quiz attempt. Please try again.";
                        alert(errorMessage);
                    });
            }
        }
    }
};
</script>
