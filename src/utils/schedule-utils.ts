import { MetaformFieldSchedule } from "generated/client";
import { DateTime } from "luxon";

/**
 * Utility class for field schedules
 */
namespace ScheduleUtils {

  /**
   * Returns whether field is scheduled to be visible or not
   *
   * @param schedule MetaformFieldSchedule
   * @returns whether field is scheduled to be visible or not
   */
  export const isVisible = (schedule: MetaformFieldSchedule | undefined) => {
    if (schedule === undefined || (!schedule.startTime && !schedule.endTime)) return true;

    const { startTime, endTime } = schedule;

    const currentTime = DateTime.local();

    switch (true) {
      case startTime && !endTime:
        if (!startTime) return false;
        return DateTime.fromJSDate(new Date(startTime)) <= currentTime;

      case !!startTime && !!endTime:
        if (!startTime || !endTime) return false;
        return DateTime.fromJSDate(new Date(startTime)) <= currentTime && currentTime < DateTime.fromJSDate(new Date(endTime));

      case !startTime && !!endTime:
        if (!endTime) return false;
        return currentTime < DateTime.fromJSDate(new Date(endTime));

      default:
        return true;
    }
  };

}

export default ScheduleUtils;