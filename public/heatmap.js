// 定义HEATMAP_TYPES常量，只有一种模式，名称为"监控模式"
const HEATMAP_TYPES = ["监控模式"];

// 定义两个数组：datas用于存储从API获取的数据，ERROR_FREQUENCY用于存储部件的错误频率
let datas = [];
const ERROR_FREQUENCY = [];

// 每隔3秒从API获取数据
setInterval(() => {
	$.ajax({
		url: "http://114.119.185.166:6080/axes_app1/llz/",
		async: false,
		type: "get",
		success: function (data) {
			datas.splice(0, 1, data[0].temperature / 100);
		},
	});
}, 3000);

// 将数据塞进ERROR_FREQUENCY数组中对应的部件
for (let i = 1; i < 1300; i++) {
	if (i == 416) {
		ERROR_FREQUENCY.push({ id: i, heat: datas });
	}
	if (i == 430) {
		ERROR_FREQUENCY.push({ id: i, heat: datas });
	}
	if (i == 422) {
		ERROR_FREQUENCY.push({ id: i, heat: datas });
	}
	if (i == 410) {
		ERROR_FREQUENCY.push({ id: i, heat: datas });
	}
	if (i == 50) {
		ERROR_FREQUENCY.push({ id: i, heat: datas });
	}
	if (i == 392) {
		ERROR_FREQUENCY.push({ id: i, heat: datas });
	}
	if (i == 380) {
		ERROR_FREQUENCY.push({ id: i, heat: datas });
	}
}

// 定义HeatmapExtension类，继承自Autodesk.Viewing.Extension
class HeatmapExtension extends Autodesk.Viewing.Extension {
	// load方法，在加载扩展时调用
	load() {
		this._enabled = false; // 标记热力图是否启用，默认为false
		this._intensity = 0.5; // 颜色强度，默认为0.5
		this._type = HEATMAP_TYPES[0]; // 热力图类型，默认为"监控模式"
		return true;
	}
	// unload方法，在卸载扩展时调用
	unload() {
		this.viewer.toolbar.removeControl(this.toolbar);
		return true;
	}

	// onToolbarCreated方法，在创建工具栏时调用
	onToolbarCreated() {
		this._createUI(); // 创建扩展的用户界面
	}

	// 创建用户界面
	_createUI() {
		const viewer = this.viewer;

		// 创建热力图设置面板，并设置回调函数
		this.panel = new HeatmapPanel(viewer, viewer.container, (change) => {
			if (change.intensity) {
				this._intensity = change.intensity;
			}
			if (change.type) {
				this._type = change.type;
			}
			this._applyColors(); // 应用新的颜色设置
		});
		this.panel.setVisible(false); // 默认不显示热力图设置面板

		// 创建热力图开关按钮
		this.button = new Autodesk.Viewing.UI.Button("HeatmapButton");
		this.button.onClick = () => {
			this._enabled = !this._enabled;
			// 根据热力图状态切换热力图的开关，并更新用户界面
			this.panel.setVisible(this._enabled);
			if (this._enabled) {
				this._applyColors();
				this.button.setState(0);
			} else {
				this._removeColors();
				this.button.setState(1);
			}
			viewer.impl.invalidate(true, true, true);
		};
		// 设置热力图开关按钮的图标和提示
		const icon = this.button.container.children[0];
		icon.classList.add("fas", "fa-fire");
		this.button.setToolTip("Heatmaps");

		// 在Autodesk Viewer的工具栏中添加热力图开关按钮
		this.toolbar =
			viewer.toolbar.getControl("CustomToolbar") ||
			new Autodesk.Viewing.UI.ControlGroup("CustomToolbar");
		this.toolbar.addControl(this.button);
		viewer.toolbar.addControl(this.toolbar);
	}

	// 应用新的颜色设置
	_applyColors() {
		const viewer = this.viewer;
		let data = [];
		switch (this._type) {
			case "监控模式":
				data = ERROR_FREQUENCY; // 如果是"监控模式"，则使用ERROR_FREQUENCY数组中的数据
				break;
		}
		for (const item of data) {
			const color = new THREE.Color();
			if (10 <= item.heat[0] * 100 && item.heat[0] * 100 <= 25) {
				color.setHSL(0.3, 1.0, 0.5); // 设置颜色为绿色
				viewer.setThemingColor(
					item.id,
					new THREE.Vector4(color.r, color.g, color.b, this._intensity)
				);
			} else if (25 < item.heat[0] * 100 && item.heat[0] * 100 <= 50) {
				color.setHSL(0.15, 1.0, 0.5); // 设置颜色为黄色
				viewer.setThemingColor(
					item.id,
					new THREE.Vector4(color.r, color.g, color.b, this._intensity)
				);
			} else {
				color.setHSL(0, 1.0, 0.5); // 设置颜色为红色
				viewer.setThemingColor(
					item.id,
					new THREE.Vector4(color.r, color.g, color.b, this._intensity)
				);
			}
		}
	}

	// 清除所有颜色设置
	_removeColors() {
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
