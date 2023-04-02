import logo from "../../image/Maker.png";
import "./index.css";

function Head() {
	return (
		<>
			<div id="header">
				<img className="offset-lg-1" src={logo} alt="logo" />
				<h1 style={{ color: "rgb(255,255,255)" }}>SF 五轴机床监控</h1>
			</div>
		</>
	);
}

export default Head;
