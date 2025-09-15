<script setup>

defineProps({ id: String})

</script>


<template>
    <div class="modal fade" :id>
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-body">
                    <slot>

                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>

</style>