<!-- src/views/TimelapsePage.vue -->
<template>
<div class="x">
    <h1 class="tile">
    Wildfire Occurrence Timelapse
    </h1>
  <div class="contt">
    <div class="wrp">
      <TimelapseContainer />
    </div>
    <div class="cardcontt">
      <div class="cardd">
        <h2>Bigger, Later Fires</h2>
        <p>
        Observe how in later months, like November and December, we see a concentration of large fires in the later years.
        </p>
        <p>
        We see here again how the shoulder season for wildfires, the months spanning the summertime, are becoming increasingly active and devastating.
        </p>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import TimelapseContainer from "@/components/TimelapseContainer.vue";
</script>

<script>
export default {
  name: "TimelapsePage",
};
</script>


<style scoped>
.x {
  margin-top: 10vh;
}
.contt {
  display: flex;
  height: 100vh;
  /* align-items: center;
  justify-content: space-around;
}

.cardcontt {
  /* display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30px; */
  margin-right: 5vw;
  margin-top: 30px;

  /* width: 36vw; */
}

.cardd {
  padding-left: 20px;
  padding-right: 13px;
  width: 20vw;
  padding-top: 7px;
  height: 50vh;
  /* Add shadows to create the "card" effect */
  box-shadow: 4px 4px 8px 4px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
}

.cardd p {
  font-size: 14px;
}

/* On mouse-over, add a deeper shadow */
.cardd:hover {
  box-shadow: 4px 8px 16px 4px rgba(0, 0, 0, 0.2);
}

.tile {
  padding-left: 100px;
  margin-bottom: 0px;
  padding-bottom: 0px;
  opacity: 80%;
}
</style>