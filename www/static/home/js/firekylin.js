(function(win, doc) {
  var getById = function(el) {
    return doc.getElementById(el);
  };

  //from qwrap
  var getDocRect = function(doc) {
    doc = doc || document;
    var win = doc.defaultView || doc.parentWindow,
      mode = doc.compatMode,
      root = doc.documentElement,
      h = win.innerHeight || 0,
      w = win.innerWidth || 0,
      scrollX = win.pageXOffset || 0,
      scrollY = win.pageYOffset || 0,
      scrollW = root.scrollWidth,
      scrollH = root.scrollHeight;
    if (mode !== 'CSS1Compat') { // Quirks
      root = doc.body;
      scrollW = root.scrollWidth;
      scrollH = root.scrollHeight;
    }
    if (mode) { // IE, Gecko
      w = root.clientWidth;
      h = root.clientHeight;
    }
    scrollW = Math.max(scrollW, w);
    scrollH = Math.max(scrollH, h);
    scrollX = Math.max(scrollX, doc.documentElement.scrollLeft, doc.body.scrollLeft);
    scrollY = Math.max(scrollY, doc.documentElement.scrollTop, doc.body.scrollTop);
    return {
      width: w,
      height: h,
      scrollWidth: scrollW,
      scrollHeight: scrollH,
      scrollX: scrollX,
      scrollY: scrollY
    };
  };

  var getXY = function(node) {
    var doc = node.ownerDocument,
      docRect = getDocRect(doc),
      scrollLeft = docRect.scrollX,
      scrollTop = docRect.scrollY,
      box = node.getBoundingClientRect(),
      xy = [box.left, box.top];
    if (scrollTop || scrollLeft) {
      xy[0] += scrollLeft;
      xy[1] += scrollTop;
    }
    return xy;
  };

  var getRect = function(el) {
    var p = getXY(el);
    var x = p[0];
    var y = p[1];
    var w = el.offsetWidth;
    var h = el.offsetHeight;
    return {
      'width': w,
      'height': h,
      'left': x,
      'top': y,
      'bottom': y + h,
      'right': x + w
    };
  };

  /**
   * load comment
   * @return {[type]} [description]
   */
  var loadComment = function() {
    var comments = getById('comments');
    if(!comments) {
      return;
    }
    var load = function() {
      var dataType = comments.getAttribute('data-type');
      if(dataType === 'disqus') {
        loadDisqusComment();
      }else if(dataType === 'duoshuo') {
        loadDuoshuoComment();
      }else if(dataType === 'changyan') {
        loadChangyanComment();
      }else if(dataType === 'netease') {
        loadNeteaseComment();
      }
    }

    if(location.hash.indexOf('#comments') > -1) {
      load();
    }else {
      var timer = setInterval(function() {
        var docRect = getDocRect();
        var currentTop = docRect.scrollY + docRect.height;
        var elTop = getRect(comments).top;
        if(Math.abs(elTop - currentTop) < 1000) {
          load();
          clearInterval(timer);
        }
      }, 300)
    }
  };
  /**
   * load disqus comment
   * @return {[type]} [description]
   */
  var loadDisqusComment = function() {
    var disqus_thread = getById('disqus_thread');
    if(!disqus_thread) {
      return;
    }
    win.disqus_config = function() {
      this.page.url = disqus_thread.getAttribute('data-url');
      this.page.identifier = disqus_thread.getAttribute('data-identifier');
    }
    var s = doc.createElement('script');
    s.src = '//' + disqus_thread.getAttribute('data-name') + '.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (doc.head || doc.body).appendChild(s);
  };

  var loadDuoshuoComment = function() {
    var disqus_thread = getById('ds_thread');
    if(!disqus_thread) {
      return;
    }
    win.duoshuoQuery = {short_name: disqus_thread.getAttribute('data-name')};
    var s = doc.createElement('script');
    s.src = '//static.duoshuo.com/embed.js';
    (doc.head || doc.body).appendChild(s);
  };

  var loadChangyanComment = function() {
    var disqus_thread = getById('SOHUCS');
    if(!disqus_thread) { return; }
    var appid = disqus_thread.getAttribute('data-name');
    var conf = disqus_thread.getAttribute('sid');
    var width = win.innerWidth || doc.documentElement.clientWidth;
    var s = doc.createElement('script');
    if (width < 960) {
      s.id = 'changyan_mobile_js';
      s.src = '//changyan.sohu.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + appid + '&conf=' + conf;
    } else {
      s.src = '//changyan.sohu.com/upload/changyan.js';
      s.onload = function() {
        win.changyan.api.config({appid:appid, conf:conf});
      }
    }
    (doc.head||doc.body).appendChild(s);
  }

  var loadNeteaseComment = function() {
    var disqus_thread = getById('cloud-tie-wrapper');
    if(!disqus_thread) {
      return;
    }
    win.cloudTieConfig = {
      url: getById('comments').getAttribute('data-url'),
      sourceId: '',
      productKey: disqus_thread.getAttribute('data-name'),
      target: disqus_thread.className
    };
    var s = doc.createElement('script');
    s.src = 'https://img1.cache.netease.com/f2e/tie/yun/sdk/loader.js';
    (doc.head || doc.body).appendChild(s);
  }
  win.addEventListener('load', function() {
    loadComment();
  });





  var utils = {
    isMob : (function() {
      var ua = navigator.userAgent.toLowerCase();
      var agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
      var result = false;
      for(var i = 0; i < agents.length; i++) {
        if(ua.indexOf(agents[i].toLowerCase()) > -1) {
          result = true;
        }
      }
      return result;
    })()
  }


  if(utils.isMob) {
    doc.documentElement.className += ' mob';
  }else{
    doc.documentElement.className += ' pc';
  }


  var Dom = {
    $sidebar : doc.querySelector('#sidebar'),
    $main : doc.querySelector('#main'),
    $sidebar_mask : doc.querySelector('#sidebar-mask'),
    $body : doc.body,
    $btn_side : doc.querySelector('#header .btn-bar'),
    $article : doc.querySelectorAll('.mob #page-index article')
  };

  Dom.bindEvent = function() {

    var _this = this,
      body_class_name = 'side',
      eventFirst = 'click',
      eventSecond = 'click';

    if(utils.isMob) {
      eventFirst = 'touchstart';
      eventSecond = 'touchend';
    }

    this.$btn_side.addEventListener(eventSecond, function() {

      if(_this.$body.className.indexOf(body_class_name) > -1) {
        _this.$body.className = _this.$body.className.replace(body_class_name, '');
        _this.$sidebar_mask.style.display = 'none';
      }else{
        _this.$body.className += (' ' + body_class_name);
        _this.$sidebar_mask.style.display = 'block';
      }

    }, false);

    this.$sidebar_mask.addEventListener(eventFirst, function(e) {
      _this.$body.className = _this.$body.className.replace(body_class_name, '');
      _this.$sidebar_mask.style.display = 'none';
      e.preventDefault();
    }, false);


    win.addEventListener('resize', function() {
      _this.$body.className = _this.$body.className.replace(body_class_name, '');
      _this.$sidebar_mask.style.display = 'none';
    }, false);
  }

  Dom.bindEvent();

  /**
   * 预加载图片
   *
   * @param  {string}   url      图片链接
   * @param  {Function} callback 加载回调
   */
  function preLoadImg(url, callback) {
    var id = '__img__' + Date.now();
    var img = window[id] = new Image();
    var destroy = function () {
      img = null;
      delete window[id];
    };
    img.onload = function () {
      callback(null, url);
      destroy();
    };
    img.onabort = img.onerror = function () {
      callback(true, url);
      destroy();
    };
    img.src = url;
    if (img.complete && img.onload) {
      img.onload();
    }
  }

  /**
   *  Image Lazy Load
   */
  win.addEventListener('scroll', lazyLoad);
  win.addEventListener('resize', lazyLoad);

  function lazyLoad() {
    var lazyLoadImages = doc.getElementsByClassName('lazy-load');
    if (lazyLoadImages.length === 0) {
      win.removeEventListener('scroll', lazyLoad);
      win.removeEventListener('resize', lazyLoad);
    } else {
      for (var i = lazyLoadImages.length - 1; i >= 0; i--) {
        (function () {
          var img = lazyLoadImages[i];
          if (lazyLoadShouldAppear(img, -200)) {
            preLoadImg(img.getAttribute('data-src'), function (err, url) {
              img.src = url;
            });
            img.removeAttribute('data-src');
            img.classList.remove('lazy-load');
          }
        })(i);
      }
    }

    lazyLoadImages = null;
  }


  function lazyLoadShouldAppear(el, buffer) {
    var scrollTop = doc.body.scrollTop;
    var wh = win.innerHeight || doc.documentElement.clientHeight;
    var offsetTop = el.parentNode.offsetTop;

    // 高级可见:
    // 1. 往下滚看到就算
    // 2. 一下滚超过屏幕不加载
    return scrollTop + wh >= offsetTop + buffer && offsetTop + el.offsetHeight >= scrollTop;
  }

  // 默认加载下
  lazyLoad();


  // 行号和高亮行处理 @xuexb
  var hljs = {
    $code: doc.querySelectorAll('pre code'),
    hasClass: function (ele, cls) {
      return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },
    addClass: function (ele, cls) { 
      if (!hljs.hasClass(ele, cls)) {
        ele.className += ' ' + cls;
      }
    },
    removeClass: function (ele, cls) {
      if (hljs.hasClass(ele,cls)) {
        ele.className = ele.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'),' ');
      }
    }
  };

  /**
   * 使用数据生成hash
   *
   * @param  {Object} data 数据
   *
   * @return {string}
   */
  hljs.stringHash = function (data) {
    var hash = '';
    if (data.index > 1) {
      hash += data.index + '-';
    }
    hash += 'L' + data.start;
    if (data.end && data.end > data.start) {
      hash += '-' + 'L' + data.end;
    }
    return hash;
  };

  /**
   * 解析hash为数据
   *
   * @return {[type]} [description]
   */
  hljs.parseHash = function () {
    var parse = location.hash.substr(1).match(/((\d+)-)?L(\d+)(-L(\d+))?/);

    if (!parse) {
      return null;
    }

    return {
      index: parseInt(parse[2], 10) || 1,
      start: parseInt(parse[3], 10) || 1,
      end: parseInt(parse[5], 10) || parseInt(parse[3], 10) || 1
    }
  };

  /**
   * 标记行颜色并跳转
   */
  hljs.mark = function (go) {
    var hash = hljs.parseHash();
    if (!hash || !hljs.$code || !hljs.$code[hash.index - 1]) {
      return;
    }

    var $li = hljs.$code[hash.index - 1].querySelectorAll('li');
    for (var i = hash.start - 1; i < hash.end; i++) {
      if ($li[i]) {
        hljs.addClass($li[i], 'mark');
      }
    }
    if (go && $li && $li[0]) {
      setTimeout(function () {
        window.scrollTo(0, getRect($li[0]).top - 50);
      });
    }
  };

  /**
   * 移除所有高亮行号
   */
  hljs.removeMark = function () {
    var $mark = doc.querySelectorAll('pre code li.mark');
    for (var i = $mark.length - 1; i >= 0; i--) {
      hljs.removeClass($mark[i], 'mark');
    }
  };

  /**
   * 初始化行号和绑定事件
   */
  hljs.init = function () {
    var $code = hljs.$code;
    if ($code && $code.length) {
      for (var i = $code.length - 1; i >= 0; i--) {
        var html = $code[i].innerHTML.split(/\n/).slice(0, -1).map(function (item, index) {
          return '<li class="line" data-line="' + (index + 1) + '">' + item + '</li>';
        }).join('');
        $code[i].innerHTML = '<ul>' + html + '</ul>';

        $code[i].setAttribute('data-index', i + 1);

        $code[i].addEventListener('click', function (event) {
          var isTarget = false;
          var target = event.target;

          while (!isTarget) {
            if (hljs.hasClass(target, 'hljs')) {
              break;
            }
            else if (hljs.hasClass(target, 'line')) {
              isTarget = true;
              break;
            }
            else {
              target = target.parentNode;
            }
          }

          if (!isTarget) {
            return;
          }

          // 如果是区间
          if (event.shiftKey) {
            var hash = hljs.parseHash();
            hash.newIndex = target.parentNode.parentNode.getAttribute('data-index');
            hash.current = target.getAttribute('data-line');
            if (hash.index !== hash.newIndex - 0) {
              hash.index = hash.newIndex;
              hash.start = hash.current;
              hash.end = 0;
            }
            else {
              if (hash.current > hash.start) {
                hash.end = hash.current;
              }
              else {
                hash.end = hash.start;
                hash.start = hash.current;
              }
            }
            location.hash = hljs.stringHash({
              index: hash.index,
              start: hash.start,
              end: hash.end
            });
          }
          else {
            location.hash = hljs.stringHash({
              index: target.parentNode.parentNode.getAttribute('data-index'),
              start: target.getAttribute('data-line')
            });
          }
        });
      }
    }
  };

  hljs.init();
  win.addEventListener('load', function() {
    hljs.mark(true);
  });
  win.addEventListener('hashchange', function () {
    hljs.removeMark();
    hljs.mark();
  });

})(window, document);
