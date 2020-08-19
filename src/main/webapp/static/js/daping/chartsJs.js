let jiayichartsId = document.getElementById('jiayicharts');
let renqunchartsId = document.getElementById('renquncharts');
let lvyuechartsId = document.getElementById('lvyuecharts');
let mapchartsId = document.getElementById('mapcharts');
let jiuzhenchartsId = document.getElementById('jiuzhencharts');
let churuchartsId = document.getElementById('churucharts');
let xianquchartsId = document.getElementById('xianqucharts');
// 重置大小
function resizeWorldMapContainer () {
    let winWid =  window.innerWidth;
    let winHei =  window.innerHeight;
    jiayichartsId.style.height = (winHei - 282) * 0.32 + 'px';
    renqunchartsId.style.height = (winHei - 282) * 0.36 + 'px';
    lvyuechartsId.style.height = (winHei - 282) * 0.32 + 'px';
    mapchartsId.style.height = (winHei - 308) + 'px';
    jiuzhenchartsId.style.height = (winHei - 282) * 0.32 + 'px';
    churuchartsId.style.height = (winHei - 282) * 0.34 + 'px';
    xianquchartsId.style.height = (winHei - 282) * 0.34 + 'px';
    
    //更改页面的分辨率后，更新echarts的大小
    jiayicharts = echarts.init(document.getElementById('jiayicharts'));
    renquncharts = echarts.init(document.getElementById('renquncharts'));
    lvyuecharts = echarts.init(document.getElementById('lvyuecharts'));
    mapcharts = echarts.init(document.getElementById('mapcharts'));
    jiuzhencharts = echarts.init(document.getElementById('jiuzhencharts'));
    churucharts = echarts.init(document.getElementById('churucharts'));
    xianqucharts = echarts.init(document.getElementById('xianqucharts'));
}

var orgCode;
$(function(){
	//重置大小
	resizeWorldMapContainer();
	orgCode = $.util.getUrlParam('orgCode');
	if($.util.isNull(orgCode)){
		orgCode = '1001001';
	}
	//通用ajax,设置临时cookie
	//setCookie("author", "a9211734e03d47e9a6968ddca24e9c98", '1');
	//签约解约人次初始化
	jiayiInit();
	//人群类型占比初始化
	renqunInit();
	//履约人数初始化
	lvyueInit();
	//建档、签约、体检人数初始化
	mapchartsInit();
	//年度就诊人数初始化
	jiuzhenInit();
	//年度入/出院人次初始化
	churuInit();
	//县区医院就诊人次初始化
	xianquInit(1);
	//动态服务
	getServiceData();
});

//签约解约人次初始化
function jiayiInit(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getDoctorConNum",
        data: JSON.stringify({"orgCode" : orgCode}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				
				let jiayioption =  {
				    color: ['#0378fb', '#03d5b0'],
				    barGap:'5%',
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    legend: {
				        data:['签约','解约'],
				        textStyle: {color: '#02b3f9'},
				        x: 'right',
				        y : '3',
				        itemWidth: 12,
				        itemHeight: 12,
				        orient: 'horizontal', // 'vertical'
				        itemGap: 40,
				        padding: [0,20,0,0]
				    },
				    grid: {
						top: '25px',
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
				    xAxis : [
				        {
				            type : 'category',
							axisTick: {
								show: false
							},
				            data : data.xList,
				            axisLine: {
				                lineStyle: {
				                    type: 'solid',
				                    color: '#02b3f9',//左边线的颜色
				                    width:'1'//坐标线的宽度
				                }
				            },
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            axisLine: {
				                lineStyle: {
				                    type: 'solid',
				                    color: 'none',//左边线的颜色
				                    width:'1'//坐标线的宽度
				                }
				            },
				            axisLabel: {
				                textStyle: {
				                    color: '#02b3f9'
				                }
				            },
				            splitLine: {
				                lineStyle: {
				                    color: ['#0689bf']
				                }
				            }
				        }
				    ],
				    series : [
				        {
				            name:'签约',
				            type:'bar',
				            stack: '签约',
				            data:data.y1List
				        },
				        {
				            name:'解约',
				            type:'bar',
				            stack: '解约',
				            data:data.y2List
				        },
				    ]
				};
				// 使用刚指定的配置项和数据显示图表。
				jiayicharts.setOption(jiayioption);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}
//人群类型占比初始化
function renqunInit(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getPopTypeProp",
        data: JSON.stringify({"orgCode" : orgCode}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				let colors = ['#09e4be', '#99aafc', '#d8fc12', '#fcba0c', '#198bfe', '#7e4efc',
				    '#fb770b', '#30ef6b', '#f86bf7', '#221f9f', '#2e6111', '#4fd6f4'];
				
				let renqunoption = {
				    tooltip: {
				        trigger: 'item',
				        formatter: "{b} : {d}%  {c}人"
				    },
				    legend: {
				        textStyle: {color: '#02b3f9',fontSize: 12},
				        orient: 'vertical',
				        x: 'left', y: 'center',
				        itemWidth: 12,
				        itemHeight: 12,
				        data:data.xList,
				        padding: [0,0,0,20]
				    },
				    color: colors,
				    series: [
				        {
				            center: ['60%', '50%'],
				            type:'pie',
				            radius: [0, '54%'],
				            label: {
				                normal: {
				                    show: false,
				                }
				            },
				            data:data.y2List,
				        },
				        {
				            center: ['60%', '50%'],
				            type:'pie',
				            radius: ['65%', '80%'],
				            label: {
				                normal: {
				                    formatter: '{per|{d}%}',
				                    rich: {
				                        per: {
				                            color: '#02b3f9',
				                        }
				                    }
				                }
				            },
				            data:data.y1List
				        }
				    ]
				};
				renquncharts.setOption(renqunoption);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}

function lvyueInit(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getCompliantPersonsNum",
        data: JSON.stringify({"orgCode" : orgCode}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				
				let lvyueoption = {
				    color: ['#03d5b0', '#9b42fc'],
				    series: [
				        {
				            type:'pie',
				            radius: ['40%', '60%'],
				            label: {
				                normal: {
				                    formatter: '{b}:{c}',
				                }
				            },
				            data:data.y1List
				        },{
				            type:'pie',
				            radius: ['50%', '65%'],
				            label: {
				                normal: {
				                    formatter: '{d}%',
				                    show: false,
				                    position: 'center'
				                },
				                emphasis: {
				                    show: true,
				                    textStyle: {
				                        fontSize: '20',
				                    }
				                }
				            },
				            data:data.y1List
				        }
				    ]
				};
				lvyuecharts.setOption(lvyueoption);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}

function mapchartsInit(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getPopTypesSpread",
        data: JSON.stringify({"orgCode" : orgCode}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				$("#archiveNum").text(data.archiveNum);
				$("#signNum").text(data.signNum);
				$("#tjNum").text(data.tjNum);
				$("#nucleinNum").text(data.nucleinNum);
				let mapPoint = [
					{
						name: '会泽县',
						value: [103.452515,26.332914],
					},
					{
						name: '宣威市',
						value: [104.09869,26.194335]
					},
					{
						name: '马龙区',
						value: [103.531586,25.48505]
					},
					{
						name: '陆良县',
						value: [103.671705,25.117089]
					},
					{
						name: '沾益区',
						value: [103.829636,25.663093]
					},
					{
						name: '富源县',
						value: [104.208831,25.623021]
					},
					{
						name: '麒麟区',
						value: [103.827142,25.455841]
					},
					{
						name: '罗平县',
						value: [104.357481,24.859696]
					},
					{
						name: '师宗县',
						value: [103.967445,24.871275]
					}
				]												
				
				$.get('/static/map/json/citys/530300.json', function (geoJson) {
				    echarts.registerMap('QJ', geoJson);
				    mapcharts.setOption(option = {
				        tooltip: {
				            extraCssText: 'box-shadow: 0 0 18px #002738',
				            trigger: 'item',
				            backgroundColor: 'rgba(40,104,142,0.2)',
				            borderColor: '#27576b',
				            borderWidth: 1,
				            padding: [10, 25, 10, 10],
				            textStyle:{
				                color:'#bae9fd',
				            },
				           formatter: function(params){
								//定义一个res变量来保存最终返回的字符结果,并且先把地区名称放到里面
								// let res = params.name+'<br />';
								let res = ''
								//定义一个变量来保存series数据系列
								let myseries = option.series;
								// //循环遍历series数据系列
								for (let i = 1; i < myseries.length; i++) {
									//在内部继续循环series[i],从data中判断：当地区名称等于params.name的时候就将当前数据和名称添加到res中供显示
									for (let k = 0; k < myseries[i].data.length; k++) {
										//console.log(myseries[i].data[k].name);
										//如果data数据中的name和地区名称一样
										if (myseries[i].data[k].name === params.name) {
											//将series数据系列每一项中的name和数据系列中当前地区的数据添加到res中
											res += '<i style="background: '+ myseries[i].itemStyle.normal.color +
			                                '; width: 12px;padding-top: 12px;display: inline-block; border-radius: 2px; margin-right: 10px"></i><span style="color:#01dcfc">' + myseries[i].data[k].value + '</span><br />'
										}
									}
								}
								res += '<div style="position: absolute;top: 0;left: 0;border: #2ff16c 1px solid;width: 12px;height: 12px; border-top-left-radius: 3px; border-bottom: none;border-right: none"></div>'
				                res += '<div style="position: absolute;top: 0;right: 0;border: #2ff16c 1px solid;width: 12px;height: 12px; border-top-right-radius: 3px; border-bottom: none;border-left: none"></div>'
				                res += '<div style="position: absolute;bottom: 0;left: 0;border: #2ff16c 1px solid;width: 12px;height: 12px; border-bottom-left-radius: 3px; border-top: none;border-right: none"></div>'
				                res += '<div style="position: absolute;bottom: 0;right: 0;border: #2ff16c 1px solid;width: 12px;height: 12px; border-bottom-right-radius: 3px; border-top: none;border-left: none"></div>'
								//返回res
								return res;
				            }
				        },
				        legend: {
				            textStyle: {color: '#02b3f9',fontSize: 12},
				            orient: 'vertical',
				            x: 'left',
				            top: 40,
				            itemWidth: 12,
				            itemHeight: 12,
				            data: ['建档人数','签约人数','体检人次', '核酸检验人次'],
				        },
				        series: [
							 {
								symbolSize: 15,
								symbol: 'path://M511.3 512.2m-219 0a219 219 0 1 0 438 0 219 219 0 1 0-438 0Z,M511.3 958.8C265 958.8 64.7 758.5 64.7 512.2 64.7 266 265.1 65.6 511.3 65.6c246.3 0 446.6 200.3 446.6 446.6S757.6 958.8 511.3 958.8z m0-833.9C297.7 124.9 124 298.6 124 512.2c0 213.6 173.8 387.4 387.4 387.4 213.6 0 387.4-173.8 387.4-387.4-0.1-213.6-173.9-387.3-387.5-387.3z',
								// zoom: 1.2,
								// geoIndex: 0,
								showLegendSymbol: true,
								type: 'scatter',
								// type: 'custom',
								// type: 'effectScatter',
								coordinateSystem: 'geo',
								mapType: 'QJ',
								data: mapPoint,
								label: {
				                    normal: {
				                        formatter: '',
				                        position: 'bottom',
				                        show: true,
				                        color:"#32baec",
				                    },
				                    emphasis: {
				                        show: true,
				                        color:"#03d5b0",
				                    }
				                },
				                itemStyle: {
				                    normal: {
				                        label:{show:true},
				                        color: '#04b0f8'
				                    },
				                    emphasis: {//鼠标移入高亮显颜色
				                        color: '#31ef69',
				                        label:{show:true}
				                    }
				                },
							},
				            {
				                zoom: 1.2,
				                showLegendSymbol: false,
				                name: '建档人数',
				                type: 'map',
				                mapType: 'QJ', // 自定义扩展图表类型
				                itemStyle: {
				                    normal: {
				                        areaColor: 'rgba(255,255,255,0)',
				                        borderColor: '#32baec',
				                        label:{show:true},
				                        color: '#03d5b0'
				                    },
				                    emphasis: {//鼠标移入高亮显颜色
				                        areaColor: '#095852',
				                        label:{show:true}
				                    }
				                },
				                label: {
				                    show:true,
				                    normal: {
				                        show: true,
				                        color:"#32baec",
				                    },
				                    emphasis: {
				                        show: true,
				                        color:"#2fe869"
				                    }
				                },
				                data: data.y1List
				            },
				            {
				                showLegendSymbol: false,
				                name: '签约人数',
				                type: 'map',
				                mapType: 'QJ', // 自定义扩展图表类型
				                itemStyle: {
				                    normal: {
				                        areaColor: 'rgba(255,255,255,0)',
				                        borderColor: '#32baec',
				                        label:{show:true},
				                        color: '#fcbb0b'
				                    },
				                    emphasis: {//鼠标移入高亮显颜色
				                        // areaColor: '#2e5b6e'
				                    	areaColor: '#095852',
				                        label:{show:true}
				                    }
				                },
				                label: {
				                    show:true,
				                    normal: {
				                        show: true,
				                        color:"#32baec",
				                    },
				                    emphasis: {
				                        show: true,
				                        color:"#2fe869"

				                    }
				                },
				                data: data.y2List
				            },
				            {
				                showLegendSymbol: false,
				                name: '体检人次',
				                type: 'map',
				                mapType: 'QJ', // 自定义扩展图表类型
				                itemStyle: {
				                    normal: {
				                        areaColor: 'rgba(255,255,255,0)',
				                        borderColor: '#32baec',
				                        label:{show:true},
				                        color: '#ff17bb'
				                    },
				                    emphasis: {//鼠标移入高亮显颜色
				                        // areaColor: '#2e5b6e'
				                    	areaColor: '#095852',
				                        label:{show:true}
				                    }
				                },
				                label: {
				                    show:true,
				                    normal: {
				                        show: true,
				                        color:"#32baec",
				                    },
				                    emphasis: {
				                        show: true,
				                        color:"#2fe869"

				                    }
				                },
				                data: data.y3List
				            },
				            {
				                showLegendSymbol: false,
				                name: '核酸检验人次',
				                type: 'map',
				                mapType: 'QJ', // 自定义扩展图表类型
				                itemStyle: {
				                    normal: {
				                        areaColor: 'rgba(255,255,255,0)',
				                        borderColor: '#32baec',
				                        label:{show:true},
				                        color: '#188bfe'
				                    },
				                    emphasis: {//鼠标移入高亮显颜色
				                        // areaColor: '#2e5b6e'
				                        // areaColor: 'rgba(255,255,0,0.1)',
				                        areaColor: '#095852',
				                        label:{show:true}
				                    }
				                },
				                label: {
				                    show:true,
				                    normal: {
				                        show: true,
				                        color:"#32baec",
				                    },
				                    emphasis: {
				                        show: true,
				                        // color:"#32baec"
				                        color:"#2fe869"
				                    }
				                },
				                data: data.y4List
				            },
				        ],
						geo: {
							map: '曲靖市',
							zoom: 1.2,
							itemStyle: {
								normal: {
									areaColor: 'rgba(255,255,255,0)',
									borderColor: '#32baec',
									label:{show:true},
								},
								emphasis: {//鼠标移入高亮显颜色
									// areaColor: '#2e5b6e'
									areaColor: '#095852',
									label:{show:true}
								}
							},
							label: {
								show:true,
								normal: {
									show: true,
									color:"#32baec",
								},
								emphasis: {
									show: true,
									color:"#32baec"
								}
							},
						}
				    });
				});
				mapcharts.on('click', function (params) { 
					var orgName = params.data.name;
					var countyCode = params.data.orgCode;
					window.open('malong.html?orgCode='+countyCode+'&name='+orgName); 
			    });
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}

function jiuzhenInit(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getAnnualVisits",
        data: JSON.stringify({"orgCode" : orgCode}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				
				let jiuzhenoption = {
				    color: ['#01d5af', '#fcba0c'],
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    legend: {
				        icon: 'roundRect',
				        data:['门诊','住院'],
				        textStyle: {color: '#02b3f9'},
				        x: 'right',
				        y : '3',
				        itemWidth: 12,
				        itemHeight: 12,
				        orient: 'horizontal', // 'vertical'
				        itemGap: 40,
				        padding: [0,20,0,0]
				    },
				    grid: {
				        top: '25px',
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
				    },
				    xAxis:[
				        {
				            type : 'category',
				            boundaryGap: false,
				            axisTick: {
				                show: false
				            },
				            data : data.xList,
				            axisLine: {
				                lineStyle: {
				                    type: 'solid',
				                    color: '#02b3f9',//左边线的颜色
				                    width:'1'//坐标线的宽度
				                }
				            },
				        }
				    ],
				    yAxis:  [
				        {
				            type : 'value',
				            axisLine: {
				                lineStyle: {
				                    type: 'solid',
				                    color: 'none',//左边线的颜色
				                    width:'1'//坐标线的宽度
				                }
				            },
				            axisLabel: {
				                textStyle: {
				                    color: '#02b3f9'
				                }
				            },
				            splitLine: {
				                lineStyle: {
				                    color: ['#0689bf']
				                }

				            }
				        }
				    ],
				    series: [
				        {
				            symbolSize: 0,
				            name: '门诊',
				            data: data.y1List,
				            type: 'line',
				            smooth: true,
				            areaStyle: {}
				        },
				        {
				            symbolSize: 0,
				            name: '住院',
				            data: data.y2List,
				            type: 'line',
				            smooth: true,
				        }
				    ]
				};
				jiuzhencharts.setOption(jiuzhenoption);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}

function churuInit(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getInOrOutHospitalVisits",
        data: JSON.stringify({"orgCode" : orgCode}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				
				let churuoption = {
				    color: ['#ff18bc', '#04d6b1'],
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    legend: {
				        icon: 'roundRect',
				        data:['入院','出院'],
				        textStyle: {color: '#02b3f9'},
				        x: 'right',
				        y : '3',
				        itemWidth: 12,
				        itemHeight: 12,
				        orient: 'horizontal', // 'vertical'
				        itemGap: 40,
				        padding: [0,20,0,0]
				    },
				    grid: {
				        top: '25px',
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
				    },
				    xAxis:[
				        {
				            type : 'category',
							axisTick: {
								show: false
							},
				            data : data.xList,
				            axisLine: {
				                lineStyle: {
				                    type: 'solid',
				                    color: '#02b3f9',//左边线的颜色
				                    width:'1'//坐标线的宽度
				                }
				            },
				        }
				    ],
				    yAxis:  [
				        {
				            type : 'value',
				            axisLine: {
				                lineStyle: {
				                    type: 'solid',
				                    color: 'none',//左边线的颜色
				                    width:'1'//坐标线的宽度
				                }
				            },
				            axisLabel: {
				                textStyle: {
				                    color: '#02b3f9'
				                }
				            },
				            splitLine: {
				                lineStyle: {
				                    color: ['#0689bf']
				                }
				            }
				        }
				    ],
				    series: [
				        {
				            name: '入院',
				            data:  data.y1List,
				            type: 'line',
				            symbol: 'circle',
				            itemStyle : {
				                normal : {
				                    color:'#ff18bc',
				                    lineStyle:{
				                        color:'#ff18bc'
				                    }
				                }
				            },
				        },
				        {
				            name: '出院',
				            data: data.y2List,
				            type: 'line',
				            symbol: 'circle',
				            itemStyle : {
				                normal : {
				                    color:'#04d6b1',
				                    lineStyle:{
				                        color:'#04d6b1'
				                    }
				                }
				            },
				        }
				    ]
				};
				churucharts.setOption(churuoption);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}

function xianquInit(type){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getHospitalVisits",
        data: JSON.stringify({"orgCode" : orgCode, "type" : type}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				
				let xianquoption = {
				    color: ['#01d5af', '#fcba0c'],
				    barGap:'1%',
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    legend: {
				        icon: 'roundRect',
				        data:['门诊','住院'],
				        textStyle: {color: '#02b3f9'},
				        x: 'right',
				        y : '3',
				        itemWidth: 12,
				        itemHeight: 12,
				        orient: 'horizontal', // 'vertical'
				        itemGap: 40,
				        padding: [0,20,0,0]
				    },
				    grid: {
				        top: '25px',
						left: '3%',
						right: '4%',
						bottom: '0',
						containLabel: true
				    },
				    xAxis:[
				        {
				            type : 'value',
				            axisLine: {
				                lineStyle: {
				                    type: 'solid',
				                    color: '#02b3f9',//左边线的颜色
				                    width:'1'//坐标线的宽度
				                }
				            },
				            splitLine: {
				                lineStyle: {
				                    color: ['#0689bf']
				                }
				            }
				        }
				    ],
				    yAxis:  [
				        {
				            type : 'category',
				            data : data.xList,
				            axisLine: {
				                lineStyle: {
				                    type: 'solid',
				                    color: 'none',//左边线的颜色
				                    width:'1'//坐标线的宽度
				                }
				            },
				            axisLabel: {
				                interval: 0,
				                textStyle: {
				                    color: '#02b3f9'
				                }
				            },
				        }
				    ],
				    series: [
				        {
				            symbolSize: 0,
				            name: '门诊',
				            data: data.y1List,
				            type: 'bar'
				        },
				        {
				            symbolSize: 0,
				            name: '住院',
				            data: data.y2List,
				            type: 'bar'
				        }
				    ]
				};
				xianqucharts.setOption(xianquoption);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}

function getServiceData(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getServiceData",
        data: JSON.stringify({"orgCode" : orgCode}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data = data.data;
				$("#scrollCont").html('');
				var serviceStr = '';
				for(var i = 0; i < 2; i++){
					for(var j = 0; j < data.length; j++){
						serviceStr += '<span class="serviceLi txt">' + data[j]+ '</span>';
					}
				}
				$("#scrollCont").append(serviceStr);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}

var dyShiInterval = window.setInterval(function(){
	getServiceData();
}, 1000*60*60*4);

window.addEventListener('resize',function() {
    resizeWorldMapContainer();
    jiayicharts.resize();
    renquncharts.resize();
    lvyuecharts.resize();
    mapcharts.resize();
    jiuzhencharts.resize();
    churucharts.resize();
    xianqucharts.resize();
})