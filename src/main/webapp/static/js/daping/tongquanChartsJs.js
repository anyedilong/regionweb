let jiandangmeiguiId = document.getElementById('jiandangmeigui');
let jiandangbarId = document.getElementById('jiandangbar');
let jiayimeiguiboxId = document.getElementById('jiayimeiguibox');
let jiayimeiguiId = document.getElementById('jiayimeigui');
let jiayibarId = document.getElementById('jiayibar');
let nianduzongshouruId = document.getElementById('nianduzongshouru');
let yibaoshouruId = document.getElementById('yibaoshouru');
let suifangbarId = document.getElementById('suifangbar');
let suifangyuanhuanId = document.getElementById('suifangyuanhuan');
let jiuzhenbarId = document.getElementById('jiuzhenbar');
let jiuzhenyuanhuanId = document.getElementById('jiuzhenyuanhuan');
let shourulineId = document.getElementById('shouruline');
let benyuemeiguiId = document.getElementById('benyuemeigui');
let benyuemeiguiBoxId = document.getElementById('benyuemeiguiBox');
// 重置大小
function resizeWorldMapContainer () {
    let winWid =  window.innerWidth;
    let winHei =  window.innerHeight;
    // left
    jiandangmeiguiId.style.height = (winHei - 282 -140) * 0.32 + 'px';
    jiandangbarId.style.height = (winHei - 282 -140) * 0.32 + 'px';
    jiayimeiguiboxId.style.height = (winHei - 282 -140) * 0.36 + 'px';
    jiayimeiguiId.style.height = jiayimeiguiboxId.clientHeight - 60 + 'px'
    jiayibarId.style.height = (winHei - 282 -140) * 0.36 + 'px';
    nianduzongshouruId.style.height = (winHei - 282 -140) * 0.32 + 'px';
    yibaoshouruId.style.height = (winHei - 282 -140) * 0.32 + 'px';
    // right
    suifangbarId.style.height = (winHei - 282 -140) * 0.32 + 'px';
    suifangyuanhuanId.style.height = (winHei - 282 -140) * 0.32 + 'px';
    jiuzhenbarId.style.height = (winHei - 282 -140) * 0.36 + 'px';
    jiuzhenyuanhuanId.style.height = (winHei - 282 -140) * 0.36 + 'px';
    shourulineId.style.height = (winHei - 282 -140) * 0.32 + 'px';
    benyuemeiguiBoxId.style.height = (winHei - 282 -140) * 0.32 + 'px';
    benyuemeiguiId.style.height = (winHei - 282 -140) * 0.32 + 'px';
    //更改页面的分辨率后，更新echarts的大小
    jiandangmeigui =  echarts.init(document.getElementById('jiandangmeigui'));
    jiandangbar = echarts.init(document.getElementById('jiandangbar'));
    jiayimeigui = echarts.init(document.getElementById('jiayimeigui'));
    jiayibar = echarts.init(document.getElementById('jiayibar'));
    nianduzongshouru = echarts.init(document.getElementById('nianduzongshouru'));
    yibaoshouru = echarts.init(document.getElementById('yibaoshouru'));
    suifangbar = echarts.init(document.getElementById('suifangbar'));
    suifangyuanhuan = echarts.init(document.getElementById('suifangyuanhuan'));
    jiuzhenbar = echarts.init(document.getElementById('jiuzhenbar'));
    jiuzhenyuanhuan = echarts.init(document.getElementById('jiuzhenyuanhuan'));
    shouruline = echarts.init(document.getElementById('shouruline'));
    benyuemeigui = echarts.init(document.getElementById('benyuemeigui'));
}

var orgCode;
$(function(){
	//重置大小
	resizeWorldMapContainer();
	orgCode = $.util.getUrlParam('orgCode');
	orgName = $.util.getUrlParam('name');
	if($.util.isNull(orgCode) || $.util.isNull(orgCode)){
		orgCode = '1001001001002';
		orgName = "通泉镇医疗信息综合管理平台";
	}
	$("#toptitle").text(orgName);
	$("#areaTile").text(orgName);
	//通用ajax,设置临时cookie
	//setCookie("author", "a9211734e03d47e9a6968ddca24e9c98", '1');
	//统计某地区的各类人数
	peopNumStats();
	//年度建档人群占比
	jiandangrenqun();
	//年度随访人次
	suifangrenci();
	//家庭医生签约
	yishengqianyue();
	//年度就诊人次
	jiuzhenrenci();
	//年度总收入、科室排名、收入对比、本月收入
	incomeProp();
	//动态服务
	getServiceData();
})

function peopNumStats(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/peopNumStats",
        data: JSON.stringify({"orgCode" : orgCode, "typeFlg" : "1"}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				//年度档案人数
				$("#archiveNum").text(data.archiveNum);
				//年度签约人数
				$("#signNum").text(data.signNum);
				//年度体检人数
				$("#checkNum").text(data.checkNum);
				//当前贫困人数
				$("#poorNum").text(data.poorNum);
				//签约人数
				$("#signNum1").text(data.signNum);
				//解约签约人数
				$("#unsignNum").text(data.unsignNum);
				//到期签约人数
				$("#outsignNum").text(data.outsignNum);
				//新冠检验人次
				$("#nucleinNum").text(data.nucleinNum);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}

function jiandangrenqun(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getWSYPopTypeProp",
        data: JSON.stringify({"orgCode" : orgCode}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data = data.data;
				let renqunpie = data.pie;
				let renqunbar = data.bar;
				
				let jiandangmeiguiopt = {
				    tooltip : {
				        trigger: 'item',
				        formatter: "{b} : {d}%"
				    },
				    color:['#0ce4bd','#9b42fc','#d7fb13','#1b8afd'],
				    legend: {
				        textStyle: {color: '#02b3f9',fontSize: 12},
				        orient: 'vertical',
				        x: 'left', y: 'bottom',
				        itemWidth: 12,
				        itemHeight: 12,
				        data: renqunpie.xList
				    },
				    // calculable : true,
				    series : [
				        {
				            type:'pie',
				            radius : [15, 60],
				            center : ['60%', '50%'],
				            roseType : 'area',
				            label: {
				                normal: {
				                    formatter: '{per|{c}人}',
				                    rich: {
				                        per: {
				                            color: '#02b3f9',
				                        }
				                    }
				                }
				            },
				            data:renqunpie.y1List
				        }
				    ]
				}
				jiandangmeigui.setOption(jiandangmeiguiopt);

				let jiandangbaropt =  {
				    color: '#03d5b0',
				    barGap:'5%',
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
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
				            data : renqunbar.xList,
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
				            barMaxWidth: 24,
				            type:'bar',
				            data: renqunbar.y1List
				        },
				    ]
				};
				// 使用刚指定的配置项和数据显示图表。
				jiandangbar.setOption(jiandangbaropt);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
};

//年度随访人次
function suifangrenci(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getWSYFollowPropNum",
        data: JSON.stringify({"orgCode" : orgCode}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				let pie = data.pie;
				let bar = data.bar;
				
				let suifangbaropt =  {
				    color: '#198bfe',
				    barGap:'5%',
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    legend: {
				        textStyle: {color: '#02b3f9'},
				        x: 'right',
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
				            "axisLabel":{
				        		interval: 0
				        	},
				            axisTick: {
				                show: false
				            },
				            data : bar.xList,
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
				            //interval: 300,
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
				            barMaxWidth: 24,
				            type:'bar',
				            data: bar.y1List
				        },
				    ]
				};
				suifangbar.setOption(suifangbaropt);

				let suifangyuanhuanopt =  {
				    color: ['#188dfe', '#fdb90c'],
				    legend: {
				        textStyle: {color: '#02b3f9',fontSize: 12},
				        x: 'right',
				        itemWidth: 12,
				        itemHeight: 12,
				        data: pie.xList,
				        padding: [0,0,0,20]
				    },
				    series: [
				        {
				            type:'pie',
				            radius: ['40%', '65%'],
				            label: {
				                normal: {
				                    formatter: '{b}{c}\n\n',
				                    borderWidth: 20,
				                    borderRadius: 4,
				                    padding: [0, -20],
				                    rich: {
				                        a: {
				                            color: '#333',
				                            fontSize: 12,
				                            lineHeight: 20
				                        },
				                        b: {
				                            fontSize: 12,
				                            lineHeight: 20,
				                            color: '#333'
				                        }
				                    }
				                }
				            },
				            data: pie.y1List
				        },
				        {
				            type:'pie',
				            radius: ['40%', '65%'],
				            label: {
				                normal: {
				                    formatter: '{d}%',
				                    show: false,
				                    position: 'center'
				                },
				                emphasis: {
				                    show: true,
				                    textStyle: {
				                        fontSize: '14',
				                    }
				                }
				            },
				            data: pie.y1List
				        }
				    ]
				};
				suifangyuanhuan.setOption(suifangyuanhuanopt);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
};
//家庭医生签约
function yishengqianyue(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getWSYDoctorSign",
        data: JSON.stringify({"orgCode" : orgCode}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				let jiayisignpie = data.pie;
				let jiayisignbar = data.bar;
				
				let jiayimeiguiopt = {
				    tooltip : {
				        trigger: 'item',
				        formatter: "{b} : {d}%"
				    },
				    color:['#0ce4bd','#9b42fc','#1b8afd'],
				    // calculable : true,
				    series : [
				        {
				            type:'pie',
				            radius : [10, 40],
				            center : ['50%', '55%'],
				            roseType : 'radius',
				            x: '50%',
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
				            data:jiayisignpie
				        }
				    ]
				};
				jiayimeigui.setOption(jiayimeiguiopt);

				let jiayibaropt =  {
				    color: ['#07e4bb', '#9943fc', '#d7fb11'],
				    barGap:'5%',
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    legend: {
				        data:['签约','解约','到期'],
				        textStyle: {color: '#02b3f9'},
				        x: 'right',
				        y: '3',
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
				            data : jiayisignbar.xList,
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
				            data: jiayisignbar.y1List
				        },
				        {
				            name:'解约',
				            barMaxWidth: 14,
				            type:'bar',
				            stack: '解约',
				            data: jiayisignbar.y2List
				        },
				        {
				            name:'到期',
				            barMaxWidth: 14,
				            type:'bar',
				            stack: '到期',
				            data: jiayisignbar.y3List
				        },
				    ]
				};
				// 使用刚指定的配置项和数据显示图表。
				jiayibar.setOption(jiayibaropt);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
};
//年度就诊人次
function jiuzhenrenci(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getWSYHospitalNum",
        data: JSON.stringify({"orgCode" : orgCode}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				let jiuzhenpie = data.pie;
				let jiuzhenline = data.line;
				
				let jiuzhenbaropt = {
				    color: ['#04d4b0', '#198cff', '#fbb90b'],
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    // legend: {
				    //     icon: 'roundRect',
				    //     data:['门诊','急诊'],
				    //     textStyle: {color: '#02b3f9'},
				    //     x: 'right',
				    //     itemWidth: 12,
			        //     itemHeight: 12,
				    //     orient: 'horizontal', // 'vertical'
				    //     itemGap: 40,
				    //     padding: [0,20,0,0]
				    // },
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
				            data : jiuzhenline.xList,
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
				            data:  jiuzhenline.y1List,
				            type: 'line',
				            smooth: true,
				            areaStyle: {
				                // color: ['rgba(3,213,176,0.5)']
				                opacity:0.2
				            }
				        },
				        {
				            symbolSize: 0,
				            name: '住院',
				            data: jiuzhenline.y2List,
				            type: 'line',
				            smooth: true,
				        },
				        {
				            symbolSize: 0,
				            name: '检验',
				            data: jiuzhenline.y3List,
				            type: 'line',
				            smooth: true,
				        }
				    ]
				};
				jiuzhenbar.setOption(jiuzhenbaropt);

				let jiuzhenyuanhuanopt = {
				    color: ['#04d4b0', '#198cff', '#fbb90b'],
				    legend: {
				        textStyle: {color: '#02b3f9',fontSize: 12},
				        x: 'right',
				        y: '3',
				        // x: 'left', y: 'top',
				        itemWidth: 12,
				        itemHeight: 12,
				        data:['门诊','住院','检验'],
				        padding: [0,0,0,20]
				    },
				    graphic: [{ //环形图中间添加文字
				        type: 'text', //通过不同top值可以设置上下显示
				        left: 'center',
				        top: '55%',
				        style: {
				            text: '本月就诊\n人次',
				            textAlign: 'center',
				            fill: '#dfeef3', //文字的颜色
				            width: 30,
				            height: 30,
				            fontSize: 14,
				            fontFamily: "Microsoft YaHei"
				        }
				    }],
				    series: [
				        {
				            type:'pie',
				            radius: ['30%', '55%'],
				            center : ['50%', '60%'],
				            label: {
				                normal: {
				                    formatter: '{b}{c}\n',
				                    borderWidth: 20,
				                    borderRadius: 4,
				                    padding: [0, -20],
				                    rich: {
				                        a: {
				                            color: '#333',
				                            fontSize: 12,
				                            lineHeight: 20
				                        },
				                        b: {
				                            fontSize: 12,
				                            lineHeight: 20,
				                            color: '#333'
				                        }
				                    }
				                }
				            },
				            data: jiuzhenpie
				        }
				    ]
				};
				jiuzhenyuanhuan.setOption(jiuzhenyuanhuanopt);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
};
//年度总收入、医保收入、收入对比、本月收入
function incomeProp(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getWSYOtherData",
        data: JSON.stringify({"orgCode" : orgCode}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				let sumIncome = data.sumIncome;
				let medicatIncome = data.medicatIncome;
				let income = data.income;
				let curIncome = data.curIncome;
				
				let nianduzongshouruopt = {
				    color: '#03d5b0',
				    barGap:'5%',
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
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
				            data : sumIncome.xList,
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
				            barMaxWidth: 42,
				            type:'bar',
				            stack: '签约',
				            data: sumIncome.y1List
				        },
				    ]
				};
				nianduzongshouru.setOption(nianduzongshouruopt);

				let yibaoshouruopt = {
				    color: '#03d5b0',
				    barGap:'5%',
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
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
				            "axisLabel":{
				        		interval: 0
				        	},
				            axisTick: {
				                show: false
				            },
				            data : medicatIncome.xList,
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
				            barMaxWidth: 42,
				            type:'bar',
				            stack: '签约',
				            data: medicatIncome.y1List
				        },
				    ]
				};
				yibaoshouru.setOption(yibaoshouruopt);

				let shourulineopt = {
				    color: ['#09e5bf', '#ff00ff', '#d8fc16'],
				    barGap:'5%',
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    legend: {
				        icon: 'roundRect',
				        data:['自费','医保','报销'],
				        textStyle: {color: '#02b3f9'},
				        x: 'right',
				        y: '3',
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
				        // bottom: '3%',
				        bottom: '0',
				        containLabel: true
				    },
				    xAxis:  [
				        {
				            type : 'category',
				            axisTick: {
				                show: false
				            },
				            data : income.xList,
				            axisLine: {
				                lineStyle: {
				                    type: 'solid',
				                    color: '#02b3f9',//左边线的颜色
				                    width:'1'//坐标线的宽度
				                }
				            },
				            axisLabel:{
				                //X轴刻度配置
				                interval:0 //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
				            }
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
				            // symbolSize: 0,
				            symbol: 'circle',
				            barMaxWidth: 14,
				            name: '自费',
				            data: income.y1List,
				            type: 'line',
				        },
				        {
				            // symbolSize: 0,
				            symbol: 'circle',
				            barMaxWidth: 14,
				            name: '医保',
				            data: income.y2List,
				            type: 'line'
				        },
				        {
				            // symbolSize: 0,
				            symbol: 'circle',
				            barMaxWidth: 14,
				            name: '报销',
				            data: income.y3List,
				            type: 'line'
				        }
				    ]
				};
				shouruline.setOption(shourulineopt);
				
				let benyuemeiguiopt = {
				    tooltip : {
				        trigger: 'item',
				        formatter: "{b} : {d}%"
				    },
				    color:['#09e6bd','#9944fa','#178afd','#d9fa13','#fbb90d'],
				    legend: {
				        textStyle: {color: '#02b3f9',fontSize: 12},
				        orient: 'vertical',
				        x: 'left', y: 'bottom',
				        itemWidth: 12,
				        itemHeight: 12,
				        data: ['门诊','住院','药品','检验','影像'],
				    },
				    // calculable : true,
				    series : [
				        {
				            type:'pie',
				            radius : [15, 60],
				            center : ['60%', '60%'],
				            roseType : 'area',
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
				            data: curIncome
				        }
				    ]
				}
				benyuemeigui.setOption(benyuemeiguiopt);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
};

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

var dyCunInterval = window.setInterval(function(){
	getServiceData();
}, 1000*60*60*4);

window.addEventListener('resize',function() {
    resizeWorldMapContainer();
    jiandangmeigui.resize();
    jiandangbar.resize();
    jiayimeigui.resize();
    jiayibar.resize();
    nianduzongshouru.resize();
    yibaoshouru.resize();
    suifangbar.resize();
    suifangyuanhuan.resize();
    jiuzhenbar.resize();
    jiuzhenyuanhuan.resize();
    shouruline.resize();
    benyuemeigui.resize();
})