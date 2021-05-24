export interface MonthTracker {
    years: Object;
    current?: Date;
}
export declare const monthTracker: MonthTracker;
export declare const months: string[];
export declare const days: string[];
export declare function scrapeMonth(date: Date): {
    date: Date;
    month: undefined;
};
export declare function scrapePreviousMonth(): {
    date: Date;
    month: undefined;
};
export declare function scrapeNextMonth(): {
    date: Date;
    month: undefined;
};
export declare function getDisplayDate(_date: any): string;
export declare function formatTimeFromInputElement(input: string): string;
