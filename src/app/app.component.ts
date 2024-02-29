import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mobileDragAndDrop';
  column: any;
  item: any;
  draggableContainer: any;
  startY = 0;
  endY = 0;
  itemToMove: any;
  initialTop = 0;
  dragging: any;
  applyAfter: any;

  ngOnInit(): void {

    setTimeout(() => {
      this.column = document.getElementById("column");
      this.item = document.querySelectorAll('.item');
      this.draggableContainer = document.getElementById('column');
    },);

    document.addEventListener("touchstart", (e) => {
      const target = e.target as HTMLTextAreaElement;
      if (target.classList.contains("item")) {
        this.startY = e.touches[0] ? e.touches[0].clientY : 0;
        this.itemToMove = target;
        this.initialTop = this.itemToMove.getBoundingClientRect().top + window.scrollY;
        this.itemToMove.classList.add("dragging");
      }
    });

    document.addEventListener("touchend", (e) => {
      this.dragging = document.querySelector(".dragging");
      const endY = e.changedTouches[0] ? e.changedTouches[0].clientY : 0;
      this.dragging.style.transform = '';

      this.applyAfter = this.getNewPosition(this.column, endY);
      this.dragging.classList.remove("dragging");

      if (this.applyAfter !== this.dragging) {
        this.dragging.remove();

        if (this.applyAfter) {
          if (this.applyAfter.direction === "up") {
            this.applyAfter.item.insertAdjacentElement("beforebegin", this.dragging);
          } else {
            this.applyAfter.item.insertAdjacentElement("afterend", this.dragging);
          }
        } else {
          this.column.prepend(this.dragging);
        }
      }
    });

    document.addEventListener("touchmove", (e) => {
      if (this.itemToMove && e.touches[0]) {
        this.dragging = document.querySelector(".dragging");

        if (this.dragging) {
          const deltaY = e.touches[0].clientY - this.startY;
          const currentPosition = this.initialTop + deltaY;
          const containerPosition = this.dragging.parentElement.getBoundingClientRect();
          const topLimit = containerPosition.top;
          const bottomLimit = containerPosition.bottom - this.dragging.clientHeight;

          if (currentPosition >= topLimit && currentPosition <= bottomLimit) {
            this.dragging.style.transform = `translateY(${deltaY}px)`;
          }
        }
      }
    });
  }

  getNewPosition(column: any, posY: any) {
    let closestCard: any = {};
    let closestDistance = Number.POSITIVE_INFINITY;

    for (let dado of Array.from(column.querySelectorAll(".item:not(.dragging)"))) {
      let item: any = dado
      let box = item.getBoundingClientRect();
      let boxCenterY = box.top + box.height / 2;
      let distance = Math.abs(posY - boxCenterY);
      console.log(distance < closestDistance)

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard.item = item;
        closestCard.direction = posY < boxCenterY ? "up" : "down";
      }
    }

    console.log('closestCard ', closestCard)
    return closestCard;
  }
}

