import React from "react";
function TempreatureChart() {
	return (
		<>
			<div className="col-md-3 col-lg-4 card">
				<h5 className="p-2">机器温度情况</h5>
				<canvas id="engine-temperture-line-chart" width={"100%"}></canvas>
			</div>
		</>
	);
}
export default TempreatureChart;
