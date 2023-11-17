<!-- YearSelector.vue -->
<template>
  <div class="year-selector">
    <el-button @click="changeYear(-1)" :icon="ArrowLeft" :disabled="isYearOutOfRange(selectedYear, 'left')"></el-button>

    <el-date-picker v-model="selectedYear" style="width: 8rem;" type="year" placeholder="Select year"
      :disabledDate="disabledDate" @change="onYearChange"></el-date-picker>
    <el-button @click="changeYear(1)" :icon="ArrowRight" :disabled="isYearOutOfRange(selectedYear, 'right')"></el-button>
  </div>
</template>
  
<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  availableYears: Array,
  initialYear: Number
});

const emits = defineEmits(['update:year']);

const selectedYear = ref(new Date(props.initialYear, 0));

const disabledDate = (time) => {
  const year = time.getFullYear();
  return year < 1984 || year > 2022;
};

const isYearOutOfRange = (date, direction) => {
  if (!date) return true;
  const year = date.getFullYear();
  if (direction === 'left') {
    return year <= 1984;
  } else {
    return year >= 2022;
  }
};

const changeYear = (delta) => {
  const newYear = new Date(selectedYear.value.getFullYear() + delta, 0);
  selectedYear.value = newYear;
  emits('update:year', newYear.getFullYear());
};

const onYearChange = () => {
  if (selectedYear.value) {
    emits('update:year', selectedYear.value.getFullYear());
  }
};



</script>
  
<style scoped></style>
