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
            html = html + '<li class="'+type+'" data-path="'+subpath+'"><i></i> '+x.name+'</li>';
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
            $('.dir').removeClass('open show');
            $('li[data-path="0"]').addClass('selected');
            $('#dir_0').addClass('show');
            for (var i=1; i<bits.length; i++) {
              partpath = partpath + '_' + bits[i];
              // open dirs
              $('#dir_'+partpath).addClass('show');
              // select dir
              $('li[data-path="'+partpath+'"]').addClass('selected');
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
      });
