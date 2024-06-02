export interface Statistics {
    allLinksCount: number,
    activeLinksCount: number,
    expiredLinksCount: number,
    linksExpiringInAHourCount: number,
    linksExpiringInA24HoursCount: number,
    linksExpiringInAWeekCount: number,
    linksExpiringInAMonthCount: number,
    linksExpiringInThreeMonthCount: number,
    linksExpiringInSixMonthCount: number,
}

export interface ChartData {
    labels: string[];
    datasets: Dataset;
}

interface Dataset {
    data: number[];
    backgroundColor: string[];
}