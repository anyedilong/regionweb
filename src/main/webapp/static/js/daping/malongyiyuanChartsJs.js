// left
let jiuzhenbarId = document.getElementById('jiuzhenbar');
let jiayimeiguiboxId = document.getElementById('jiayimeiguibox');
let jiayimeiguiId = document.getElementById('jiayimeigui');
let zhanbibarId = document.getElementById('zhanbibar');
let nianduzongshouruId = document.getElementById('nianduzongshouru');
let yibaoshouruId = document.getElementById('yibaoshouru');
// right
let jiuzhentongjibarId = document.getElementById('jiuzhentongjibar');
let jiutongjiyuanhuanId = document.getElementById('jiutongjiyuanhuan');
let menzhenlineId = document.getElementById('menzhenline');
let zhuyuanlineId = document.getElementById('zhuyuanline');
let shourulineId = document.getElementById('shouruline');
let benyuemeiguiId = document.getElementById('benyuemeigui');
let benyuemeiguiBoxId = document.getElementById('benyuemeiguiBox');
// 重置大小
function resizeWorldMapContainer () {
    let winWid =  window.innerWidth;
    let winHei =  window.innerHeight;
    // left
    jiuzhenbarId.style.height = (winHei - 282 -140) * 0.33 + 'px';
    jiayimeiguiboxId.style.height = (winHei - 282 -140) * 0.34 + 'px';
    jiayimeiguiId.style.height = jiayimeiguiboxId.clientHeight - 60 + 'px';
    zhanbibarId.style.height = (winHei - 282 -140) * 0.34 + 'px';
    nianduzongshouruId.style.height = (winHei - 282 -140) * 0.32 + 'px';
    yibaoshouruId.style.height = (winHei - 282 -140) * 0.32 + 'px';
    // right
    jiuzhentongjibarId.style.height = (winHei - 282 -140) * 0.33 + 'px';
    jiutongjiyuanhuanId.style.height = (winHei - 282 -140) * 0.33 + 'px';
    menzhenlineId.style.height = (winHei - 282 -140) * 0.34 + 'px';
    zhuyuanlineId.style.height = (winHei - 282 -140) * 0.34 + 'px';
    shourulineId.style.height = (winHei - 282 -140) * 0.32 + 'px';
    benyuemeiguiBoxId.style.height = (winHei - 282 -140) * 0.32 + 'px';
    benyuemeiguiId.style.height = (winHei - 282 -140) * 0.32 + 'px';
    
    //更改页面的分辨率后，更新echarts的大小
    jiuzhenbar = echarts.init(document.getElementById('jiuzhenbar'));
    jiayimeigui = echarts.init(document.getElementById('jiayimeigui'));
    zhanbibar = echarts.init(document.getElementById('zhanbibar'));
    nianduzongshouru = echarts.init(document.getElementById('nianduzongshouru'));
    yibaoshouru = echarts.init(document.getElementById('yibaoshouru'));
    jiuzhentongjibar = echarts.init(document.getElementById('jiuzhentongjibar'));
    jiutongjiyuanhuan = echarts.init(document.getElementById('jiutongjiyuanhuan'));
    menzhenline = echarts.init(document.getElementById('menzhenline'));
    zhuyuanline = echarts.init(document.getElementById('zhuyuanline'));
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
		orgCode = '1001001001090';
		orgName = "马龙区人民医院综合管理平台";
	}
	$("#toptitle").text(orgName);
	$("#areaTile").text(orgName);
	//通用ajax,设置临时cookie
	//setCookie("author", "a9211734e03d47e9a6968ddca24e9c98", '1');
	//统计某地区的各类人次
	peopNumStats();
	//年度就诊人次
	getOutptionNum();
	//年度就诊人群统计
	getOutptionPeop();
	//门诊次均费用
	getOutptionAve();
	//住院次均费用
	getHosptionAve();
	//年度总收入、科室排名、收入对比、本月收入
	getIncomeProp();
	//动态服务
	getServiceData();
})

var medicantArr = [];
function peopNumStats(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/peopNumStats",
        data: JSON.stringify({"orgCode" : orgCode, "typeFlg" : "8"}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				//年度门诊人次
				$("#outpatNum").text(data.outpatNum);
				//年度住院人次
				$("#hosptNum").text(data.hosptNum);
				//年度检验人次
				$("#jcjyNum").text(data.jcjyNum);
				//新冠检验人次
				$("#nucleinNum").text(data.nucleinNum);
				//年度总收入
				$("#sumNum").text(data.sumNum);
				//西药收入
				$("#xyNum").text(data.xyNum);
				//中成药收入
				$("#zchengyNum").text(data.zchengyNum);
				//中草药收入
				$("#zcaoyNum").text(data.zcaoyNum);
				//本月自费收入
				$("#currOwnNum").text(data.currOwnNum);
				//本月医保收入
				$("#currYbNum").text(data.currYbNum);
				//本月统筹收入
				$("#currTcNum").text(data.currTcNum);
				medicantArr.push(creatrObj("西药", data.xyNum));
				medicantArr.push(creatrObj("中成药", data.zchengyNum));
				medicantArr.push(creatrObj("中草药", data.zcaoyNum));
				//药品收入&占比
				getMedicantIncomPeop();
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}

function getOutptionNum(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getWSYHospitalNum",
        data: JSON.stringify({"orgCode" : orgCode, "typeFlg" : "8"}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				let pie = data.pie.slice(0, 2);
				let line = data.line;
				
				let jiuzhenbaropt = {
				    color: ['#03d5b0', '#188bfe', '#f9ba0b', '#ff00ff'],
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
				        top: '5',
				        itemWidth: 12,
				        itemHeight: 12,
				        orient: 'horizontal', // 'vertical'
				        itemGap: 40,
				        padding: [0,20,0,0]
				    },
				    grid: [
				        {
				            top: '25px',
				            left: '0',
				            right: '4%',
				            bottom: '3%',
				            width: '70%',
				            containLabel: true
				        },
				        {
				            top: '35px',
				            width: '30%',
				            containLabel: true
				        }
				    ],
				    title: [
				        {
				            text: '本月就诊\n人次',
				            x: '86.5%',
				            y: '50%',
				            textAlign: 'center',
				            textStyle:{ //设置主标题风格
				                color:'#dfeef3',//设置主标题字体颜色
				                fontStyle:'12px',//主标题文字风格
				            },
				        }
				    ],
				    xAxis:[
				        {
				            type : 'category',
				            boundaryGap: false,
				            axisTick: {
				                show: false
				            },
				            data : line.xList,
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
				            data:  line.y1List,
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
				            data: line.y2List,
				            type: 'line',
				            smooth: true,
				        },
				        {
				            type:'pie',
				            radius: ['45%', '60%'],
				            center: ['87%', '60%'],
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
				            data:pie
				        },
				    ]
				};
				jiuzhenbar.setOption(jiuzhenbaropt);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}

function getOutptionPeop(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getWSYFollowPropNum",
        data: JSON.stringify({"orgCode" : orgCode, "typeFlg" : "8"}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data =  data.data;
				let bar = data.bar;
				
				let jiuzhentongjibaropt = {
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
				        itemWidth: 15,
				        itemHeight: 15,
				        orient: 'horizontal', // 'vertical'
				        itemGap: 40,
				        padding: [0,20,0,0]
				    },
				    grid: {
				        top: '25px',
				        left: '0',
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
				            interval: 300,
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
				jiuzhentongjibar.setOption(jiuzhentongjibaropt);

				let followArr = [];
				var showDis = 0;
				//前端拼接饼状图用到的数据
				for(let i = 0; i < bar.y1List.length; i++){
					if(i < 3){
						followArr.push(creatrObj(bar.xList[i], bar.y1List[i]));
					}else{
						showDis += bar.y1List[i];
					}
				}
				followArr.push(creatrObj('慢病管理', showDis));
				
				let jiutongjiyuanhuanopt =  {
				    color: ['#f9ba0b', '#03d5b0', '#188bfe', '#ff00ff'],
				    legend: {
				        icon: 'roundRect',
				        data:['儿童','孕产妇','老年人','慢病管理'],
				        textStyle: {color: '#02b3f9',fontSize: 12},
				        x: 'right',
				        top: '5',
				        itemWidth: 12,
				        itemHeight: 12,
				        itemGap: 40,
				        orient: 'horizontal', // 'vertical'
				        padding: [0,20,0,0]
				    },
				    grid:{
				        top: '35px',
				        containLabel: true
				    },
				    title: {
				        text: '就诊人群\n随访统计',
				        x: '84.5%',
				        y: '52%',
				        textAlign: 'center',
				        textStyle:{ //设置主标题风格
				            color:'#dfeef3',//设置主标题字体颜色
				            fontStyle:'12px',//主标题文字风格
				        },
				    },
				    series: [
				        {
				            type:'pie',
				            radius: ['40%', '65%'],
				            center: ['85%', '62%'],
				            label: {
				                normal: {
				                    formatter: '{c}',
				                    borderWidth: 20,
				                    borderRadius: 4,
				                    // padding: [-10, 0],
				                }
				            },
				            labelLine:{
				                normal:{
				                    length:5
				                }
				            },
				            data: followArr
				        }
				    ]
				};
				jiutongjiyuanhuan.setOption(jiutongjiyuanhuanopt);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}

function getMedicantIncomPeop(){
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
	            radius : [10, 50],
	            center : ['50%', '50%'],
	            roseType : 'radius',
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
	            data:medicantArr
	        }
	    ]
	};
	jiayimeigui.setOption(jiayimeiguiopt);

	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getYYChargeStatsData",
        data: JSON.stringify({"orgCode" : orgCode, "incomeType" : "20"}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data = data.data;
				
				let zhanbibaropt =  {
				    color: ['#03d5b0', '#198bfe', '#9b42fc'],
				    barGap:'5%',
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    legend: {
				        data:['西药','中成药', '中草药'],
				        textStyle: {color: '#02b3f9'},
				        x: 'right',
				        itemWidth: 15,
				        itemHeight: 15,
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
				            name:'西药',
				            barMaxWidth: 14,
				            type:'bar',
				            stack: '西药',
				            data: data.y3List
				        },
				        {
				            name:'中成药',
				            barMaxWidth: 14,
				            type:'bar',
				            stack: '中成药',
				            data: data.y2List
				        },{
				            name:'中草药',
				            barMaxWidth: 14,
				            type:'bar',
				            stack: '中草药',
				            data: data.y1List
				        }
				        
				    ]
				};
				zhanbibar.setOption(zhanbibaropt);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}

function getOutptionAve(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getYYChargeStatsData",
        data: JSON.stringify({"orgCode" : orgCode, "incomeType" : "21"}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data = data.data;
				
				let menzhenlineopt = {
				    color: ['#09e5bf'],
				    barGap:'5%',
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
				        }
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
				            data : data.xList,
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
				            symbol: 'circle',
				            barMaxWidth: 14,
				            name: '自费',
				            data: data.y1List,
				            type: 'line',
				        }
				    ]
				};
				menzhenline.setOption(menzhenlineopt);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}

function getHosptionAve(){
	$.ajax({
        type: 'POST',
        dataType: "json",
        //async: false,
        contentType: 'application/json',
        url: roadPath + "/family/stats/getYYChargeStatsData",
        data: JSON.stringify({"orgCode" : orgCode, "incomeType" : "22"}),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	//debugger;
        },
        success: function (data) {
			if(data.retCode == 0){
				data = data.data;
				
				let zhuyuanlineopt = {
				    color: ['#198bfe'],
				    barGap:'5%',
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
				        }
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
				            data : data.xList,
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
				            symbol: 'circle',
				            barMaxWidth: 14,
				            name: '自费',
				            data: data.y1List,
				            type: 'line',
				        }
				    ]
				};
				zhuyuanline.setOption(zhuyuanlineopt);
			}
        },
        complete: function (XMLHttpRequest, textStatus) {
        }
    });
}

function getIncomeProp(){
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
				        itemWidth: 15,
				        itemHeight: 15,
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

var dyCunInterval = window.setInterval(function(){
	getServiceData();
}, 1000*60*60*4);

function creatrObj(name, num){
	var obj = new Object;
	obj.name = name;
	obj.value = num;
	return obj;
} 

window.addEventListener('resize',function() {
    resizeWorldMapContainer();
    jiuzhenbar.resize();
    jiayimeigui.resize();
    zhanbibar.resize();
    nianduzongshouru.resize();
    yibaoshouru.resize();
    jiuzhentongjibar.resize();
    jiutongjiyuanhuan.resize();
    menzhenline.resize();
    zhuyuanline.resize();
    shouruline.resize();
    benyuemeigui.resize();
});