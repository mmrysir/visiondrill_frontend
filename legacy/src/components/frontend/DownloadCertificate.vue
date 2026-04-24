<template>
    <a href="#" @click.prevent="downloadCertificate()">
        <button class="py-1 px-4 bg-primary text-white border-2 rounded focus:outline-none"><i class="fa fa-download"></i>
            Download Certificate</button>
    </a>
</template>

<script>
export default {
    props: ['course', 'user', 'hasReviewedCourse', 'shouldPurchase'],
    data() {
        return {
            //
        }
    },

    methods: {
        downloadCertificate() {
            if (!hasReviewedCourse) {
                if (window.confirm('Leave a review on this course')) {
                    window.location.href = `/course/${this.course.slug}/learn#instructor`;
                }
            }

            if (this.shouldPurchase) {
                window.location.href = `/purchase-certificate/show?course_id=${this.course.id}`;
            } else {
                axios.get(`/courses/${this.course.id}/download-certificate`)
                    .then(({ data }) => {
                        var fileURL = data.certificate_url;
                        var fileLink = document.createElement('a');
                        fileLink.href = fileURL;
                        fileLink.setAttribute('download', data.fileName);
                        document.body.appendChild(fileLink);
                        fileLink.click();
                    })
            }
        }
    }
}
</script>
