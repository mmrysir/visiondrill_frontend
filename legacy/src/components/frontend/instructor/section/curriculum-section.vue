<script>
    export default {
        data() {
            return {
                editing: false,
                selectedsection: null,
                section: {
                    title: null,
                },
                sectionBeforeEdit: {}
            }
        },
        props: [
            'sections', 'course', 'to'
        ],
        methods: {
            saveSection(section) {
                axios.post('/api/instructor/course/'+this.course.id+'/sections/'+section.id+'/edit', {
                    course_id: this.course,
                    title: section.title,
                }).then(this.selectedsection = null)
                .catch(console.log('failed'))
            },
            editSection(section) {
                this.editing = true;
                this.selectedsection = section.id;
                Object.assign(this.sectionBeforeEdit, section);
            },
            cancelEdit(section) {
                this.editing = false;
                this.selectedsection = null;
                Object.assign(section, this.sectionBeforeEdit);
            },
            deleteLesson(lesson) {
                if(confirm("Do you really want to delete?")) {
                    axios.delete('/api/instructor/lesson/' + lesson.id + '/delete')
                    .then(() => {
                        location.reload();
                    })
                }
            },
            toggleFreePreview(lesson) {
                axios.put('/api/instructor/lesson/' + lesson.id + '/toggle-free-preview')
                .then(() => {
                    location.reload();
                })
            }
        },
        created(section) {
            this.sectionBeforeEdit = this.section;
        }
}
</script>
