<template>
  <div class="flex items-end justify-between mb-2">
    <Toast />
    <div class="flex">
      <div class="flex flex-col me-3" style="width: 50%;">
        <span class="mb-1">Language</span>
        <Select v-model="selectedCountry" :options="countries" optionLabel="name" placeholder="Select a Country"
          variant="filled" style="width:100%;" :disabled="isGenerating">
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <img :alt="slotProps.value.label" :src="slotProps.value.img" :class="`mr-2 flag`" style="width: 18px" />
              <div>{{ slotProps.value.name }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex items-center">
              <img :alt="slotProps.option.label" :src="slotProps.option.img" :class="`mr-2 flag`" style="width: 18px" />
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
          <template #dropdownicon>
            <i class="pi pi-map" />
          </template>
        </Select>
      </div>
      <div class="flex flex-col">
        <span class="mb-1">Number of responses</span>
        <InputNumber v-model="amount" showButtons :step="1" :min="1" :max="5" style="width: 100%;"
          :disabled="isGenerating" />
      </div>
    </div>
    <div>
      <Button label="Generate" @click="generateDataSample" :loading="isGenerating" class="me-3" style="height: 50%;" />
      <Button label="" icon="pi pi-copy" @click="onCopy" :disabled="isGenerating" style="height: 50%;" />
    </div>
  </div>
  <Splitter style="height: calc(100vh - 167px)">
    <SplitterPanel class="flex flex-col justify-between" :size="40">
      <Textarea v-model="dtoInput" placeholder="Dto" style="width: 100%; height: 100%; resize: none;"
        :inert="isGenerating" />
    </SplitterPanel>
    <SplitterPanel class="flex items-center justify-center" :size="60">
      <Codemirror v-model="sampleData" class="json-editor" style="width: 100%; height: 100%;" :extensions="basicSetup"
        :disabled="sampleData == '' || isGenerating" />
    </SplitterPanel>
  </Splitter>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { countries } from '../../utils/codeConstants';
import { basicSetup } from 'codemirror';
import { useToast } from "primevue/usetoast";

const toast = useToast();
const dtoInput = ref<string>("");
const amount = ref<number>(1);
const selectedCountry = ref(countries.find(country => country.name === 'United States'));
const sampleData = ref<any>("");
const isGenerating = ref<boolean>(false);

const generateDataSample = async () => {
  if (dtoInput.value !== "") {
    isGenerating.value = true;
    sampleData.value = "";
    try {
      const result = await window.electronAPI.generateSampleData(dtoInput.value, amount.value, selectedCountry.value?.code);
      sampleData.value = result.replace(/```json\n|```/g, "");
    } catch (err: any) {
      console.log("error: ", err);
    } finally {
      isGenerating.value = false;
    }
  }
  else {
    toast.add({ severity: 'error', summary: 'Please enter Dto', closable: true });
    setTimeout(() => toast.removeAllGroups(), 1000);
    
  }
}

const onCopy = () => {
  window.electronAPI.copyText("abc");
};

</script>