import { type ScheduleBlock } from "./wbgt";

export interface CurrentTaskInfo {
  currentBlock: ScheduleBlock | null;
  minutesRemaining: number;
  isActive: boolean;
  currentTime: string;
}

export function getCurrentTask(schedule: ScheduleBlock[]): CurrentTaskInfo {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  // Format current time for display
  const period = currentHour >= 12 ? "PM" : "AM";
  const displayHour = currentHour % 12 || 12;
  const currentTime = `${displayHour}:${currentMinute.toString().padStart(2, "0")} ${period}`;
  
  // Parse time string to minutes
  const parseTimeToMinutes = (timeStr: string): number => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };
  
  // Find current task
  for (const block of schedule) {
    const startMinutes = parseTimeToMinutes(block.startTime);
    const endMinutes = parseTimeToMinutes(block.endTime);
    
    if (currentTimeInMinutes >= startMinutes && currentTimeInMinutes < endMinutes) {
      const minutesRemaining = endMinutes - currentTimeInMinutes;
      return {
        currentBlock: block,
        minutesRemaining,
        isActive: true,
        currentTime,
      };
    }
  }
  
  // No current task found
  return {
    currentBlock: null,
    minutesRemaining: 0,
    isActive: false,
    currentTime,
  };
}
