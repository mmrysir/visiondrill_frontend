<template>
    <div class="alert alert-dismissable" :class="type">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        <i class="fa fa-info-circle"></i> {{ alertText }}
    </div>
</template>
<script>
export default {
    props: {
        type: String,
        alertText: String,
    }
}

</script>
