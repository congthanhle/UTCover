<template>
  <DataTable :value="dtoInput" scrollable :scrollHeight="scrollHeight">
    <Column header="Property">
      <template #body="slotProps">
        <InputText v-model="slotProps.data.property" />
      </template>
    </Column>
    <Column header="Type">
      <template #body="slotProps">
        <div class="flex">
          <Select v-model="slotProps.data.type" :options="type" optionLabel="value" placeholder="Select a Type"
            class="w-full md:w-56" />
          <Button v-if="slotProps.index !== 0 && slotProps.data.property && slotProps.data.type" icon="pi pi-times"
            size="small" text @click="deleteRow(slotProps.index)" />
        </div>
      </template>
    </Column>
    <Column header="isNull">
      <template #body="slotProps">
        <div class="flex">
          <Checkbox v-model="slotProps.data.isNull" binary />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  interface Dto {
    property: string
    type: Type,
    isNull: boolean
  }

  interface Type {
    key: string
    value: string | Array<Dto>
  }

  const props = defineProps({
    dtoInput: {
      type: Array as () => Dto[],
      required: true,
      default: [{ property: "", type: { key: "", value: "" }, isNull: false }]
    },
    scrollHeight: {
      type: String,
      default: "calc(100vh - 167px)"
    }
  });

  const type = ref<Type[]>([
    {
      key: "string",
      value: "String"
    },
    {
      key: "number",
      value: "Number"
    },
    {
      key: "boolean",
      value: "Boolean"
    }
  ])

  watch(props.dtoInput,
    () => {
      if (props.dtoInput.length > 0) {
        if (props.dtoInput.length >= 3) {
          const emptyDtoIndex = props.dtoInput.findIndex((e, index) => e.property === "" && e.type.key === "" && e.type.value === "" && index != props.dtoInput.length - 1);
          if (emptyDtoIndex !== -1) {
            props.dtoInput.splice(emptyDtoIndex, 1);
          }
        }
        const lastDto = props.dtoInput[props.dtoInput.length - 1];
        if (lastDto.property !== "" && lastDto.type.key !== "") {
          props.dtoInput.push({ property: "", type: { key: "", value: "" }, isNull: false });
        }
      }
    },
    { deep: true }
  );

  const deleteRow = (index: number) => {
      props.dtoInput.splice(index, 1);
    };
</script>

