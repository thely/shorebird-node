import Chart from 'chart.js';
import { B_CHART_ID, B_POPSCALE } from './settings.js';

// function PopChart(birdData, today, colors) {
function PopChart() {
	console.log(B_CHART_ID);
	let ctx = document.getElementById(B_CHART_ID).getContext('2d');

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

	this.chart = new Chart(ctx, {
		type: 'bar',
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
				xAxes: [{
					stacked: true,
				}],
				yAxes: [{
					ticks: {
						beginAtZero: true,
						min: 0
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