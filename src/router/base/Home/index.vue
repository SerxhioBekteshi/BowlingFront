<template>
  <div
    class="flex justify-content-center align-items-center"
    style="height: 100vh; width: 100%"
  >
    <div class="text-center">
      <Button label="Start the game" @click="showModal = true" />
    </div>
  </div>
  <Dialog v-model:visible="showModal" header="Enter Your Name" :modal="true">
    <div class="p-4">
      <InputText v-model="name" placeholder="Your name" class="w-full mb-3" />
      <Button
        :label="loading ? 'Submitting...' : 'Submit'"
        :disabled="loading"
        @click="submitName"
        class="w-full"
      >
        <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
        Submit
      </Button>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import { useToast } from "vue-toast-notification";
import createApiClient from "@/initializers/axios";
import { useStore } from "vuex";
import { eMutationTypes } from "@/assets/enums/eMutationTypes";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Home",
  components: { Button, Dialog, InputText },
  setup() {
    const showModal = ref<boolean>(false);
    const name = ref<string>("");
    const loading = ref<boolean>(false);
    const store = useStore();
    const router = useRouter();

    const toast = useToast();
    const apiClient = createApiClient(toast);

    const createGame = async (playerId: number) => {
      try {
        const response = await apiClient.post("game", {
          playerId: playerId,
        });
        return response.data.data;
      } catch (error) {
        loading.value = false;
        console.log(error);
      }
    };

    const submitName = async () => {
      loading.value = true;
      try {
        const response = await apiClient.post("player", {
          name: name.value,
        });
        if (response.data.data) {
          // store.commit(eMutationTypes.SET_USER_ID, response.data.data);

          const gameCreatedId = await createGame(response.data.data);
          if (gameCreatedId) {
            toast.open({
              message: "Ready to start the game",
              type: "success",
              position: "top-right",
              duration: 3000,
            });

            setTimeout(() => {
              router.push(`/frame/${gameCreatedId}/1`);
              loading.value = false;
              showModal.value = false;
              name.value = "";
            }, 3000);
          }
        }
      } catch (error) {
        loading.value = false;
        showModal.value = false;
        console.log(error);
      }
    };

    return { showModal, name, loading, submitName };
  },
});
</script>

<style>
.p-dialog {
  max-width: 400px;
}
</style>
