<template>
    <div>
        <v-text-field
            :value="value"
            :label="value"
            :placeholder="placeholder"
            @input="$emit('input', $event.target.value)"
            :type="type"
            outlined
        ></v-text-field>
    </div>
</template>

<script>
export default {
    props: {
        type: String,
        value: String,
        placeholder: String,
        disable: Boolean
    }
};
</script>

<style></style>
