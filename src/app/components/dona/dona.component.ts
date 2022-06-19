import { Component, Input, SimpleChanges  } from '@angular/core';
import { ChartData, ChartEvent, ChartType, Color } from 'chart.js';


@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent  {

  ngOnChanges(changes: SimpleChanges): void {
    this.doughnutChartData={
   
      labels: this.doughnutChartLabels,
      datasets:[{ data: this.datas, backgroundColor:this.colors}]
   
    }
   
  }
  

  @Input() title : string = "Sin titulo";
  
  @Input('labels') public doughnutChartLabels: string[] = [ 'Label1', 'Label2', 'Label3' ];
  @Input('data') public datas = [ 350, 450, 100 ];
  public colors: string[] = [
    '#6857E6','#009FEE','#F02059'
  ] 
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{ 
      data: this.datas,
      backgroundColor: this.colors 
    }]
  };
 
  public doughnutChartType: ChartType = 'doughnut';

}
