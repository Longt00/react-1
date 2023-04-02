"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// 定义HEATMAP_TYPES常量，只有一种模式，名称为"监控模式"
var HEATMAP_TYPES = ["监控模式"]; // 定义两个数组：datas用于存储从API获取的数据，ERROR_FREQUENCY用于存储部件的错误频率

var datas = [];
var ERROR_FREQUENCY = []; // 每隔3秒从API获取数据

setInterval(function () {
  $.ajax({
    url: "http://114.119.185.166:6080/axes_app1/llz/",
    async: false,
    type: "get",
    success: function success(data) {
      datas.splice(0, 1, data[0].temperature / 100);
    }
  });
}, 3000); // 将数据塞进ERROR_FREQUENCY数组中对应的部件

for (var i = 1; i < 1300; i++) {
  if (i == 416) {
    ERROR_FREQUENCY.push({
      id: i,
      heat: datas
    });
  }

  if (i == 430) {
    ERROR_FREQUENCY.push({
      id: i,
      heat: datas
    });
  }

  if (i == 422) {
    ERROR_FREQUENCY.push({
      id: i,
      heat: datas
    });
  }

  if (i == 410) {
    ERROR_FREQUENCY.push({
      id: i,
      heat: datas
    });
  }

  if (i == 50) {
    ERROR_FREQUENCY.push({
      id: i,
      heat: datas
    });
  }

  if (i == 392) {
    ERROR_FREQUENCY.push({
      id: i,
      heat: datas
    });
  }

  if (i == 380) {
    ERROR_FREQUENCY.push({
      id: i,
      heat: datas
    });
  }
} // 定义HeatmapExtension类，继承自Autodesk.Viewing.Extension


var HeatmapExtension =
/*#__PURE__*/
function (_Autodesk$Viewing$Ext) {
  _inherits(HeatmapExtension, _Autodesk$Viewing$Ext);

  function HeatmapExtension() {
    _classCallCheck(this, HeatmapExtension);

    return _possibleConstructorReturn(this, _getPrototypeOf(HeatmapExtension).apply(this, arguments));
  }

  _createClass(HeatmapExtension, [{
    key: "load",
    // load方法，在加载扩展时调用
    value: function load() {
      this._enabled = false; // 标记热力图是否启用，默认为false

      this._intensity = 0.5; // 颜色强度，默认为0.5

      this._type = HEATMAP_TYPES[0]; // 热力图类型，默认为"监控模式"

      return true;
    } // unload方法，在卸载扩展时调用

  }, {
    key: "unload",
    value: function unload() {
      this.viewer.toolbar.removeControl(this.toolbar);
      return true;
    } // onToolbarCreated方法，在创建工具栏时调用

  }, {
    key: "onToolbarCreated",
    value: function onToolbarCreated() {
      this._createUI(); // 创建扩展的用户界面

    } // 创建用户界面

  }, {
    key: "_createUI",
    value: function _createUI() {
      var _this = this;

      var viewer = this.viewer; // 创建热力图设置面板，并设置回调函数

      this.panel = new HeatmapPanel(viewer, viewer.container, function (change) {
        if (change.intensity) {
          _this._intensity = change.intensity;
        }

        if (change.type) {
          _this._type = change.type;
        }

        _this._applyColors(); // 应用新的颜色设置

      });
      this.panel.setVisible(false); // 默认不显示热力图设置面板
      // 创建热力图开关按钮

      this.button = new Autodesk.Viewing.UI.Button("HeatmapButton");

      this.button.onClick = function () {
        _this._enabled = !_this._enabled; // 根据热力图状态切换热力图的开关，并更新用户界面

        _this.panel.setVisible(_this._enabled);

        if (_this._enabled) {
          _this._applyColors();

          _this.button.setState(0);
        } else {
          _this._removeColors();

          _this.button.setState(1);
        }

        viewer.impl.invalidate(true, true, true);
      }; // 设置热力图开关按钮的图标和提示


      var icon = this.button.container.children[0];
      icon.classList.add("fas", "fa-fire");
      this.button.setToolTip("Heatmaps"); // 在Autodesk Viewer的工具栏中添加热力图开关按钮

      this.toolbar = viewer.toolbar.getControl("CustomToolbar") || new Autodesk.Viewing.UI.ControlGroup("CustomToolbar");
      this.toolbar.addControl(this.button);
      viewer.toolbar.addControl(this.toolbar);
    } // 应用新的颜色设置

  }, {
    key: "_applyColors",
    value: function _applyColors() {
      var viewer = this.viewer;
      var data = [];

      switch (this._type) {
        case "监控模式":
          data = ERROR_FREQUENCY; // 如果是"监控模式"，则使用ERROR_FREQUENCY数组中的数据

          break;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          var color = new THREE.Color();

          if (10 <= item.heat[0] * 100 && item.heat[0] * 100 <= 25) {
            color.setHSL(0.3, 1.0, 0.5); // 设置颜色为绿色

            viewer.setThemingColor(item.id, new THREE.Vector4(color.r, color.g, color.b, this._intensity));
          } else if (25 < item.heat[0] * 100 && item.heat[0] * 100 <= 50) {
            color.setHSL(0.15, 1.0, 0.5); // 设置颜色为黄色

            viewer.setThemingColor(item.id, new THREE.Vector4(color.r, color.g, color.b, this._intensity));
          } else {
            color.setHSL(0, 1.0, 0.5); // 设置颜色为红色

            viewer.setThemingColor(item.id, new THREE.Vector4(color.r, color.g, color.b, this._intensity));
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } // 清除所有颜色设置

  }, {
    key: "_removeColors",
    value: function _removeColors() {
      this.viewer.clearThemingColors();
    }
  }]);

  return HeatmapExtension;
}(Autodesk.Viewing.Extension); // 定义HeatmapPanel类，继承自Autodesk.Viewing.UI.DockingPanel


var HeatmapPanel =
/*#__PURE__*/
function (_Autodesk$Viewing$UI$) {
  _inherits(HeatmapPanel, _Autodesk$Viewing$UI$);

  function HeatmapPanel(viewer, container) {
    _classCallCheck(this, HeatmapPanel);

    return _possibleConstructorReturn(this, _getPrototypeOf(HeatmapPanel).call(this, container, "HeatmapPanel", "Heatmaps"));
  }

  return HeatmapPanel;
}(Autodesk.Viewing.UI.DockingPanel); // 将HeatmapExtension注册为Autodesk Viewer的扩展


Autodesk.Viewing.theExtensionManager.registerExtension("HeatmapExtension", HeatmapExtension);