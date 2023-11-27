<!-- YearSelector.vue -->
<template>
  <div class="year-selector">
    <el-button class="custom-button" @click="changeYear(-1,'year')" :icon="DArrowLeft" :disabled="isYearOutOfRange(selectedYear, 'left','year')"></el-button>

    <el-button class="custom-button" @click="changeYear(-1,'month')" :icon="ArrowLeft" :disabled="isYearOutOfRange(selectedYear, 'left','month')"></el-button>

    <el-date-picker class="custom-picker" v-model="selectedYear" style="width: 8rem;" type="month" placeholder="Select month"
      :disabledDate="disabledDate" @change="onYearChange"></el-date-picker>
    <el-button class="custom-button" @click="changeYear(1,'month')" :icon="ArrowRight" :disabled="isYearOutOfRange(selectedYear, 'right','month')"></el-button>
    <el-button class="custom-button" @click="changeYear(1,'year')" :icon="DArrowRight" :disabled="isYearOutOfRange(selectedYear, 'right','year')"></el-button>

  </div>
</template>
  
<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { ArrowLeft, ArrowRight, DArrowLeft, DArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  initialYear: Number,
  initialMonth: Number
});

const emits = defineEmits(['update:yearMonth']);

const selectedYear = ref(new Date(props.initialYear, 0));
const minYear = 2005;
const maxYear = 2015;
const disabledDate = (time) => {
  const year = time.getFullYear();
  return year < minYear || year > maxYear;
};

const isYearOutOfRange = (date, direction, yymm) => {
  if (!date) return true;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  if (direction === 'left') {
    if (yymm === 'year') {
      return year <= minYear;
    } else {
      return year === minYear && month === 1;
    }
  } else {
    if (yymm === 'year') {
      return year >= maxYear;
    } else {
      return year === maxYear && month === 12;
    }
  }
};

const changeYear = (delta, isYear) => {
  const currentYear = selectedYear.value.getFullYear();
  const currentMonth = selectedYear.value.getMonth(); // 保持当前选择的月份
  let newYear;
  if (isYear === "year"){
    newYear = new Date(currentYear + delta, currentMonth);
  } else {
    newYear = new Date(currentYear, currentMonth + delta);
  }
  selectedYear.value = newYear;
  emits('update:yearMonth', { year: newYear.getFullYear(), month: newYear.getMonth() + 1 });
};

const onYearChange = () => {
  if (selectedYear.value) {
    const year = selectedYear.value.getFullYear();
    const month = selectedYear.value.getMonth() + 1;
    emits('update:yearMonth', { year, month });
  }
};



</script>
  
<style scoped>


</style>
