<template>
  <div class="justify-content-center align-items-center h-screen w-full">
    <div class="text-center">
      <h2>Welcome to round number {{ frameId }}</h2>
      <p>Please press the button to proceed with throws</p>
      <p>Throw Count: {{ throwCount }}</p>
      <p v-if="throwCount >= 1">First Shot: {{ firstShotPoints }}</p>
      <p v-if="throwCount >= 2">Second Shot: {{ secondShotPoints }}</p>
      <p v-if="throwCount >= 3">Third Shot: {{ thirdShotPoints }}</p>
      <Button
        label="Throw"
        @click="throwBall"
        :disabled="throwCount >= getMaxThrows()"
      />

      <Dialog
        v-model:visible="showStrikeModal"
        header="Strike!"
        :modal="true"
        :closable="false"
      >
        <div class="p-4 flex flex-column align-items-center">
          <img
            src="../../../../public/images/rocket.png"
            alt="Rocket"
            class="w-24 h-24 mb-4"
          />
          <p class="text-lg font-bold text-green-500">Strike! Great job!</p>
        </div>
      </Dialog>

      <Dialog
        v-model:visible="showSpareModal"
        header="Spare!"
        :modal="true"
        :closable="false"
      >
        <div class="p-4 flex flex-column align-items-center">
          <img
            src="../../../../public/images/medal.png"
            alt="Medal"
            class="w-24 h-24 mb-4"
          />
          <p class="text-lg font-bold text-blue-500">Spare! Well done!</p>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import createApiClient from "@/initializers/axios";
import { useToast } from "vue-toast-notification";

export default defineComponent({
  name: "Frame",
  components: { Button, Dialog },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const apiClient = createApiClient(toast);

    const frameId = ref(Number(route.params.id));
    const gameId = ref(route.params.gameId);
    const throwCount = ref<number>(0);
    const firstShotPoints = ref<number | null>(null);
    const secondShotPoints = ref<number | null>(null);
    const thirdShotPoints = ref<number | null>(null);
    const isStrike = ref(false);
    const isSpare = ref(false);

    const showStrikeModal = ref(false);
    const showSpareModal = ref(false);

    const getMaxThrows = () => {
      // In any frame, get 3 throws if strike or spare
      if (isStrike.value || isSpare.value) {
        return 3;
      }
      return 2;
    };

    const resetThrows = () => {
      throwCount.value = 0;
      firstShotPoints.value = null;
      secondShotPoints.value = null;
      thirdShotPoints.value = null;
      isStrike.value = false;
      isSpare.value = false;
    };

    const throwBall = async () => {
      if (throwCount.value >= getMaxThrows()) return;

      let points;

      // First throw can be 0-10
      if (throwCount.value === 0) {
        points = Math.floor(Math.random() * 11);

        // Check for strike
        if (points === 10) {
          isStrike.value = true;
          showStrikeModal.value = true;
          setTimeout(() => (showStrikeModal.value = false), 3000);
        }
      }
      // Second throw
      else if (throwCount.value === 1) {
        // If first throw was a strike, second throw can be 0-10
        if (isStrike.value) {
          points = Math.floor(Math.random() * 11);
        } else {
          // Otherwise, second throw can only knock down remaining pins
          points = Math.floor(Math.random() * (11 - firstShotPoints.value!));
        }

        // Check for spare
        if (!isStrike.value && firstShotPoints.value! + points === 10) {
          isSpare.value = true;
          showSpareModal.value = true;
          setTimeout(() => (showSpareModal.value = false), 3000);
        }
      }
      // Third throw (after strike or spare)
      else if (throwCount.value === 2) {
        if (isStrike.value) {
          // If second throw was also a strike, third throw can be 0-10
          if (secondShotPoints.value === 10) {
            points = Math.floor(Math.random() * 11);
          } else {
            // If second throw wasn't a strike, can only knock down remaining pins
            points = Math.floor(Math.random() * (11 - secondShotPoints.value!));
          }
        } else if (isSpare.value) {
          // After a spare, third throw can be 0-10
          points = Math.floor(Math.random() * 11);
        }
      }

      throwCount.value++;

      if (throwCount.value === 1) firstShotPoints.value = points;
      if (throwCount.value === 2) secondShotPoints.value = points;
      if (throwCount.value === 3) thirdShotPoints.value = points;

      await sendResult();

      // Check if we're done with this frame
      if (throwCount.value >= getMaxThrows()) {
        setTimeout(() => moveToNextFrame(), 1000);
      }
    };

    const moveToNextFrame = () => {
      if (frameId.value === 10) {
        router.push(`/game/${gameId.value}/results`);
      } else {
        const nextFrame = frameId.value + 1;
        router.push(`/frame/${gameId.value}/${nextFrame}`).then(() => {
          frameId.value = nextFrame;
          resetThrows();
        });
      }
    };

    const sendResult = async () => {
      const payload = {
        firstShotPoints: firstShotPoints.value ?? 0,
        secondShotPoints: secondShotPoints.value ?? 0,
        thirdShotPoints: thirdShotPoints.value ?? 0,
        frameId: frameId.value,
      };

      try {
        await apiClient.put(`/game/${gameId.value}`, payload);
        toast.open({
          message: "Frame result submitted successfully!",
          type: "success",
          position: "top-right",
          duration: 1000,
        });
      } catch (error) {
        console.error("Error submitting result:", error);
        toast.open({
          message: "Failed to submit the frame result.",
          type: "error",
          position: "top-right",
          duration: 1000,
        });
      }
    };

    return {
      frameId,
      throwBall,
      throwCount,
      firstShotPoints,
      secondShotPoints,
      thirdShotPoints,
      getMaxThrows,
      showStrikeModal,
      showSpareModal,
    };
  },
});
</script>

<style>
.text-center {
  text-align: center;
}
</style>
