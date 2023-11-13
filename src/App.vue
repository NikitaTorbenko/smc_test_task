<template>
  <div class="calendar">
    <div class="header">
      <!-- <button @click="prevMonth">&lt;</button> -->
      <div class="select-container">
        <label for="monthSelect">Месяц:</label>
        <select id="monthSelect" v-model="selectedMonthIndex" @change="updateMonth">
          <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
        </select>
      </div>
      <!-- <button @click="nextMonth">&gt;</button> -->
      <div class="select-container">
        <label for="yearSelect">Год:</label>
        <select id="yearSelect" v-model="selectedYear" @change="updateYear">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="day in daysOfWeek" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in calendar" :key="index">
          <template v-if="index === 0 || week[0].selectable !== false">
            <td v-for="day in week" :key="day.value" @click="selectDate(day)">
              {{ day.value ? day.value : '' }}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <p v-if="selectedDate">Выбрана дата: {{ selectedDate }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch, onUpdated } from 'vue'

interface Day {
  value: string | number
  selectable: boolean
}

const daysOfWeek: string[] = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const selectedMonthIndex = ref(currentMonth.value)
const selectedYear = ref(currentYear.value)

const currentDate: Date = new Date()

const selectedDate = ref<string | null>(null)

const updateCalendar = (): Day[][] => {
  const firstDayOfMonth: Date = new Date(currentYear.value, currentMonth.value, 1)
  const lastDayOfMonth: Date = new Date(currentYear.value, currentMonth.value + 1, 0)

  const firstDayOfWeek: number = firstDayOfMonth.getDay()
  const lastDayOfWeek: number = lastDayOfMonth.getDay()

  const daysInMonth: number = lastDayOfMonth.getDate()

  const calendar: Day[][] = []
  let week: Day[] = []

  // Fill the beginning of the calendar with empty cells
  for (let i: number = 0; i + 1 < firstDayOfWeek; i++) {
    week.push({ value: '', selectable: false })
  }

  // Fill the rest of the calendar with days
  for (let day: number = 1; day <= daysInMonth; day++) {
    week.push({ value: day, selectable: true })
    if ((day + firstDayOfWeek - 1) % 7 === 0) {
      calendar.push(week)
      week = []
    }
  }

  // Fill the end of the calendar with empty cells
  for (let i: number = lastDayOfWeek + 1; i <= 7; i++) {
    week.push({ value: '', selectable: false })
  }

  if (week.length > 0) {
    calendar.push(week)
  } else {
    // If the last week is empty, add a new week
    calendar.push([{ value: '', selectable: false }])
  }

  return calendar
}

const calendar = ref<Day[][]>(updateCalendar())

const selectDate = (day: Day): void => {
  if (day.selectable) {
    const formattedDate: string = `${String(day.value).padStart(2, '0')}/${String(
      currentMonth.value + 1
    ).padStart(2, '0')}/${currentYear.value}`
    selectedDate.value = formattedDate
  }
}

watchEffect(() => {
  calendar.value = updateCalendar()
})

watch([selectedMonthIndex, selectedYear], () => {
  currentMonth.value = selectedMonthIndex.value
  currentYear.value = selectedYear.value
})

watchEffect(() => {
  calendar.value = updateCalendar()
})

watch([selectedMonthIndex, selectedYear], () => {
  currentMonth.value = selectedMonthIndex.value
  currentYear.value = selectedYear.value
})

const months: string[] = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
]

const years: number[] = Array.from({ length: 10 }, (_, index) => currentYear.value - 5 + index)

const updateMonth = (): void => {
  currentMonth.value = selectedMonthIndex.value
  calendar.value = updateCalendar()
}

const updateYear = (): void => {
  currentYear.value = selectedYear.value
  calendar.value = updateCalendar()
}

onUpdated(() => console.log(calendar.value))
</script>

<style scoped>
.calendar {
  font-family: 'Arial', sans-serif;
  max-width: 300px;
  margin: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.calendar {
  font-family: 'Arial', sans-serif;
  max-width: 300px;
  margin: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.select-container {
  display: flex;
  align-items: center;
}

label {
  margin-right: 10px;
}

select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

th {
  background-color: #f4f4f4;
}

td {
  background-color: #fff;
}

td[selectable='false'] {
  background-color: #f9f9f9;
  color: #ccc;
  cursor: not-allowed;
}
</style>
