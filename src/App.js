import Viewer from "./component/Viewer";
import "./css/bootstrap.css";
import Head from "./component/head";
import ChartPage from "./component/chart";

function App() {
	return (
		<>
			<Head></Head>
			<Viewer></Viewer>
			<ChartPage />
		</>
	);
}

export default App;
