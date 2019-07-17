import Chart from 'chart.js';
import { B_CHART_ID, B_POPSCALE } from './settings.js';

// function PopChart(birdData, today, colors) {
function PopChart() {
	console.log(B_CHART_ID);
	let ctx = document.getElementById(B_CHART_ID).getContext('2d');
	let selected = {};

	this.addData = function(birdData, today, colors) {
		this.removeData();

		let birdNames = [];
		let colorListTotal = [];
		let colorListScaled = [];
		let scaled = [];
		let remaining = [];

		for (let i = 0; i < birdData.length; i++) {
			if (today[i] > 0) {
				birdNames.push(birdData[i].name);
				let len = scaled.push(Math.ceil(today[i] * B_POPSCALE));
				remaining.push(today[i] - scaled[len-1]);
				colorListTotal.push(`rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, 0.3`);
				colorListScaled.push(`rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, 1`);
				
			}
		}

		this.chart.data.labels = birdNames;
		this.chart.data.datasets[1].data = remaining;
		this.chart.data.datasets[1].backgroundColor = colorListTotal;

		this.chart.data.datasets[0].data = scaled;
		this.chart.data.datasets[0].backgroundColor = colorListScaled;
		this.chart.update();
	}

	this.removeData = function() {
		this.chart.data.labels.pop();
		this.chart.data.datasets[0].data.pop();
		this.chart.data.datasets[0].backgroundColor.pop();
		this.chart.data.datasets[1].data.pop();
		this.chart.data.datasets[1].backgroundColor.pop();
		this.chart.update();
	}

	this.getSelected = function() {
		return selected;
	}

	// function birdNamesOnly(dict, today) {
	// 	console.log("bird data passed to get bird names: ");
	// 	console.log(dict);
	// 	let l = [];
	// 	for (let i = 0; i < dict.length; i++) {
	// 		l[i] = dict[i].name;
	// 		// console.log(l[i]);
	// 	}
	// 	return l;
	// }

	// function betterColors(list, alpha) {
	// 	let l = [];
	// 	for (let i = 0; i < list.length; i++) {
	// 		if (list[i]) {
	// 			l[i] = `rgba(${list[i].r}, ${list[i].g}, ${list[i].b}, ${alpha})`;	
	// 		}
	// 	}
	// 	return l;
	// }

	function dashedBorder(chart, dataset, data, dash) {
		chart.config.data.datasets[dataset]._meta[0].data[data].draw = function() {
	        chart.chart.ctx.setLineDash(dash);
	        Chart.elements.Rectangle.prototype.draw.apply(this, arguments);
	        chart.chart.ctx.setLineDash([1,0]);
	    }
	}

	this.chart = new Chart(ctx, {
		type: 'horizontalBar',
		data: {
			// labels: birdNamesOnly(birdData),
			// labels: birdData,
			labels: [],
			datasets: [
				{
					label: 'Scaled for Viewing',
					data: [],
					backgroundColor: [],
					// backgroundColor: betterColors(colors, 0.2),
					// borderColor: betterColors(colors, 1),
					borderWidth: 1
				},
				{
					label: 'All Day',
					data: [],
					backgroundColor: [],
					borderWidth: 1
				}
			]
		},
		options: {
			responsive: false,
			maintainAspectRatio: false,
			onClick: function(event, array) {
				if (array && array.length > 0) {
					console.log(array);
					console.log(event);
					selected.previous = ('name' in selected) ? { index: selected.index, color: selected.color } : null;

					selected.name = array[0]._model.label;
					selected.index = array[0]._index;
					selected.color = array[0]._view.borderColor;

					// data.datasets[0].data[selected.index].borderColor = "rgba(0,0,0,0.5)";
					// array[0]._view.borderColor = "rgba(0,0,0,0.5)";
					if (selected.previous) {
						// data.datasets[0].data[selected.previous.index].borderColor = selected.previous.color;

					}
				}
				else {
					selected = {};
				}
			},
			tooltips: {
				mode: 'index',
				intersect: false,
				callbacks: {
					// Use the footer callback to display the sum of the items showing in the tooltip
					footer: function(tooltipItems, data) {
							var sum = 0;
							tooltipItems.forEach(function(tooltipItem) {
								sum += data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
							});
							return 'Total: ' + sum;
						},
					},
					footerFontStyle: 'normal'
			},
			// hover: {
			// 	mode: 'index',
			// 	intersect: true
			// },
			scales: {
				yAxes: [{
					display: false,
					stacked: true,
				}],
				xAxes: [{
					ticks: {
						beginAtZero: true,
						min: 0,
						// callback: function(...args) {
						//   const value = ChartJS.Ticks.formatters.logarithmic.call(this, ...args);
						//   if (value.length) {
						//     return Number(value).toLocaleString()
						//   }
						//   return value;
						// }
					},
					type: 'logarithmic',
					stacked: true
				}]
			}
		}
	});

	// this.addData(birdData, today, colors);
}

export default PopChart;