import React from "react";
import TemperatureChart from "./tempreature";
import HumidityChart from "./luminance";

function LineChart() {
	return (
		<>
			<div id="card-carousel" className="carousel slide">
				<div className="carousel-inner">
					<div className="row">
						<TemperatureChart />
						<HumidityChart />
					</div>
				</div>
			</div>
		</>
	);
}

export default LineChart;
