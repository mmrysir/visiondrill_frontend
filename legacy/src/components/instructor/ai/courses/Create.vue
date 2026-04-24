<script>
export default {
    props: ['categories'],

    data() {
        return {
            'category_id': '',
            'course_title': '',
            'is_submitted': false,
            'step': 1,
        }
    },
    methods: {
        handleSubmit() {
            this.is_submitted = true;
            this.progressSteps();
            axios.post('/instructor/courses/ai', {
                'category_id': this.category_id,
                'course_title': this.course_title,
            })
            .then((response) => {
                console.log(response.data.course_id);
                console.log(response.data.redirect_url);
                console.log('full response', response);
                window.location.href = `/instructor/courses/${response.data.course_id}/curriculum`;
            })
            .catch((error) => {
                alert('Sorry, please try again by refreshing the page');
            })
        },
        progressSteps() {
            const steps = [1, 2, 3, 4, 5];
            let index = 1;

            const interval = setInterval(() => {
                if (index < steps.length) {
                    this.step = steps[index];
                    index++;
                } else {
                    clearInterval(interval);
                    this.steps = 6;
                }
            }, 5000);
        }
    }
}
</script>

<template>
    <div class="row" style="height: 100%;">
        <div v-if="!is_submitted" class="col-sm-12">
            <div class="alert alert-info"><i class="fa fa-info"></i> &nbsp; Add basic information about your course. </div>
            <div class="white-box">
                <form data-toggle="validator" @submit="handleSubmit">
                    <div class="row">
                        <div class="form-group col-md-12">
                            <label for="category_id" class="control-label">Course Category</label>
                            <select v-model="category_id" class="form-control" id="category_id" required name="category_id">
                                <template v-for="category in categories">
                                    <option :value="category.id">{{ category.name }}</option>
                                    <template v-if="category.childrens">
                                        <option v-for="childCategory in category.childrens" :value="childCategory.id">>>{{
                                            childCategory.name }}</option>
                                    </template>
                                </template>
                            </select>
                        </div>
                    </div>

                    <div class="row">
                        <div class="form-group col-md-12">
                            <label for="course_title" class="control-label">Which course you want to create?</label>
                            <input v-model="course_title" type="text" name="course_title" class="form-control"
                                id="course_title" placeholder="e.g. Advanced Software Development using PHP" required>
                            <div class="help-block with-errors"></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <button type="submit"
                            class="btn btn-danger btn-rounded btn-outline waves-effect waves-light pull-right">Create
                            Course</button>
                    </div>
                </form>
            </div>
        </div>
        <div v-else class="col-sm-12 h2" style="height: 100%; display: flex; align-items: center; justify-content: center;">
            <div v-if="step === 1">
                <p>Generating course name and description...</p>
            </div>
            <div v-else-if="step === 2">
                <p>Generating course sections...</p>
            </div>
            <div v-else-if="step === 3">
                <p>Generating course lessons...</p>
            </div>
            <div v-else-if="step === 4">
                <p>Almost ready...</p>
            </div>
            <div v-else>
                <p>Processing complete! Redirecting ...</p>
            </div>
            <div v-if="step !== 5">
                <div class="loading-indicator"></div>
            </div>
        </div>
    </div>
</template>

<style>
.loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
}

.loading-indicator {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid #fff;
    border-color: #fff transparent transparent transparent;
    animation: loading-spin 1s linear infinite;
}

@keyframes loading-spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
