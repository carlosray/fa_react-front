import moment from "moment/moment";
import {Moment} from "moment/moment";

export const parseUtcDateAtSystemOffset = (datetime: string): Moment => {
    return moment(datetime).utc().subtract(new Date().getTimezoneOffset(), 'minutes')
}