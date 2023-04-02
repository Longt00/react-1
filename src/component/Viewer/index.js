import React, { useEffect } from "react"; //引入React模块
import "./index.css"; //引入CSS样式表
import $ from "jquery"; //引入JQuery模块

let datas = []; //定义数组变量
const { Autodesk } = window; //定义Autodesk对象
var viewer; //定义viewer变量
const urn =
	"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDIyLTA3LTI1LTA4LTA3LTQ3LWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL0JDbW9kZWwuZjNk"; //定义Autodesk Forge API的URN
var options = {
	getAccessToken: function (callback) {
		fetch("http://localhost:8080/api/auth/token")
			.then((response) => response.json())
			.then((json) => {
				const auth = json.access_token;
				callback(auth, 3600);
			});
	},
}; //定义Autodesk Forge API的访问令牌选项

function NeedleData(viewer) {
	//定义一个针的数据函数，用来更新针的角度
	const needle = document.getElementById("gauge-needle");
	const $partCurrentTemperature = $("#part-current-temperature");
	const $partSelectionAlert = $("#performance-part div.alert"); // 选择3D的div
	viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, () => {
		const ids = viewer.getSelection();
		if (ids.length === 1) {
			$partCurrentTemperature.show();
			$partSelectionAlert.hide();
		} else {
			$partCurrentTemperature.hide();
			$partSelectionAlert.show();
		}
	}); // 监听选择事件
	$partCurrentTemperature.hide();
	$partSelectionAlert.show();
	setInterval(() => {
		needle.setAttribute(
			"transform",
			`rotate(${-75 + datas[1] * 1.65},120,100)`
		); //根据datas数组的第二个元素来旋转针
	}, 2000); //每2秒更新一次针的角度
}

function loadModel(urn) {
	//定义一个加载模型的函数，用来加载Autodesk Viewer需要的模型数据
	return new Promise((resolve) => {
		function onDocumentLoadSuccess(doc) {
			const node = doc.getRoot().getDefaultGeometry();
			viewer.loadDocumentNode(doc, node).then(() => {
				NeedleData(viewer); //加载完成后调用NeedleData函数，更新针的角度
				resolve();
			});
		}
		Autodesk.Viewing.Document.load("urn:" + urn, onDocumentLoadSuccess); //加载指定URN的模型数据
	});
}
function Viewer() {
    //定义一个Viewer组件，用来展示Autodesk Viewer
    useEffect(() => {
        Autodesk.Viewing.Initializer(options, () => {
            var htmlDiv = document.getElementById("forgeViewer"); //获取要展示Viewer的div
            viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, {
                extensions: ["HeatmapExtension"], //加载HeatmapExtension扩展，用来展示热力图
           
			});
            viewer.start(); //启动Viewer
            loadModel(urn); //加载模型
        });
        setInterval(() => {
            $.ajax({
                url: "http://114.119.185.166:6080/axes_app1/llz/",
                async: false,
                type: "get",
                success: function (data) {
                    datas.splice(0, 1, data[0].temperature / 100); //将从API获取的数据保存到datas数组中
                },
            }); //从API获取数据，更新datas数组
        }, 2000); //每2秒获取一次数据
    }, []); //在组件挂载后执行一次，后面的[]表示没有依赖项，只执行一次
	return (
		<>
			<div className=" offset-xl-3 col-xl-6" id="forgeViewer"></div>
		</>
	);//用于展示Autodesk Viewer的div
}

export default Viewer; //导出Viewer组件
