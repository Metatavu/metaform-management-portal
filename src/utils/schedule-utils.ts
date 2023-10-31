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
    if (schedule === undefined) return true;

    const { startTime, endTime } = schedule;

    const currentTime = DateTime.local();

    if (!startTime && !endTime) {
      return true;
    }

    if (startTime) {
      const startDateTime = DateTime.fromJSDate(new Date(startTime));

      if (!endTime) {
        return startDateTime <= currentTime;
      }

      if (endTime) {
        const endDateTime = DateTime.fromJSDate(new Date(endTime));
        return startDateTime <= currentTime && currentTime < endDateTime;
      }
    } else if (endTime) {
      const endDateTime = DateTime.fromJSDate(new Date(endTime));
      return currentTime < endDateTime;
    }
    return true;
  };

}

export default ScheduleUtils;