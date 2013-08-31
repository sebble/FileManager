// Features:
//  - close sub-folder by clicking on parent
//  - open file in preview
//  - download button?
//  - open in git button?
//  - opening file closes sub-folders if any (same as clicking on parent)

function filetype(filename) {
    if (filename.match(/\.(bmp|gif|ico|jpeg|jpg|png|psd|raw|tiff|xcf|svg)$/)) return 'icon-picture'; //"\f03e"
    if (filename.match(/\.(avi|mpg|ogv|wma)$/)) return 'icon-film';
    if (filename.match(/\.(aac|m4a|mp3|ogg|wav)$/)) return 'icon-music';
    if (filename.match(/\.(7z|apk|bin|bz2|cab|deb|dmg|gz|jar|lz|pk3|pk4|rar|tar|tar\.gz|zip)$/)) return 'icon-archive'; //f187
    if (filename.match(/\.(c|css|html|js|m|sh)$/)) return 'icon-code'; //"\f121"
    if (filename.match(/^(README)/)) return 'icon-file-text-alt';
    if (filename.match(/\.(md|ini|textile|txt)$/)) return 'icon-file-text-alt';
        // calendar - "\f073"
        // book - "\f02d"
        // film - "\f008"
        // music - "\f001"
        // text - icon-file-text-alt
        // binary - icon-file-alt
    return 'icon-file-alt';
}


      /* FileBrowser */
      $(function(){
        
        // build tree
        function buildTree(dir, path){
          
          var html = '<div class="dir" id="dir_'+path+'">';
          var subs = '';
          for (var i=0; i<dir.length; i++) {
            var x = dir[i];
            var type = (x.type=='file')?'file':'';
            var subpath = path+'_'+i;
            //var ftype = (x.name.split('.')).pop();
            var ftype = (x.type=='dir')?'icon-folder-close-alt':filetype(x.name);
            html = html + '<li class="'+type+'" data-path="'+subpath+'"><i class="'+ftype+'"></i> '+x.name+'</li>';
            if (x.type=='dir') {
              subs = subs + buildTree(x.contents, subpath);
            }
          }
          html = html + '<div class="icon-remove"></div></div>' + subs;
          return html;
          
        }
        var $dirs = buildTree(root, '0');
        //console.log($dirs);
        $('#dirnav').append($dirs);
        $('.dir').removeClass('show');
        $('#dir_0').addClass('show open');
        
        $('.dir li').click(function(){
          var $this = $(this);
          var path = $this.data('path');
          if ($this.hasClass('file')) {
            
          } else {
            // hide all sub dirs of this parent
            var bits = (''+path).split('_');
            // highlight selections
            var partpath = '0';
            $('li').removeClass('selected');
            $('li i.icon-folder-open').removeClass('icon-folder-open').addClass('icon-folder-close-alt');
            $('.dir').removeClass('open show');
            $('#dir_0').addClass('show');
            for (var i=1; i<bits.length; i++) {
              partpath = partpath + '_' + bits[i];
              // open dirs
              $('#dir_'+partpath).addClass('show');
              // select dir
              $('li[data-path="'+partpath+'"]').addClass('selected');
              $('li[data-path="'+partpath+'"] i').removeClass('icon-folder-close-alt icon-folder-open-alt').addClass('icon-folder-open');
            }
            // open child dir
            $('#dir_'+path).addClass('open');
            // calculate view size
            var vw = $('.dir.show').length*2 + 23.5 + 'em';
            $('#fileview').css('left',vw);
          }
        });
        
        $('.dir').mouseover(function(){
          $('.dir').removeClass('peek');
          $(this).addClass('peek');
        });
        $('.dir').mouseout(function(){
          $(this).removeClass('peek');
        });
        $('.dir .icon-remove').click(function(){
          var path = $(this).parent().attr('id');
          var bits = path.split('_');
          bits.pop();
          bits.shift();
          path = bits.join('_');
          // click button to make parent appear path
          $('li[data-path="'+path+'"]').click();
        });
        $('.dir li').mouseover(function(){
          $('.dir li i.icon-folder-open-alt')
            .removeClass('icon-folder-open-alt')
            .addClass('icon-folder-close-alt');
          $(this).find('i.icon-folder-close-alt')
            .removeClass('icon-folder-close-alt')
            .addClass('icon-folder-open-alt');
        });
        $('.dir li').mouseout(function(){
          $(this).removeClass('peek');
        });
      });
