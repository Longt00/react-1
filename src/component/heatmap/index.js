/**
 在这段代码中，我们定义了一个名为`HeatmapExtension`的Autodesk Viewer扩展，用于为模型添加热力图。它包括以下功能：

1. 从服务器获取数据并更新`datas`和`ERROR_FREQUENCY`数组。
2. 创建用户界面，包括热力图开关按钮和热力图设置面板。
3. 根据不同的热力图类型和颜色设置，为模型应用颜色。
4. 切换热力图的显示和隐藏。

此外，我们还定义了一个名为`HeatmapPanel`的类，继承自`Autodesk.Viewing.UI.DockingPanel`，用于创建热力图设置面板。

最后，我们将`HeatmapExtension`注册为Autodesk Viewer的扩展，以便在Viewer中使用它。
 */
// import { Autodesk, THREE } from "window";
const { Autodesk, THREE } = window;
// 定义WatchMode数组，存放热力图类型
const WatchMode = ["监控模式"];

// 初始化数据数组
let datas = [];
const MachineData = [];

// fetchData函数，负责从服务器获取数据
const fetchData = async () => {
	try {
		// 发送请求获取数据
		const response = await fetch("http://114.119.185.166:6080/axes_app1/llz/", {
			cache: "no-store",
		});
		const data = await response.json();
		// 更新datas数组
		datas.splice(0, 1, data[0].temperature / 100);
		// 更新ERROR_FREQUENCY数组
		updateErrorFrequency();
	} catch (error) {
		console.error("Error fetching data:", error);
	} finally {
		// 每隔3秒钟调用fetchData函数获取新数据
		setTimeout(fetchData, 3000);
	}
};

// 调用fetchData函数
fetchData();

// 定义要检查的数字数组
const numbersToCheck = [416, 430, 422, 410, 50, 392, 380];

// updateErrorFrequency函数，负责更新ERROR_FREQUENCY数组
const updateErrorFrequency = () => {
	// 清空ERROR_FREQUENCY数组
	MachineData.length = 0;
	// 遍历数字1到1299，将需要检查的数字和对应的datas数据添加到ERROR_FREQUENCY数组中
	for (let i = 1; i < 1300; i++) {
		if (numbersToCheck.includes(i)) {
			MachineData.push({ id: i, heat: datas });
		}
	}
};

// 调用updateErrorFrequency函数
updateErrorFrequency();

// 定义HeatmapExtension类，继承自Autodesk.Viewing.Extension
class HeatmapExtension extends Autodesk.Viewing.Extension {
	constructor(viewer, options) {
		super(viewer, options);
		this._enabled = false;
		this._intensity = 0.5;
		this._type = WatchMode[0];
		this.panel = null;
		this.button = null;
		this.toolbar = null;
	}

	// load方法，在加载扩展时调用
	load() {
		// 为工具栏创建事件侦听器
		this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, () =>
			this.onToolbarCreated()
		);
		return true;
	}

	// unload方法，在卸载扩展时调用
	unload() {
		// 从工具栏中移除控件
		if (this.toolbar) {
			this.viewer.toolbar.removeControl(this.toolbar);
		}
		return true;
	}

	// onToolbarCreated方法，在创建工具栏时调用
	onToolbarCreated() {
		// 创建用户界面
		this.createUI();
	}

	// createUI方法，负责创建用户界面
	createUI() {
		// 创建设置面板和按钮
		this.createPanel();
		this.createButton();
	}

	// createPanel方法，负责创建热力图设置面板
	createPanel() {
		// 创建热力图设置面板，并设置回调函数
		this.panel = new HeatmapPanel(
			this.viewer,
			this.viewer.container,
			(change) => {
				if (change.intensity) {
					this._intensity = change.intensity;
				}

				if (change.type) {
					this._type = change.type;
				}
				// 应用新的颜色设置
				this.applyColors();
			}
		);
		// 默认不显示热力图设置面板
		this.panel.setVisible(false);
	}

	// createButton方法，负责创建热力图开关按钮
	createButton() {
		this.button = new Autodesk.Viewing.UI.Button("HeatmapButton");
		// 设置按钮的点击事件处理函数
		this.button.onClick = () => this.toggleHeatmap();
		// 设置热力图开关按钮的图标和提示
		const icon = this.button.container.children[0];
		icon.classList.add("fas", "fa-fire");
		this.button.setToolTip("Heatmaps");

		// 在Autodesk Viewer的工具栏中添加热力图开关按钮
		this.toolbar =
			this.viewer.toolbar.getControl("CustomToolbar") ||
			new Autodesk.Viewing.UI.ControlGroup("CustomToolbar");
		this.toolbar.addControl(this.button);
		this.viewer.toolbar.addControl(this.toolbar);
	}

	// toggleHeatmap方法，负责切换热力图的开关
	toggleHeatmap() {
		this._enabled = !this._enabled;
		// 根据热力图状态切换热力图的开关，并更新用户界面
		this.panel.setVisible(this._enabled);
		if (this._enabled) {
			this.applyColors();
			this.button.setState(0);
		} else {
			this.removeColors();
			this.button.setState(1);
		}
		// 通知Viewer重绘
		this.viewer.impl.invalidate(true, true, true);
	}

	// applyColors方法，负责应用新的颜色设置
	applyColors() {
		const viewer = this.viewer;
		// 根据热力图类型获取数据
		const data = this._type === "监控模式" ? MachineData : [];
		// 遍历数据，根据数据中的热度值设置颜色
		data.forEach((item) => {
			const color = new THREE.Color();
			const heatValue = item.heat[0] * 100;
			if (10 <= heatValue && heatValue <= 25) {
				color.setHSL(0.3, 1.0, 0.5); // 设置颜色为绿色
			} else if (25 < heatValue && heatValue <= 50) {
				color.setHSL(0.15, 1.0, 0.5); // 设置颜色为黄色
			} else {
				color.setHSL(0, 1.0, 0.5); // 设置颜色为红色
			}
			// 应用颜色设置到Viewer
			viewer.setThemingColor(
				item.id,
				new THREE.Vector4(color.r, color.g, color.b, this._intensity)
			);
		});
	}

	// removeColors方法，负责清除所有颜色设置
	removeColors() {
		this.viewer.clearThemingColors();
	}
}

// 定义HeatmapPanel类，继承自Autodesk.Viewing.UI.DockingPanel
class HeatmapPanel extends Autodesk.Viewing.UI.DockingPanel {
	constructor(viewer, container) {
		super(container, "HeatmapPanel", "Heatmaps");
	}
}

// 将HeatmapExtension注册为Autodesk Viewer的扩展
Autodesk.Viewing.theExtensionManager.registerExtension(
	"HeatmapExtension",
	HeatmapExtension
);
export default HeatmapExtension;
