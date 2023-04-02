import React from "react";

function LuminancePage() {
	return (
		<>
			<div className="col-md-3 col-lg-4 card">
				<h5 className="p-2">环境湿度情况</h5>
				<canvas id="engine-humidity-chart" width={"150%"}></canvas>
			</div>
		</>
	);
}
export default LuminancePage
