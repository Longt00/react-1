import React from "react";
import { Tab, Tabs } from "react-bootstrap";

import LineChart from "./linechart";
import Needle from "./needle";

function ChartPage() {
	return (
		<>
			<div id="sidebar">
				<div
					id="sidebar-pills-content"
					className="tab-content col-lg-10 offset-lg-1"
				>
					<Tabs>
						<Tab eventKey="watch" title="总览">
							<LineChart></LineChart>
						</Tab>

						<Tab eventKey="part" title="部件">
							<Needle></Needle>
						</Tab>
					</Tabs>
				</div>
			</div>
		</>
	);
}
export default ChartPage;
