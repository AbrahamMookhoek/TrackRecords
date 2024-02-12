import { useCalendarStore } from "/app/store/calendarStore";

const { tracks } = useCalendarStore();

export function createEvents() {
  console.log(tracks);
}
