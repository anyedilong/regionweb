$(function () {
    $('.pingtaiName').click(function () {
        if ( $('#mainPage').attr('src') !== '../daping/index.html') {
            $('#mainPage').attr('src', '../daping/index.html')
            $('.tabUl .tabLi').removeClass('tabLiact')
        }
    })
    $('.homeUrl').click(function () {
        if ( $('#mainPage').attr('src') !== '../daping/index.html') {
            $('#mainPage').attr('src', '../daping/index.html')
            $('.tabUl .tabLi').removeClass('tabLiact')
        }
    })
    let menuStatus = true //菜单展开状态
    $('.menuBtn .qyhshouqi').click(function () {
        if (menuStatus && $('.leftMenu').outerWidth() === 240) {
            $('.yiji-li .li-tit').hide()
            $('.yiji-li .erji-ul').hide()
            $('.leftMenu').animate({
                width: '60px'
            },500,function () {
            	$('.qyhshouqi').addClass('menuIact')
                menuStatus = false
            })
            $('.rightCont').animate({
                paddingLeft: '60px'
            },500)
        } else {        	
            $('.yiji-li .li-tit').show()
            $('.leftMenu').animate({
                width: '240px'
            },500,function () {
            	$('.qyhshouqi').removeClass('menuIact')
                menuStatus = true
            })
            $('.rightCont').animate({
                paddingLeft: '240px'
            },500)
        }
    })
    // 一级菜单点击
    $('.yiji-ul').on('click', '.yiji-li>.menu-div', function () {
        if (menuStatus) {
            $('.yiji-li>.menu-div').removeClass('menuact1')
            $(this).addClass('menuact1')
            $('.erji-ul').stop().slideUp()
            $(this).next().stop().slideToggle()
        } else {
            $('.yiji-li>.menu-div').removeClass('menuact1')
            $(this).addClass('menuact1')
            $('.yiji-li .li-tit').show()
            $(this).next().stop().slideToggle()
            $('.leftMenu').animate({
                width: '240px'
            },500)
            $('.rightCont').animate({
                paddingLeft: '240px'
            },500)
            $('.qyhshouqi').removeClass('menuIact')
            menuStatus = true
        }
    })
    // 二级菜单点击，增加tab
    $('.yiji-ul').on('click', '.erji-li>.menu-div', function () {
        let $this = $(this)
        // menu样式
        $('.erji-li>.menu-div').removeClass('menuact2')
        $(this).addClass('menuact2')
        // tab样式
        $('.tabUl .tabLi').removeClass('tabLiact')
        // 增加新的tab    //增加一个历史记录功能
        // if ($('.tabLi').length !== 0) {
        //     let tabHis = //     // 全部的历史
        //     for (let i = 0; i < $('.tabLi').length; i++) {
        //         tabHis += $('.tabLi').eq(i).attr('his')
        //     }
        //     if (tabHis.indexOf($this.attr('src')) < 0) {
        //         $('.tabUl').append(' <li class="tabLi tabLiact" his="' + $this.attr('src') + '" src="' + $this.attr('src') + '"><span>' +
        //             $this.find('.li-tit').html() +
        //             '</span><i class="qyhclose iconBtn"></i></li>')
        //     } else {
        //
        //     }
        // } else {
        //     $('.tabUl').append(' <li class="tabLi tabLiact" his="' + $this.attr('src') + '" src="' + $this.attr('src') + '"><span>' +
        //         $this.find('.li-tit').html() +
        //         '</span><i class="qyhclose iconBtn"></i></li>')
        // }
        if ($(this).attr('act') === 'false') {
            $('.tabUl').append(' <li class="tabLi tabLiact" his="' + $this.attr('src') + '" src="' + $this.attr('src') + '"><span>' +
                $this.find('.li-tit').html() +
                '</span><i class="qyhclose iconBtn"></i></li>')
            $(this).attr('act','true')
        } else {
            for (let i = 0; i < $('.tabLi').length; i++) {
                let tabHis = $('.tabLi').eq(i).attr('his')
                if (tabHis.indexOf($this.attr('src')) > -1) {
                    $('.tabLi').eq(i).attr('src', $this.attr('src'))
                    $('.tabLi').eq(i).attr('his', $this.attr('src'))
                    $('.tabLi').eq(i).find('span').html($this.find('.li-tit').html())
                }
            }
        }
        let tabLiPosition = 0 //当前选中的tab距离tabUlar的长度
        for (let i = 0; i < $('.tabLi').length; i++) {
            let tabsrc = $('.tabLi').eq(i).attr('src')
            if (tabsrc === $this.attr('src')) {
                let nn = i
                $('.tabLi').eq(i).addClass('tabLiact')
                for (let j = 0; j < nn; j++) {
                    tabLiPosition += $('.tabLi').eq(j)[0].clientWidth
                }
            }
        }
        // 切换iframe的src
        if ($('#mainPage').attr('src') !== $(this).attr('src')) {
            $('#mainPage').attr('src',$(this).attr('src'))
        }
        // 切换滚动
        let tabBtn = document.getElementsByClassName('tabBtn')[0]
        let tabBtnW = tabBtn.clientWidth  //number
        tabBtn.scrollLeft = tabLiPosition
        let tabUl = document.getElementsByClassName('tabUl')[0]
        let tabUlW = tabUl.clientWidth  //number
        // 出现滚动情况
        if (tabUlW > tabBtnW) {
            if (tabBtn.scrollLeft === 0) {
                $('.arrow-left i').removeClass('iunact')
                $('.arrow-right i').addClass('iunact')
            } else if (tabBtn.scrollLeft > 0) {
                if (tabBtn.scrollLeft === (tabUlW - tabBtnW)) {
                    $('.arrow-left i').addClass('iunact')
                    $('.arrow-right i').removeClass('iunact')
                } else {
                    $('.arrow-left i').addClass('iunact')
                    $('.arrow-right i').addClass('iunact')
                }
            }
        }
    })
    // 左右tab滚动函数
    $('.arrow-left').click(function () {
        let tabBtn = document.getElementsByClassName('tabBtn')[0]
        let tabBtnW = tabBtn.clientWidth  //number
        let tabUl = document.getElementsByClassName('tabUl')[0]
        let tabUlW = tabUl.clientWidth  //number
        let oldScroll = tabBtn.scrollLeft
        if ($(this).children('i').hasClass('iunact')) {
            tabBtn.scrollLeft = oldScroll - tabBtnW
            if (tabBtn.scrollLeft === 0) {
                $('.arrow-left i').removeClass('iunact')
                $('.arrow-right i').addClass('iunact')
            } else if (tabBtn.scrollLeft > 0) {
                if (tabBtn.scrollLeft === (tabUlW - tabBtnW)) {
                    $('.arrow-left i').addClass('iunact')
                    $('.arrow-right i').removeClass('iunact')
                } else {
                    $('.arrow-left i').addClass('iunact')
                    $('.arrow-right i').addClass('iunact')
                }
            }
        }
    })
    // 左右tab滚动函数
    $('.arrow-right').click(function () {
        let tabBtn = document.getElementsByClassName('tabBtn')[0]
        let tabBtnW = tabBtn.clientWidth  //number
        let tabUl = document.getElementsByClassName('tabUl')[0]
        let tabUlW = tabUl.clientWidth  //number
        let oldScroll = tabBtn.scrollLeft
        if ($(this).children('i').hasClass('iunact')) {
            tabBtn.scrollLeft = oldScroll + tabBtnW
            if (tabBtn.scrollLeft === 0) {
                $('.arrow-left i').removeClass('iunact')
                $('.arrow-right i').addClass('iunact')
            } else if (tabBtn.scrollLeft > 0) {
                if (tabBtn.scrollLeft === (tabUlW - tabBtnW)) {
                    $('.arrow-left i').addClass('iunact')
                    $('.arrow-right i').removeClass('iunact')
                } else {
                    $('.arrow-left i').addClass('iunact')
                    $('.arrow-right i').addClass('iunact')
                }
            }
        }
    })
    // 切换tab
    $('.tabUl').on('click', '.tabLi', function () {
        $('.yiji-li>.menu-div').removeClass('menuact1')
        $('.erji-ul').stop().slideUp()
        $('.erji-li>.menu-div').removeClass('menuact2')
        if ($('#mainPage').attr('src') !== $(this).attr('src')) {
            $('#mainPage').attr('src',$(this).attr('src'))
            $('.tabUl .tabLi').removeClass('tabLiact')
            $(this).addClass('tabLiact')
        }
        for (let i = 0; i < $('.erji-li .menu-div').length; i++) {
            let menuUrl = $('.erji-li .menu-div').eq(i).attr('src')
            if ($(this).attr('his').indexOf(menuUrl) > -1) {
                $('.erji-li .menu-div').eq(i).addClass('menuact2')
                $('.erji-li .menu-div').eq(i).parents('.yiji-li').children('.menu-div').addClass('menuact1')
                if (menuStatus) {
                    $('.erji-li .menu-div').eq(i).parents('.yiji-li').children('.erji-ul').stop().slideDown()
                }
            }
        }
    })
    // 关闭tab
    $('.tabUl').on('click', '.iconBtn', function (event) {
        event.stopPropagation()
        $('.yiji-li>.menu-div').removeClass('menuact1')
        $('.erji-ul').stop().slideUp()
        $('.erji-li>.menu-div').removeClass('menuact2')
        let $this = $(this)
        let pageUrl = ''
        let iframeSrc = $('#mainPage').attr('src')
        let tabind = $this.parent().index()
        if ($('.tabLi').length === 1) {
            pageUrl = 'home.html'
        } else {
            if (tabind === 0) {
                pageUrl = $this.parent().next().attr('src')
                $this.parent().next().addClass('tabLiact')
            } else {
                pageUrl = $this.parent().prev().attr('src')
                $this.parent().prev().addClass('tabLiact')
            }
        }
        for (let i = 0; i < $('.erji-li .menu-div').length; i++) {
            let menuUrl = $('.erji-li .menu-div').eq(i).attr('src')
            if ($this.parent().attr('his').indexOf(menuUrl) > -1) {
                $('.erji-li .menu-div').eq(i).attr('act','false')
            }
            if (menuUrl === pageUrl) {
                $('.erji-li .menu-div').eq(i).addClass('menuact2')
                $('.erji-li .menu-div').eq(i).parents('.yiji-li').children('.menu-div').addClass('menuact1')
                if (menuStatus) {
                    $('.erji-li .menu-div').eq(i).parents('.yiji-li').children('.erji-ul').stop().slideDown()
                }
            }
        }
        //console.log($('.tabLi').length)
        $('#mainPage').attr('src', pageUrl)
        $this.parent().remove()
    })
    // 局部刷新
    $('.refreshBtn').click(function () {
        $('#mainPage').attr('src', $('#mainPage').attr('src'));
    })
})