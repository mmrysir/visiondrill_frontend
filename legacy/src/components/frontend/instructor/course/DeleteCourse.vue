<template>
<div class="row">
        <div class="col-md-12">
            <div class="white-box">
                <a href="#" @click.prevent="deleteCourse()" class="btn btn-warning   btn-rounded hidden-xs hidden-sm waves-effect waves-light"><i class="fa fa-trash"></i> Delete Course Permanently</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        props: ['id'],
        methods: {
            deleteCourse()
            {
                Swal.fire({
                  title: 'Are you sure?',
                  text: "You won't be able to revert this!",
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                  if (result.value) {
                    axios.delete('/instructor/courses/'+this.id+'/delete')
                    .then(() => {
                        Swal.fire(
                          'Deleted!',
                          'Course has been deleted successfully.',
                          'success'
                        )
                        setTimeout(function() {
                          window.location.href = "/instructor/courses";
                        }, 2000);
                    }).catch(() => {
                        Swal.fire(
                          'Oops!',
                          'This course can not be deleted as it is enrolled by students and contain payment information.',
                          'error'
                        )
                    })
                  }
                })
            }
        }
    }
</script>
