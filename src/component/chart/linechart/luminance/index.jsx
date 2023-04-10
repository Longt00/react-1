import React, { useEffect } from "react";
import Chart from "chart.js";
import "chartjs-plugin-streaming";
import $ from "jquery";

function HumidityChart() {
	useEffect(() => {
		const createHumidityChart = () => {
			const ctx = document
				.getElementById("engine-humidity-chart")
				.getContext("2d");
			Chart.defaults.global.defaultFontColor = "rgb(255,255,255)";

			const chart = new Chart(ctx, {
				type: "line",
				data: {
					datasets: [
						{
							label: "humidity",
							borderColor: "rgba(255, 192, 0, 1.0)",
							backgroundColor: "rgba(255, 192, 0, 0.5)",
							fill: 1,
							data: [],
						},
						{
							label: "standard",
							borderColor: "rgba(192, 128, 0, 1.0)",
							fill: 0,
							data: [],
						},
					],
				},
				options: {
                    events: [],
					scales: {
						xAxes: [{ type: "realtime", realtime: { delay: 2000 } }],
						yAxes: [{ ticks: { beginAtZero: true } }],
					},
					plugins: {
						filler: {
							propagate: true,
						},
					},
					legend: {
						display: false,
					},
				},
			});
			return chart;
		};
		const datas = [];
		function data() {
			$.ajax({
				url: "http://114.119.185.166:6080/axes_app1/llz/",
				async: true, //异步接受
				type: "get",
				cache: false,
				success: function (data) {
					datas.splice(0, 1, data[0].temperature / 100);
					datas.splice(1, 1, data[0].temperature / 100);
				},
			});
		}
		const chart = createHumidityChart();
		function refreshHumidityature(chart) {
			const date = Date.now();
			chart.data.datasets[0].data.push({ x: date, y: datas[1] });
		}
		setInterval(function () {
			data();
			refreshHumidityature(chart);
		}, 2000); //延迟为2s
	}, []);

	return (
		<>
			<div className="col-md-3 col-lg-4 card">
				<h5 className="p-2">环境湿度情况</h5>
				<canvas id="engine-humidity-chart" width={"150%"}></canvas>
			</div>
		</>
	);
}

export default HumidityChart;
