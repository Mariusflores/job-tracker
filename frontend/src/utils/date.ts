import {type MonthKey, MONTHS} from "../constants/date.ts";

export function parseDate(date: string) {
    const [year, month, day] = date.split("-");

    // month as MonthKey for type safety
    return `${MONTHS[month as MonthKey]} ${singleDigitDay(day)}, ${year}`

}

function singleDigitDay(day: string) {
    // Return single digit for days < 10
    return day.length > 1 ? day.charAt(1) : day
}



