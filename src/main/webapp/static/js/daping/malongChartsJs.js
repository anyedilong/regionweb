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
var orgName;
$(function(){
	orgCode = $.util.getUrlParam('orgCode');
	orgName = $.util.getUrlParam('name');
	if($.util.isNull(orgCode) || $.util.isNull(orgCode)){
		orgCode = '1001001001';
		orgName = "马龙区";
	}
	$("#toptitle").text(orgName + $("#toptitle").text());
	$("#areaTile").text(orgName + $("#areaTile").text());
	//重置大小
	resizeWorldMapContainer();
	//通用ajax,设置临时cookie
	//setCookie("author", "a9211734e03d47e9a6968ddca24e9c98", '1');
	//家庭医生签约解约人次初始化
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
				            barMaxWidth: 14,
				            type:'bar',
				            stack: '签约',
				            data:data.y1List
				        },
				        {
				            name:'解约',
				            barMaxWidth: 14,
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
				            radius: ['50%', '65%'],
				            label: {
				                normal: {
				                    formatter: '{b}:{c}',
				                }
				            },
				            data:data.y1List
				        },
				        {
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
				let mapPoint = {
				    '张安屯卫生院':[103.652992,25.566239],
				    '王家庄卫生院':[103.50865,25.481593],
				    '鸡头村卫生院':[103.602888,25.487426],
				    '马过河镇卫生院':[103.402567,25.457091],
				    '中医院':[103.426311,25.421014],
				    '人民医院':[103.486311,25.411014],
				    '妇幼保健院':[103.556311,25.401014],
				    '通泉镇卫生院':[103.586311,25.441014],
				    '旧县卫生院':[103.42205,25.389873],
				    '纳章镇卫生院':[103.583383,25.312473],
				    '月望乡卫生院':[103.642774,25.335558],
				    '马鸣乡卫生院':[103.386038,25.276715],
				    '大庄乡卫生院':[103.469123,25.215055],
				    '健康管理平台':[103.486311,25.351014]
				}
				
				let convertData = function (data) {
				    let res = [];
				    for (let i = 0; i < data.length; i++) {
				        let geoCoord = mapPoint[data[i].name];
				        if (geoCoord) {
				            res.push({
				                name: data[i].name,
				                value: geoCoord.concat(data[i].value),
				                orgCode: data[i].orgCode
				            });
				        }
				    }
				    //中心待定点
				    res.push({
		                name: "健康管理平台",
		                value: [103.486311,25.351014],
		                orgCode: ""
		            });
				    return res;
				};
				
				let HFData = [ // 数据中name的城市名称必须与mapPoint中城市名称一致, 不然关联不上，合肥到各地区的线路
				    [{name: '张安屯卫生院'}, {name: '健康管理平台'}],
				    [{name: '王家庄卫生院'}, {name: '健康管理平台'}],
				    [{name: '鸡头村卫生院'}, {name: '健康管理平台'}],
				    [{name: '马过河镇卫生院'}, {name: '健康管理平台'}],
				    [{name: '中医院'}, {name: '健康管理平台'}],
				    [{name: '人民医院'}, {name: '健康管理平台'}],
				    [{name: '妇幼保健院'}, {name: '健康管理平台'}],
				    [{name: '通泉镇卫生院'}, {name: '健康管理平台'}],
				    [{name: '旧县卫生院'}, {name: '健康管理平台'}],
				    [{name: '纳章镇卫生院'}, {name: '健康管理平台'}],
				    [{name: '月望乡卫生院'}, {name: '健康管理平台'}],
				    [{name: '马鸣乡卫生院'}, {name: '健康管理平台'}],
				    [{name: '大庄乡卫生院'}, {name: '健康管理平台'}]
				];
				let convertData2 = function(data) {
				    let res = [];
				    for (let i = 0; i < data.length; i++) {
				        let dataItem = data[i];
				        let fromCoord = mapPoint[dataItem[0].name];
				        let toCoord = mapPoint[dataItem[1].name];
				        if (fromCoord && toCoord) {
				            res.push([{
				                coord: fromCoord
				            }, {
				                coord: toCoord
				            }]);
				        }
				    }
				    return res;
				};
				
				$.get('/static/map/json/citys/malong.json', function (geoJson) {
				    echarts.registerMap('QJ', geoJson);
				    mapcharts.setOption(option = {
				        tooltip: {
				            // triggerOn: 'click',
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
				                for (let i = 2; i < myseries.length; i++) {
				                    //在内部继续循环series[i],从data中判断：当地区名称等于params.name的时候就将当前数据和名称添加到res中供显示
				                    for (let k = 0; k < myseries[i].data.length; k++) {
				                        //console.log(myseries[i].data[k].name);
				                        //如果data数据中的name和地区名称一样
				                        if (myseries[i].data[k].name === params.name) {
				                            //将series数据系列每一项中的name和数据系列中当前地区的数据添加到res中
				                            res += '<i style="background: '+ myseries[i].itemStyle.normal.color +
				                                '; width: 12px;padding-top: 12px;display: inline-block; border-radius: 2px; margin-right: 10px"></i><span style="color:#01dcfc">' + myseries[i].data[k].value[2] + '</span><br />'
				                            //console.log(myseries[i].data[k].value)
				                        }
				                    }
				                }
				                if (res === '') {
				                    res = ''
				                } else {
					                res += '<div style="position: absolute;top: 0;left: 0;border: #2ff16c 1px solid;width: 12px;height: 12px; border-top-left-radius: 3px; border-bottom: none;border-right: none"></div>'
					                res += '<div style="position: absolute;top: 0;right: 0;border: #2ff16c 1px solid;width: 12px;height: 12px; border-top-right-radius: 3px; border-bottom: none;border-left: none"></div>'
					                res += '<div style="position: absolute;bottom: 0;left: 0;border: #2ff16c 1px solid;width: 12px;height: 12px; border-bottom-left-radius: 3px; border-top: none;border-right: none"></div>'
					                res += '<div style="position: absolute;bottom: 0;right: 0;border: #2ff16c 1px solid;width: 12px;height: 12px; border-bottom-right-radius: 3px; border-top: none;border-left: none"></div>'
				                }
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
				            icon: 'roundRect'
				        },
				        series: [
				        	{	//出发地信息
				                name: '健康管理平台',
				                type: 'lines',
				                zlevel: 1,
				                effect: {
				                    show: true,
				                    period: 6,
				                    trailLength: 0,
				                    symbol: 'arrow',
				                    symbolSize: 6
				                },
				                lineStyle: {
				                    normal: {
				                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				                            offset: 0,
				                            color: '#FFFFA8' // 出发
				                        }, {
				                            offset: 1,
				                            color: '#58B3CC ' // 结束 颜色
				                        }], false),
				                        width: 2,
				                        opacity: 0.4,
				                        curveness: 0.2
				                    }
				                },
				                data: convertData2(HFData)
				            }, {
				                symbolSize: 18,
				                zlevel: 100,
				                symbol: 'path://M511.3 512.2m-219 0a219 219 0 1 0 438 0 219 219 0 1 0-438 0Z,M511.3 958.8C265 958.8 64.7 758.5 64.7 512.2 64.7 266 265.1 65.6 511.3 65.6c246.3 0 446.6 200.3 446.6 446.6S757.6 958.8 511.3 958.8z m0-833.9C297.7 124.9 124 298.6 124 512.2c0 213.6 173.8 387.4 387.4 387.4 213.6 0 387.4-173.8 387.4-387.4-0.1-213.6-173.9-387.3-387.5-387.3z',
				                hoverAnimation: false,
				                label: {
				                    normal: {
				                        formatter: '{b}',
				                        position: 'bottom',
				                        show: true,
				                        color:"#32baec",
				                    },
				                    emphasis: {
				                        show: true,
				                        color:"#03d5b0",
				                    }
				                },
				                showLegendSymbol: true,
				                type: 'scatter',
				                coordinateSystem: 'geo',
				                mapType: 'QJ',
				                data: convertData(data.y1List),
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
				                symbol: 'none',
				                name: '建档人数',
				                type: 'scatter',
				                itemStyle: {
				                    normal: {
				                        label:{show:false},
				                        color: '#03d5b0'
				                    }
				                },
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
				                coordinateSystem: 'geo',
				                mapType: 'QJ',
				                data: convertData(data.y1List)
				            },
				            {
				                symbol: 'none',
				                name: '签约人数',
				                type: 'scatter',
				                itemStyle: {
				                    normal: {
				                        label:{show:false},
				                        color: '#fcbb0b'
				                    }
				                },
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
				                coordinateSystem: 'geo',
				                mapType: 'QJ',
				                data: convertData(data.y2List)
				            },
				            {
				                symbol: 'none',
				                name: '体检人次',
				                type: 'scatter',
				                itemStyle: {
				                    normal: {
				                        label:{show:false},
				                        color: '#ff17bb'
				                    }
				                },
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
				                coordinateSystem: 'geo',
				                mapType: 'QJ',
				                data: convertData(data.y3List)
				            },
				            {
				                symbol: 'none',
				                name: '核酸检验人次',
				                type: 'scatter',
				                itemStyle: {
				                    normal: {
				                        label:{show:false},
				                        color: '#188bfe'
				                    }
				                },
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
				                coordinateSystem: 'geo',
				                mapType: 'QJ',
				                data: convertData(data.y4List)
				            },
				        ],
				        geo: {
				            map: '马龙县',
				            zoom: 1.2,
				            itemStyle: {
				                normal: {
				                    areaColor: 'rgba(255,255,255,0)',
				                    borderColor: '#32baec',
				                    label:{show:true},
				                },
				                emphasis: {//鼠标移入高亮显颜色
				                    areaColor: 'none',
				                    label:{show:true}
				                }
				            },
				            label: {
				                show:true,
				                normal: {
				                    show: true,
				                    color:"none",
				                },
				                emphasis: {
				                    show: true,
				                    color:"none"
				                }
				            },
				        }
				    });
				});
				mapcharts.on('click', function (params) { 
					var countyCode = params.data.orgCode;
					if(countyCode != ""){
						if(countyCode == '1001001001090' || countyCode == '1001001001091' ||countyCode == '1001001001092'){
							//马龙的人民医院、中医院、妇幼保健院特殊处理
							let orgNameTemp = orgName;
							orgNameTemp = orgNameTemp + params.data.name + '综合管理平台';
							window.open('malongyiyuan.html?orgCode='+countyCode+'&name='+orgNameTemp);
						}else{
							let orgNameTemp = params.data.name.replace("卫生院", "") + '医疗信息综合管理平台';
							window.open('tongquan.html?orgCode='+countyCode+'&name='+orgNameTemp); 
						}
					}
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
				    barGap:'5%',
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    legend: {
				        icon: 'roundRect',
				        data:['门诊','急诊'],
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
				    xAxis:  [
				        {
				            type : 'category',
				            "axisLabel":{
				        		interval: 0
				        	},
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
				    yAxis:[
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
				            barMaxWidth: 14,
				            name: '门诊',
				            data: data.y1List,
				            type: 'bar'
				        },
				        {
				            symbolSize: 0,
				            barMaxWidth: 14,
				            name: '急诊',
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
				data =  data.data;
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

var dyXianInterval = window.setInterval(function(){
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
});