<template>
  <div class="calendar-container">
    <BlockUI :blocked="isEventDialog">
      <header class="calendar-header">
        <div class="calendar-picker">
          <Button icon="pi pi-angle-left" text @click="prevMonth" />
          <DatePicker v-model="datepicker" view="month" dateFormat="mm/yy" class="text-center" />
          <Button icon="pi pi-angle-right" text @click="nextMonth" />
        </div>
        <Button icon="pi pi-star" variant="text" aria-label="Star" @click="goToToday" />
      </header>
      <div class="calendar-grid">
        <div v-for="(day, index) in daysOfWeek" :key="index" class="calendar-day-header">
          {{ day }}
        </div>
        <div v-for="(day, index) in calendarDays" :key="index" class="calendar-day"
          :class="{ 'calendar-today': isToday(day) && !day.isOtherMonth, 'other-month': day.isOtherMonth }">
          <Tag v-if="day.events.length > 0 && !isToday(day)" :value="day.date" severity="success" class="cursor-pointer"
            @click="openEventDialog(day.events)">
          </Tag>
          <div v-else class="day-number">
            <Tag v-if="day.events.length > 0 && isToday(day)" severity="warn" :value="day.date" class="cursor-pointer"
              @click="openEventDialog(day.events)"></Tag>
            <span v-else>{{ day.date }}</span>
          </div>
        </div>
      </div>
    </BlockUI>
    <Dialog v-model:visible="isEventDialog" header="Todo">
      <DataTable :value="dayEvents" tableStyle="min-width: 50vh">
        <Column field="time" header="Time"></Column>
        <Column field="title" header="Task"></Column>
      </DataTable>
    </Dialog>
  </div>
</template>


<script lang="ts" setup>
import { ref, computed, watch } from 'vue';

const today = new Date();
const currentYear = ref<number>(today.getFullYear());
const currentMonth = ref<number>(today.getMonth());
const datepicker = ref(new Date(today.getFullYear(), today.getMonth()));
const dayEvents = ref();
const isEventDialog = ref<boolean>(false);

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const events = [
  { id: 1, date: new Date(today.getFullYear(), 11, 1), title: 'Meeting at 9AM', time: '9:00' },
  { id: 2, date: new Date(today.getFullYear(), today.getMonth(), 17), title: 'Project Deadline', time: '12:00' },
  { id: 3, date: new Date(today.getFullYear(), today.getMonth(), 21), title: 'Project Deadline', time: '15:00' },
];

const calendarDays = computed(() => {
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();

  const days = [];

  const prevMonthDays = new Date(currentYear.value, currentMonth.value, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({ date: prevMonthDays - i, events: [], isOtherMonth: true });
  }

  for (let date = 1; date <= daysInMonth; date++) {
    const dayEvents = events.filter(
      (event) =>
        event.date.getDate() === date &&
        event.date.getMonth() === currentMonth.value &&
        event.date.getFullYear() === currentYear.value
    );
    days.push({ date, events: dayEvents, isOtherMonth: false });
  }
  const nextMonthDayCount = 42 - days.length;
  for (let i = 1; i <= nextMonthDayCount; i++) {
    days.push({ date: i, events: [], isOtherMonth: true });
  }
  return days;
});

watch(datepicker, (newDate) => {
  currentYear.value = newDate.getFullYear();
  currentMonth.value = newDate.getMonth();
  console.log("datepicker.value: ", newDate);
});

const isToday = (day: { date: number | null }) => {
  return (
    day.date &&
    day.date === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  );
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  datepicker.value = new Date(currentYear.value, currentMonth.value);
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  datepicker.value = new Date(currentYear.value, currentMonth.value);
};

const goToToday = () => {
  currentYear.value = today.getFullYear();
  currentMonth.value = today.getMonth();
};

const openEventDialog = (event: any) => {
  isEventDialog.value = true;
  dayEvents.value = event;
};
</script>



<style lang="scss" scoped>
@use "@assets/scss/variable";

.calendar-container {
  max-width: 100%;
  margin: auto;
  max-height: calc(100vh);
  overflow-y: scroll;
  padding-bottom: 20px;

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #ddd;
    color: variable.$white;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    .calendar-day-header {
      text-align: center;
      padding: 8px;
      font-weight: bold;
      color: variable.$main-color;
      border-right: variable.$white 1px solid;
      border-bottom: variable.$white 1px solid;
    }

    .calendar-today {
      background-color: variable.$green-800;
    }

    .calendar-day {
      height: 13.5vh;
      padding: 8px;
      position: relative;
      border-bottom: variable.$white 1px solid;
      border-right: variable.$white 1px solid;
      color: variable.$white;
      display: flex;
      align-items: center;
      justify-content: center;

      &.other-month {
        color: variable.$gray-400;
      }

      .events {
        margin-top: 8px;
      }

      .event {
        background-color: #007bff;
        color: #fff;
        padding: 4px;
        border-radius: 4px;
        font-size: 12px;
        margin-bottom: 4px;
        cursor: pointer;
      }

    }
  }
}
</style>
