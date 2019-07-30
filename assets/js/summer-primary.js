//Video Handler
  var wcdVideoHandler = function(iframe, vimeoid, embed) {
      this.iframe = jQuery(iframe);
      this.vidContainer = jQuery(iframe).parent().parent();
      this.closeButton = this.vidContainer.find('.videoclosebutton');
      this.poster = jQuery(iframe).parent().parent().children('.videoposter');
      this.player = null;
      this.eventName = jQuery(iframe).data('tid');
      this.src = 'https://player.vimeo.com/video/' + vimeoid;
      this.playing = false;
      this.openedOnce = false;

      if(iframe.indexOf('popup') > -1){this.popup = this.vidContainer.parent()}

      var that = this;

      this.play = function() {
          that.player.play();
          that.poster.hide()
      }, this.pause = function() {
          that.player.pause()
      }, this.openvideo = function() {
        if(typeof(that.popup) != "undefined"){that.popup.show()};
          if (!that.openedOnce) {
              that.iframe.attr('src', this.src);
              that.player = new Vimeo.Player(that.iframe);
              that.eventhandlers();
              setTimeout(function() {
                  that.play();
                  that.openedOnce = true;
              }, 500)
          } else that.play()

          that.closeButton.show();
      }, this.stop = function() {
        if(typeof(that.popup) != "undefined"){that.popup.hide()};
          that.pause();
          that.poster.show();
          that.closeButton.hide();
          that.player.unload()
      }, this.eventhandlers = function() {
          jQuery(document).keyup(function(e) {
              if (e.keyCode == 27) {
                  that.stop()
              }
          });
          that.player.on("play", function() {
              sendToOmni(wcdLib.pageDataLayer.page_name, that.eventName);
              that.playing = true;
          });
          that.player.on("pause", function() {
              that.playing = false;
          });
          that.player.on("ended", function() {
              that.stop();
              console.log('ended')
          });
          jQuery('body').click(function(e) {
              if (that.vidContainer.has(e.target).length === 0 && !jQuery(e.target.parentElement).hasClass('openvideo')) {
                  that.stop()
              }
          });
          that.vidContainer.click(function(e) {
              if (jQuery(e.target).hasClass('videoclosebutton')) {
                  that.stop()
              }
          })
      };
      that.poster.click(function() {
          that.openvideo();
      })
  };


//Primary JS

  var summer_video_popup;
  var rellax;
  jQuery(document).ready(function() {
    jQuery('[data-scroll]').on('click', scrollToSection);
    /* construct video embeds */
    summer_video_popup = new wcdVideoHandler(".summer--video-popup .summer--video .videoplayer", "266386093");
    var summer_video_embed_01 = new wcdVideoHandler(".img2 .summer--video .videoplayer", "266387055");
    var summer_video_embed_02 = new wcdVideoHandler(".summer--video-mobile .summer--video .videoplayer", "266386093");
    wcd_summer_nav.init();
    /* construct parallax for all elements with rellax class */
    if(!/Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.outerWidth >= 1024) {
      rellax = new Rellax('.rellax', {center: true});
    }
  });

  /* sticky nav */
  var wcd_summer_nav = {
    scrollInterval : null,
    resizeInterval : null,

    resizeFunction : function (){

      wcd_summer_nav.hdrHeight = Math.floor(jQuery(".lp--top-content").outerHeight() + jQuery(".lp--top-content").offset().top);
      wcd_summer_nav.section1Limit = Math.floor(jQuery("#section1").offset().top);
      wcd_summer_nav.section2Limit = Math.floor(jQuery("#section2").offset().top - window.innerHeight/3);
      wcd_summer_nav.section3Limit = Math.floor(jQuery("#section3").offset().top - window.innerHeight/3);
      wcd_summer_nav.section4Limit = Math.floor(jQuery("#section4").offset().top - window.innerHeight/3);
      wcd_summer_nav.section5Limit = Math.floor(jQuery("#section5").offset().top - window.innerHeight/3);

      wcd_summer_nav.bottomLimit = Math.floor(jQuery("#bottom-nav-section").offset().top - jQuery("#bottom-nav-section").outerHeight());

      if(typeof(rellax) != "undefined")rellax.refresh();

    },

    scrollFunction : function(navBar, navBarItems, $view, activeIdx){
      if($view.scrollTop() > wcd_summer_nav.bottomLimit){
        navBar.fadeOut();
      }else if( $view.scrollTop() > wcd_summer_nav.hdrHeight) {
        navBar.fadeIn()
          navBar.addClass("navScrolled");

          navBarItems.removeClass("active-section");

          if($view.scrollTop() >= wcd_summer_nav.section5Limit){
            activeIdx = 4;
          }else if($view.scrollTop() >= wcd_summer_nav.section4Limit){
            activeIdx = 3;
          }else if($view.scrollTop() >= wcd_summer_nav.section3Limit){
            activeIdx = 2;
          }else if($view.scrollTop() >= wcd_summer_nav.section2Limit){
            activeIdx = 1;
          }else if($view.scrollTop() >= wcd_summer_nav.section1Limit){
            activeIdx = 0;
          }

          navBarItems[activeIdx].className = "active-section";
      } else {
          navBar.removeClass("navScrolled");
          navBarItems.removeClass("active-section");
      }
    },

    init : function(){
      var windowScrolling = false,
        windowResize = false,
        navBar = jQuery(".sticky-navmenu"),
        navBarItems = jQuery(".sticky-navmenu ul li"),
        $view = jQuery(window),
        activeIdx = 0;

      wcd_summer_nav.resizeFunction();
      wcd_summer_nav.scrollFunction(navBar, navBarItems, $view, activeIdx);

      $view.resize(function() { windowResize = true });
      $view.scroll(function() { windowScrolling = true });

      wcd_summer_nav.resizeInterval = setInterval ( function() {
        if(windowResize || windowScrolling){
          windowResize = false;

          wcd_summer_nav.resizeFunction();

        }
      }, 200);

      wcd_summer_nav.scrollInterval = setInterval ( function() { 
        if(windowScrolling){
          windowScrolling = false;

          wcd_summer_nav.scrollFunction(navBar, navBarItems, $view, activeIdx);

        }
      }, 50);
    },
  }

  /* scroll To Section */
  function scrollToSection(event) {
      event.preventDefault();
      var $section = jQuery("#"+jQuery(this).attr('data-scroll'));
      var offsetTop = Math.floor($section.offset().top);
      jQuery('html, body').animate({
        scrollTop: offsetTop
      }, 1000);
   }

