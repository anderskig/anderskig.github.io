"use strict";

const TimeLine = {
  timelineBottom: null,
  containerTimeline: null,

  /**
   * Handle window resizing
   * @param {MediaQueryList} mq
   */
  widthChange(mq) {
    const items = Array.from(
      document.querySelectorAll(".timeline-item.right-if-wide")
    );
    if (mq.matches) {
      // Window width is less than 800px;
      items.forEach(item => {
        const oldConnector = item.querySelector(".timeline-connector");
        const newConnector = oldConnector.cloneNode(true);
        oldConnector.parentNode.removeChild(oldConnector);
        item.appendChild(newConnector);
        item.classList.remove("right");
        item.classList.add("left");
      });
      this.positionTimeline(false);
    } else {
      // Window width is more than 800px
      items.forEach(item => {
        const oldConnector = item.querySelector(".timeline-connector");
        const newConnector = oldConnector.cloneNode(true);
        oldConnector.parentNode.removeChild(oldConnector);
        item.prepend(newConnector);
        item.classList.remove("left");
        item.classList.add("right");
      });
      this.positionTimeline(true);
    }
  },

  /**
   * Positions timeline items
   * @param {boolean} isWide - window is wide or not.
   */
  positionTimeline(isWide) {
    let prevItem = null;
    let secondPrev = null;
    let secondPrevTopval = 0;
    let prevTopval = 0;
    const items = Array.from(document.querySelectorAll(".timeline-item"));

    items.forEach(item => {
      let topval = 0;
      if (isWide) {
        if (prevItem !== null) {
          if (!item.classList.contains("timeline-padding")) {
            if (secondPrev !== null) {
              topval = parseInt(secondPrev.getBoundingClientRect().height, 10) + secondPrevTopval;
              if (prevTopval === topval) {
                topval += 40; // To offset first first right aligned item.
              }
            } else {
              topval = prevItem.getBoundingClientRect().height + prevTopval;
            }
          } else {
            topval = prevItem.getBoundingClientRect().height + prevTopval;
          }
        }
      }

      item.style.top = topval + 'px';
      secondPrevTopval = prevTopval;
      prevTopval = topval;
      secondPrev = prevItem;
      prevItem = item;
    });
    const itemsEndAt = prevTopval + prevItem.getBoundingClientRect().height;
    let containerHeight;
    if (isWide) {
      this.timelineBottom.style.bottom = "initial";
      this.timelineBottom.style.top = itemsEndAt + "px";
      containerHeight =
        itemsEndAt + this.timelineBottom.getBoundingClientRect().height + "px";
    } else {
      this.timelineBottom.style.top = "initial";
      this.timelineBottom.style.bottom = "0px";
      containerHeight = "initial";
    }
    this.containerTimeline.style.height = containerHeight;
  },


  initialize() {
    this.containerTimeline = document.getElementById("container-timeline");
    this.timelineBottom = document.getElementById("timeline-bottom");
    document.querySelector(".loader-overlay").classList.add("hide");

    if (window.matchMedia) {
      const mq = window.matchMedia("(max-width: 800px)");
      mq.addListener(this.widthChange.bind(this));
      this.widthChange(mq);
    }
  }
}

/**
 * To account for slow external font loads in Firefox and IE we cannot do positioning until page is fully loaded.
 */
window.addEventListener("load", TimeLine.initialize.bind(TimeLine));


