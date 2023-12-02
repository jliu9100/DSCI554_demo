<!-- views/PackPage.vue -->
<template>
  <div class="cont">
    <div class="wrp">
      <PackContainer />
    </div>
    <div class="cardcont">
      <div class="card">
        <h2>Bigger Fires</h2>
        <p>
        We have seen an increase in total acreage burned each decade from 1990 to 2020.
        </p>
        <p>
        Individual fires in the 2000s and 2010s burned more acreage on average than those in the 1990s.
        </p>
        <p>
        The tenth largest fire in the 2010s nearly exceeds the largest fire in the 1990s.
          Use the month selector to explore the wildfire occurences in a given month.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import PackContainer from "@/components/PackContainer.vue";
</script>

<script>
export default {
  name: "PackPage",
};
</script>


<style scoped>
.cont {
  display: flex;
}

.cardcont {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30px;

  width: 36vw;
}

.card {
  padding-left: 20px;
  padding-right: 13px;
  width: 25vw;
  height: 50vh;
  /* Add shadows to create the "card" effect */
  box-shadow: 4px 4px 8px 4px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
}

.card p {

  font-size: 12px;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 4px 8px 16px 4px rgba(0, 0, 0, 0.2);
}
.wrp {
  width: 60vw;
}
</style>