import React from "react";

function Needle() {
	return (
		<>
			<div id="performance-part">
				<div className="alert alert-secondary">选择一个部件</div>
			</div>
			<h5>当前温度</h5>
			<svg id="part-current-temperature" width="500px" height="250px">
				<defs>
					<mask id="gauge-mask">
						<circle fill="white" cx="125" cy="100" r="75"></circle>
						<circle fill="black" cx="125" cy="100" r="50"></circle>
					</mask>
				</defs>
				<polygon
					points="125,100 0,100 0,0"
					fill="green"
					mask="url(#gauge-mask)"
				></polygon>
				<polygon
					points="125,100 0,0 250,0"
					fill="orange"
					mask="url(#gauge-mask)"
				></polygon>
				<polygon
					points="125,100 250,0 250,100"
					fill="red"
					mask="url(#gauge-mask)"
				></polygon>
				<text fill="gray" x={"25"} y={"100"}>
					0°
				</text>
				<text fill="gray" x={"40"} y={"50"}>
					25°
				</text>
				<text fill="gray" x={"190"} y={"50"}>
					75°
				</text>
				<text fill="gray" x={"210"} y={"100"}>
					100°
				</text>

				<polygon
					id="gauge-needle"
					points="125,105 120,100 100,25 130,100"
					fill="black"
					transform="rotate(-30,125,125)"
				></polygon>
			</svg>
		</>
	);
}

export default Needle;
