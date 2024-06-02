import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../statistics.service';
import { ChartData } from 'chart.js';
import { LinksService } from 'src/app/links/links.service';
import { LinkParams } from 'src/app/links/models/links';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  statistics = {};
  pieChartData: ChartData = {
    datasets: []
  }
  pieChartData2: ChartData = {
    datasets: []
  }
  linkParams: LinkParams = new LinkParams;

  constructor(private statisticsService: StatisticsService, public linksService: LinksService){
    this.linkParams = new LinkParams();
  }

  pieChartOption = {
    responsive: false
  }

  ngOnInit(): void {
    this.statisticsService.getStatistics().subscribe({
      next: data => {
        this.pieChartData = {
          labels: [
            'Links Expiring In An Hour',
            'Links Expiring In 24 Hours',
            'Links Expiring In A Week',
            'Links Expiring In A Month',
            'Links Expiring In Three Months',
            'Links Expiring In Six Months'
          ],
          datasets: [
            {
              data: [
                data.linksExpiringInAHourCount,
                data.linksExpiringInA24HoursCount,
                data.linksExpiringInAWeekCount,
                data.linksExpiringInAMonthCount,
                data.linksExpiringInThreeMonthCount,
                data.linksExpiringInSixMonthCount
              ],
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(199, 199, 199, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
              ]
            }
          ]
        };
        this.pieChartData2 = {
          labels: [
            'Active Links',
            'Expired Links',
          ],
          datasets: [
            {
              data: [
                data.activeLinksCount,
                data.expiredLinksCount,
              ],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',

              ]
            }
          ]
        };
      }
    }); 
    this.linksService.loadPersonalLinks(this.linkParams).subscribe({
      next: (result) => {
        this.linksService.setPersonalLinks(result)
      }
    })
  } 
}