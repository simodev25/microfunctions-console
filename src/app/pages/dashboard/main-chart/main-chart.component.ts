import {Component, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {ChartComponent} from "ng-apexcharts";
import {IMainChart} from "../IChart";

import {ChartPoint} from "chart.js";
import {formateMemory} from "../../../layout/utils/pipes/memory.pipe";
import {formateCpu} from "../../../layout/utils/pipes/cpu.pipe";
import moment from "moment";

@Component({
  selector: 'main-chart',
  templateUrl: './main-chart.template.html',
  encapsulation: ViewEncapsulation.None
})
export class MainChartComponent {
  _isReceiving: boolean = false;
  _data: IMainChart;

  @ViewChild("chart", {static: true}) chart: ChartComponent;
  public chartOptions: any;

  @Input() set data(data: IMainChart) {
    this._data = data;
    if (this._data) {
      this.init();
    }
  };


  @Input() set isReceiving(state) {
    this._isReceiving = state;

  }

  get isReceiving() {
    return this._isReceiving;
  }

  private init() {
    this.chartOptions = {
      lineChartData: [

        {
          data: this._data.data,
          label: this._data.name,
          categoryPercentage: 0.9,
          barPercentage: 0.9,
        },
      ],
      lineChartLabels: this._data.categories,
      lineChartOptions: {
        responsive: true,
        scales: {
          yAxes: [
            {

              ticks: {
                callback: (value: number | string): string => {
                  if (this._data.type == 'MEMORY') {
                    return formateMemory(value);
                  } else if (this._data.type == 'CPU') {
                    return formateCpu(value)
                  } else {
                    return `${value}`;
                  }

                },
                maxTicksLimit: 6,
                fontColor: '#555555',
                fontSize: 11,
                padding: 8,
                min: 0,
                beginAtZero: true
              },
              gridLines: {
                color: '#dfdfdf',
                drawBorder: false,
                tickMarkLength: 0,
                zeroLineWidth: 0
              },
            }
          ],
          xAxes: [{

            type: "time",
            offset: true,
            gridLines: {
              display: false,
            },
            stacked: true,
            ticks: {
              callback: this.formatTimeLabels,
              autoSkip: false,
              source: "data",
              backdropColor: "white",
              fontColor: '#555555',
              fontSize: 11,
              maxRotation: 0,
              minRotation: 0
            },
            bounds: "data",
            time: {
              unit: "minute",
              displayFormats: {
                minute: "x"
              },
              parser: timestamp => moment.unix(parseInt(timestamp))
            }
          }],
        },
        tooltips: {
          callbacks: {
            label: ({datasetIndex, index}, {datasets}) => {
              const {label, data} = datasets[datasetIndex];
              const value = data[index] as ChartPoint;
              if (this._data.type == 'MEMORY') {
                return `${label}: ${formateMemory(value)}`;
              } else if (this._data.type == 'CPU') {
                return `${label}: ${formateCpu(value)}`;
              } else {
                return `${label}: ${value}`;
              }


            }
          }
        }
      },
      lineChartColors: [
        {
          borderColor: 'darkgray',
          backgroundColor: 'rgba(84,125,248,0.82)'
        },
      ],

      lineChartLegend: true,
      lineChartType: 'bar',
      lineChartPlugins: []
    };

  }

  formatTimeLabels = (timestamp: string, index: number) => {
    const label = moment(parseInt(timestamp)).format("HH:mm");
    const offset = "     ";

    if (index == 0) return offset + label;
    if (index == 60) return label + offset;

    return index % 10 == 0 ? label : "";
  };
}

