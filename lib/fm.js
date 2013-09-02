// Features:
//  - close sub-folder by clicking on parent
//  - open file in preview
//  - download button?
//  - open in git button?
//  - opening file closes sub-folders if any (same as clicking on parent)

function filetype(filename) {
    // special
    if (filename.match(/\/$/)) return 'dir';
    if (filename.match(/^note/)) return 'note';                     //f073
    if (filename.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/)) return 'note';
    if (filename.match(/^(README)/)) return 'text';
    if (filename.match(/^(Makefile)/)) return 'code';
    // filetypes
    if (filename.match(/\.(bmp|gif|ico|jpeg|jpg|png|psd|raw|tiff|xcf|svg)$/)) return 'image'; //f03e
    if (filename.match(/\.(avi|mpg|ogv|wma)$/)) return 'video';     //f008
    if (filename.match(/\.(aac|m4a|mp3|ogg|wav)$/)) return 'audio'; //f001
    if (filename.match(/\.(7z|apk|bin|bz2|cab|deb|dmg|gz|jar|lz|pk3|pk4|rar|tar|tar\.gz|zip)$/)) return 'zip'; //f187
    if (filename.match(/\.(bat|c|css|js|json|m|sh)$/)) return 'code';   //f121
    if (filename.match(/\.(html)$/)) return 'web';
    if (filename.match(/\.(url)$/)) return 'link';
    if (filename.match(/\.(md|ini|textile|txt)$/)) return 'text';
    if (filename.match(/\.(tex)$/)) return 'book';                  //f02d
    return 'file';
}

var indexFiles = ['index.md','index.html','README','README.txt'];
var fileTypeIcons = {
    'dir'   : 'icon-folder-close-alt',
    'file'  : 'icon-file-alt',
    'text'  : 'icon-file-text-alt',
    'image' : 'icon-picture',
    'video' : 'icon-film',
    'audio' : 'icon-music',
    'zip'   : 'icon-archive',
    'code'  : 'icon-code',
    'book'  : 'icon-book',
    'note'  : 'icon-calendar',
    'web'   : 'icon-globe',
    'link'  : 'icon-external-link',
};

function toId(path) {
    return path.replace(/\//g,'__');
}

// build tree
function buildTree(dir, path){

    var id = path.replace(/\//g,'__');
    var html = '<div class="dir" id="dir_'+id+'" data-path="'+path+'">';
    var subs = '';
    for (var i=0; i<dir.length; i++) {
        var x = dir[i];
        var type = (x.type=='file')?'file':'';
        x.name = (x.type=='file')? x.name : x.name+'/' ;
        var subpath = path+x.name;
        //console.log(subpath);
        var ftype = (x.type=='dir')?'icon-folder-close-alt':filetype(x.name);
        var ftype = filetype(x.name);
        var icon = fileTypeIcons[ftype];
        var indexfile = (indexFiles.indexOf(x.name)>-1) ? ' indexfile' : '' ;
        html = html + '<li class="type-'+type+indexfile+'" data-path="'+subpath+'"><i class="'+icon+'"></i> '+x.name+'</li>';
        if (x.type=='dir') {
            subs = subs + buildTree(x.contents, subpath);
        }
    }
    var pathparts = path.split('/');
    var parentpath = '/'+pathparts.slice(0,pathparts.length-2).join('/');
    html = html + '<div class="icon-remove" data-path="'+parentpath+'"></div></div>' + subs;
    return html;
}

var theProject = '';
var theRoot = '';
var thePath = '';

function navigateTo(path) {

    // initial path
    if (path == undefined) {
        var fullpath = location.pathname.split('/');
        theProject = fullpath[2];
        theRoot = '/projects/'+theProject;
        fullpath.shift();
        fullpath.shift();
        fullpath.shift();
        thePath = '/'+fullpath.join('/');
        path = thePath;
    } else {
        //pushState
        history.pushState(null,null,theRoot+path)
    }

    // is dir?
    if (path.substr(-1) == '/') {
    //    // load index file
    //    var index = $('#dir_'+toId(path)).find('.indexfile');
    //    console.log(index.length);
    //    if (index.length>0) {
    //        file = $(index[0]).data('path');
    //        loadFile(file);
    //    } else {
    //        $('#fileview').text('select a file');
    //        console.log($('#fileview'));
    //    }
    } else {
        // load file preview
        loadFile(path);
    }
    animateTo(path);
}

function loadFile(path) {
    
    // what type of file is this?
    /*
      txt: wrap in pre
      note: markup
      md: markup (iframe?)
      html: iframe
      picture: load
      video: download button
      code: highlight
      zip: download
      book: ??
      pdf: preview
    */

    var file = path.split('/');
        file = file[file.length-1];
    var type = filetype(file);
    var url = '/raw'+theRoot+path;
    var html = '';
    switch (type) {
        /*
        
    'dir'   : 'icon-folder-close-alt',
    'file'  : 'icon-file-alt',
    'text'  : 'icon-file-text-alt',
    'image' : 'icon-picture',
    'video' : 'icon-film',
    'audio' : 'icon-music',
    'zip'   : 'icon-archive',
    'code'  : 'icon-code',
    'book'  : 'icon-book',
    'note'  : 'icon-calendar',

    need better language selection from filetype

    what about sourceMakeup or docco?
        
        */
        case 'link':
            content = fetch(url);
            //location.href=content;
            html = '<pre>Go to <a href="'+url+'">'+url+'</a></pre>'
            break;
        case 'note':
        case 'text':
            content = fetch(url);
            html = '<pre><code class="markdown">'+content+'</code></pre>'
                 + '<script>$("code").each(function(){hljs.highlightBlock(this);});</script>';
            html = '<script id="source" type="text/markdown">'+content+'</script><iframe></iframe>'
                 + '<script>'
                 + 'var md = new Showdown.converter();'
                 + 'var html = "<head><link rel=stylesheet href=//my.sbl.io/raw/projects/file-browser/lib/md.css></head><body>";'
                 + '    html = html + md.makeHtml($("#source").html()) + "</body>";'
                 + '$("iframe").contents().find("html").html(html);'
                 + '</script>';
            break;
        case 'book':
            content = fetch(url);
            html = '<pre><code class="latex">'+content+'</code></pre>'
                 + '<script>$("code").each(function(){hljs.highlightBlock(this);});</script>';
                 //+ '<script>hljs.initHighlighting();</script>';
            break;
        case 'code':
            content = fetch(url);
            html = '<pre><code>'+content+'</code></pre>'
                 + '<script>$("code").each(function(){hljs.highlightBlock(this);});</script>';
            break;
        case 'image':
            html = '<img src="'+url+'">';
            break;
        case 'web':
        case 'zip':
        case 'audio':
        case 'video':
        default:
            html = '<iframe src="'+url+'"></iframe>';
    }
    $('#fileview').html(html);
}

function fetch(url) {

    var string;
    jQuery.ajax({
        url: url,
        async: false,
        dataType: 'text',
        success: function(data){
            string = data;
        },
        error: function(){
            string = '';
        }
    });
    return string;
}

var isFile = 0;
var isDepth = 1;

// animation
function animateTo(path) {

    var id = '';
    var parts = path.split('/'); //0: blank, 1...n-2: dirs, n-1: file (if any)

    // file or dir?
    isFile = (path.substr(-1)=='/') ? 0 : 1 ;
    isDepth = parts.length;

    // close all directories
    $('.dir').removeClass('show open');
    $('li').removeClass('selected');

    // show path directories
    var part = '';
    for (var i=0; i<parts.length; i++) {
        part = part+parts[i]+'/';
        id = part.replace(/\//g,'__');
        $('#dir_'+id).addClass('show');
        $('li[data-path="'+part+'"]').addClass('selected');
    }

    // open main directory
    id = path.replace(/\//g,'__');
    $('#dir_'+id).addClass('open');
    $('li[data-path="'+path+'"]').addClass('selected');

    resizeView();
}

// resizeViewer
function resizeView() {

    var padding = (isDepth-1) * 3 + (1-isFile) * 23.5;// + 8;
    $('#fileview').css('left',padding+'em');
}

function clickLi(){
    var $this = $(this);
    var path = $this.data('path');
    navigateTo(path);
    return false;
}

$(function(){

    // build page
    var $dirs = buildTree(root, '/');
    $('#dirnav').append($dirs);

    navigateTo();

    // navigation actions
    $('li').click(clickLi);
    $('.icon-remove').click(clickLi);
    $('.dir').click(clickLi);
    window.onpopstate = function(){navigateTo()};

    // peek animation
    $('.dir').mouseover(function(){
        //console.log(this)
        $('.dir').removeClass('peek');
        $(this).addClass('peek');
    });
    $('.dir').mouseout(function(){
        $(this).removeClass('peek');
    });

});
