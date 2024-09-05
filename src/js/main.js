class Lift {
    constructor(id) {
        this.id = id;
        this.currentFloor = 0;
        this.isMoving = false;
        this.liftElement = this.createLiftElement();
        this.doorLeft = this.liftElement.querySelector(".door-left");
        this.doorRight = this.liftElement.querySelector(".door-right");
    }

    createLiftElement(){
        const liftDiv = document.createElement("div");
        liftDiv.classList.add("lift");
        liftDiv.id = `lift${this.id}`;
        liftDiv.setAttribute("data-current-floor", "0");
        liftDiv.setAttribute("data-is-moving", "false");

        const doorLeft = document.createElement("span");
        const doorRight = document.createElement("span");
        doorLeft.classList.add("door-left", "door");
        doorRight.classList.add("door-right", "door");

        liftDiv.appendChild(doorLeft);
        liftDiv.appendChild(doorRight);
        return liftDiv;
    }

    moveToFloor(requestedFloorNo) {
        const numberOfFloorsTravelled = Math.abs(requestedFloorNo - this.currentFloor);
        const liftTravelDuration = numberOfFloorsTravelled * 3000;

        this.liftElement.setAttribute("style", `transform: translateY(${-100 * requestedFloorNo}px);transition-duration:${liftTravelDuration}ms;`);
        this.isMoving = true;
        this.liftElement.dataset.isMoving = "true";

        setTimeout(() => {
            this.openDoors();
            setTimeout(() => {
                this.closeDoors();
                setTimeout(() => {
                    this.isMoving = false;
                    this.liftElement.dataset.isMoving = "false";
                }, 2500);
            }, 2500);
        }, liftTravelDuration);

        this.currentFloor = requestedFloorNo;
        this.liftElement.dataset.currentFloor = requestedFloorNo.toString();
    }

    openDoors() {
        this.doorLeft.setAttribute("style", "transform: translateX(-25px);transition-duration:2500ms");
        this.doorRight.setAttribute("style", "transform: translateX(25px);transition-duration:2500ms");
    }

    closeDoors() {
        this.doorLeft.setAttribute("style", "transform: translateX(0px);transition-duration:2500ms");
        this.doorRight.setAttribute("style", "transform: translateX(0px);transition-duration:2500ms");
    }
}

class Building {
    constructor(floorCount, liftCount) {
        this.floorCount = floorCount;
        this.liftCount = liftCount;
        this.buildingElement = document.querySelector("#building");
        this.lifts = [];
        this.renderElement();
    }

    renderElement() {
        this.buildingElement.innerHTML = "";
        for (let i = 0; i < this.floorCount; i++) {
            const floorDiv = this.createFloorElement(this.floorCount - 1 - i);
            this.buildingElement.appendChild(floorDiv);
        }

        const liftWrapper = document.createElement("div");
        liftWrapper.classList.add("lift-wrapper");

        for (let j = 0; j < this.liftCount; j++) {
            const lift = new Lift(j);
            this.lifts.push(lift);
            liftWrapper.appendChild(lift.liftElement);
        }

        const firstFloor = document.querySelector("#floor0");
        firstFloor.appendChild(liftWrapper);
    }

    createFloorElement(floorNumber) {
        const floorDiv = document.createElement("div");
        floorDiv.classList.add("floor");
        floorDiv.id = `floor${floorNumber}`;

        const floorControls = document.createElement("div");
        floorControls.classList.add("floor-controls");

        const floorNumberDiv = document.createElement("div");
        floorNumberDiv.classList.add("floor-number");
        floorNumberDiv.innerText = `${floorNumber}`;
        floorControls.appendChild(floorNumberDiv);

        const floorButtonsWrapper = document.createElement("div");
        floorButtonsWrapper.classList.add("floor-buttons-wrapper");

        if (floorNumber < this.floorCount - 1) {
            const upButton = document.createElement("button");
            upButton.classList.add("floor-button");
            upButton.id = `up-button${floorNumber}`;
            upButton.innerText = "up";
            upButton.addEventListener("click", (e) => this.handleGoingUp(e));
            floorButtonsWrapper.appendChild(upButton);
        }

        if (floorNumber > 0) {
            const downButton = document.createElement("button");
            downButton.id = `down-button${floorNumber}`;
            downButton.classList.add("floor-button");
            downButton.innerText = "down";
            downButton.addEventListener("click", (e) => this.handleGoingDown(e));
            floorButtonsWrapper.appendChild(downButton);
        }

        floorControls.appendChild(floorButtonsWrapper);
        floorDiv.appendChild(floorControls);

        return floorDiv;
    }

    handleGoingUp(e) {
        this.handleLiftRequest(e);
    }

    handleGoingDown(e) {
        this.handleLiftRequest(e);
    }

    handleLiftRequest(e) {
        const requestingFloorDiv = e.target.parentNode.parentNode.parentNode;
        const requestedFloorNo = parseInt(requestingFloorDiv.id.split("floor")[1]);

        for (const lift of this.lifts) {
            if (!lift.isMoving) {
                lift.moveToFloor(requestedFloorNo);
                break;
            }
        }
    }
}

const generateButton = document.querySelector("#generate");
const buildingContainer = document.querySelector("#buildingContainer");

generateButton.addEventListener("click", () => {
    const floorCount = parseInt(document.querySelector("#floorsInput").value);
    const liftCount = parseInt(document.querySelector("#liftsInput").value);

    if (isNaN(floorCount) || isNaN(liftCount) || floorCount < 1 || liftCount < 1) {
        alert("Please enter valid numbers for floors and lifts (minimum 1).");
        return;
    }

    buildingContainer.style.display = "block";
    new Building(floorCount, liftCount);
});
