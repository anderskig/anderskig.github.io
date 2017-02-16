$(window).bind("load", function() {
  /*
   * To account for slow external font loads in Firefox and IE we cannot do positioning until page is fully loaded.
   */
  "use strict";
  var $timeline_bottom = $("#timeline-bottom"),
      $container_timeline = $("#container-timeline"),
      $loader_overlay = $(".loader-overlay");
      $loader_overlay.fadeOut("fast");
   if (matchMedia) {
     var mq = window.matchMedia("(max-width: 800px)");
     mq.addListener(widthChange);
     widthChange(mq);
   }
   // Media query change
   function widthChange(mq) {
     if (mq.matches) {
       // Window width is less than 800px;
       $(".timeline-item.right-if-wide").each(function () {
         var $connector = $(this).children(".timeline-connector").clone();
         $(this).children(".timeline-connector").remove();
         $connector.appendTo($(this));
         positionTimeline(false);
         $(this).removeClass("right").addClass("left");
       });
     } else {
       // Window width is more than 800px
       $(".timeline-item.right-if-wide").each(function () {
         var $connector = $(this).children(".timeline-connector").clone();
         $(this).children(".timeline-connector").remove();
         $connector.prependTo($(this));
         $(this).removeClass("left").addClass("right");
       });
       positionTimeline(true);
     }
   }
  /*
  * Position timeline items
  */
  function positionTimeline(is_wide) {
     var $prev_item = null,
         $second_prev = null,
         second_prev_topval = 0,
         prev_topval = 0,
         items_end_at,
         container_height;
     $(".timeline-item").each( function() {
       var $item = $(this),
           topval = 0;
        if (is_wide) {
         if ($prev_item !== null) {
           if (!$item.hasClass("timeline-padding")) {
             if($second_prev !== null) {
               topval = parseInt($second_prev.height()) +  second_prev_topval;
               if (prev_topval === topval) {
                 topval += 40; // To offset first first right aligned item.
               }
             } else {
               topval = $prev_item.height() + prev_topval;
             }
           } else {
             topval = $prev_item.height() + prev_topval;
           }
         }
       }
       $item.animate({"top": topval}, 100);
       second_prev_topval = prev_topval;
       prev_topval = topval;
       $second_prev = $prev_item;
       $prev_item = $item;
     });
     items_end_at = prev_topval + $prev_item.height();
     if (is_wide) {
       $timeline_bottom.css("bottom","initial").animate({"top": items_end_at}, 100);
       container_height = items_end_at + $timeline_bottom.height();
     } else {
       $timeline_bottom.css("top","initial").animate({"bottom": 0}, 100);
       container_height = "initial";
     }
     $container_timeline.css("height", container_height);
  }
});
