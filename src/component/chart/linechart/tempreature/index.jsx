import React, { useEffect } from "react";
import { Chart } from "chart.js";
import "chartjs-plugin-streaming";
import $ from "jquery";


function TemperatureChart() {
	useEffect(() => {
		const createTemperaturesLineChart = () => {
			const ctx = document
				.getElementById("engine-temperture-line-chart")
				.getContext("2d");

			const chart = new Chart(ctx, {
				type: "line",
				data: {
					datasets: [
						{
							label: "Temperture",
							borderColor: "rgba(255, 192, 0, 1.0)",
							backgroundColor: "rgba(255, 192, 0, 0.5)",
							data: [],
						},
					],
				},
				options: {
					scales: {
						xAxes: [{ type: "realtime", realtime: { delay: 2000 } }],
						yAxes: [{ ticks: { beginAtZero: true } }],
					},
					legend: {
						display: false,
					},
				},
			});
			return chart;
		};

		function refreshTemperature(chart) {
			const date = Date.now();
			chart.data.datasets[0].data.push({ x: date, y: datas[0] });
		} // 定义'自定义温度折线图'数据
		const chart = createTemperaturesLineChart();
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

		setInterval(function () {
			data();
			refreshTemperature(chart);
		}, 2000); // 延迟为2s
	}, []);

	return (
		<>
			<div className="col-md-3 col-lg-4 card">
				<h5 className="p-2">机器温度情况</h5>
				<canvas id="engine-temperture-line-chart"></canvas>
			</div>
		</>
	);
}

export default TemperatureChart;
