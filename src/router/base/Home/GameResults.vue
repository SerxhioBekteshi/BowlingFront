<template>
  <div class="flex flex-column justify-content-center align-items-center p-6">
    <h1 class="text-4xl font-bold text-center text-green-600">
      🎉 Congratulations! 🎉
    </h1>
    <p class="text-2xl font-semibold mt-2">You finished your game.</p>
    <p class="text-3xl font-bold text-blue-500 mt-4">
      Total Score: <span class="text-red-500">{{ totalScore }}</span>
    </p>

    <DataTable
      v-if="gameFrames.length"
      :value="gameFrames"
      class="p-datatable-striped p-datatable-gridlines mt-6 w-full max-w-2xl"
    >
      <Column field="frameId" header="Round" class="text-center"></Column>
      <Column
        field="firstThrow"
        header="First Shot"
        class="text-center"
      ></Column>
      <Column field="secondThrow" header="Second Shot" class="text-center">
        <template #body="slotProps">
          {{ slotProps.data.secondThrow ?? 0 }}
        </template>
      </Column>
      <Column field="thirdThrow" header="Third Shot" class="text-center">
        <template #body="slotProps">
          {{ slotProps.data.thirdThrow ?? "-" }}
        </template>
      </Column>
      <Column field="totalScore" header="Score" class="text-center"></Column>
      <Column header="Status" class="text-center">
        <template #body="slotProps">
          <span
            v-if="slotProps.data.isSpareOrStrike"
            class="text-green-500 font-bold"
          >
            STRIKE / SPARE
          </span>

          <span v-else class="text-gray-700">-</span>
        </template>
      </Column>
    </DataTable>
    <div class="text-center mt-3">
      <router-link to="/">
        <Button label="New Game" />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useToast } from "vue-toast-notification";
import createApiClient from "@/initializers/axios";
import { useRoute } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";

export default defineComponent({
  name: "GameResults",
  components: { DataTable, Column, Button },
  setup() {
    const route = useRoute();
    const gameId = route.params.gameId;

    const toast = useToast();
    const apiClient = createApiClient(toast);

    const gameFrames = ref([]); //i can give specific type here if needed based on backend object
    const totalScore = ref<number>(0);

    const getGameResults = async () => {
      try {
        const response = await apiClient.get(`game/results/${gameId}/get-all`);
        gameFrames.value = response.data.data.gameFrames;
        totalScore.value = response.data.data.totalScore;
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(() => getGameResults());

    return { gameFrames, totalScore };
  },
});
</script>

<style>
.p-datatable {
  border-radius: 10px;
  overflow: hidden;
}
.p-datatable .p-datatable-thead > tr > th {
  background-color: #4a5568;
  color: white;
  text-align: center;
}
.p-datatable .p-datatable-tbody > tr:hover {
  background-color: #edf2f7;
}
</style>
