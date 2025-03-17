<template>
  <div class="flex items-center justify-center p-8">
    <div class="relative touch-none" style="perspective: 400px">
      <div class="relative h-48 w-80 overflow-hidden rounded-xl bg-lime-300 p-6 shadow-xl">
        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold text-blue-900">VISA</div>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-200 hover:cursor-pointer"
            @click="isVisible = !isVisible"
            :aria-label="isVisible ? 'Hide card details' : 'Show card details'"
          >
            <component :is="isVisible ? EyeOff : Eye" class="h-4 w-4 text-blue-900" />
          </button>
        </div>
        <div class="mt-2 text-xl font-medium tracking-wider text-blue-900">
          {{ isVisible ? cardData.number : getMaskedNumber(cardData.number) }}
        </div>
        <div class="mt-6 flex justify-between">
          <div class="text-blue-900">
            <div class="text-xs opacity-80">Card Holder</div>
            <div class="font-semibold">{{ cardData.holder }}</div>
          </div>
          <div class="text-blue-900">
            <div class="text-xs opacity-80">Expires</div>
            <div class="font-semibold">{{ isVisible ? cardData.expiry : '**/**' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Eye, EyeOff } from 'lucide-vue-next';


type Props = {
  name?: string;
}

const props = defineProps<Props>();

const cardData = ref({
  number: '',
  holder: '',
  expiry: '',
});
const isVisible = ref(false);

const generateCardData = () => {
  const generateNumber = () => {
    let number = '';
    for (let i = 0; i < 16; i++) {
      number += Math.floor(Math.random() * 10);
      if ((i + 1) % 4 === 0 && i !== 15) number += ' ';
    }
    return number;
  };

  const generateExpiry = () => {
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const year = String(new Date().getFullYear() + Math.floor(Math.random() * 5)).slice(-2);
    return `${month}/${year}`;
  };

  return {
    number: generateNumber(),
    holder: props.name || 'John Doe',
    expiry: generateExpiry(),
  };
};

onMounted(() => {
  cardData.value = generateCardData();
});

const getMaskedNumber = (number: string) => {
  const lastFour = number.slice(-4);
  return `**** **** **** ${lastFour}`;
};
</script>
