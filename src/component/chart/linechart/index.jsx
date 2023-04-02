import React from "react";
import TempreatureChart from "./tempreature";
import LuminancePage from "./luminance";
function LineChart() {
	return (
		<>
			<div id="card-carousel" className="carousel slide">
				<div className="carousel-inner">
					<div className="row">
						<TempreatureChart></TempreatureChart>
						<LuminancePage></LuminancePage>
                     
					</div>
				</div>
			</div>
		</>
	);
}
export default LineChart;
