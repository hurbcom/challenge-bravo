// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

// dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
    compareInHours(start_date: Date, end_date: Date): number {
        return new Date().getDate(); // dayjs(end_date).diff(start_date, "hours");
    }

    convertToUTC(date: Date): string {
        return new Date().toUTCString(); // dayjs(date).utc().local().format();
    }
}

export { DayjsDateProvider };
