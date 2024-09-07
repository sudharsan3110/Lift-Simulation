// Lift class implementation
class Lift {
    constructor(id) {
        this.id = id;
        this.currentFloor = 0;
        this.isMoving = false;
        this.targetFloor = null;
        this.liftElement = this.createLiftElement();
        this.doorLeft = this.liftElement.querySelector(".door-left");
        this.doorRight = this.liftElement.querySelector(".door-right");
    }

    createLiftElement() {
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
        if (this.isMoving || this.currentFloor === requestedFloorNo) return;

        const numberOfFloorsTravelled = Math.abs(requestedFloorNo - this.currentFloor);
        const liftTravelDuration = numberOfFloorsTravelled * 2500; 

        console.log(`Lift ${this.id}: Moving to floor ${requestedFloorNo}`);
        this.isMoving = true;
        this.targetFloor = requestedFloorNo;
        this.liftElement.dataset.isMoving = "true";
        this.liftElement.style.transform = `translateY(${-100 * requestedFloorNo}px)`;
        this.liftElement.style.transitionDuration = `${liftTravelDuration}ms`;

        setTimeout(() => {
            this.openDoors();
            setTimeout(() => {
                this.closeDoors();
                setTimeout(() => {
                    console.log(`Lift ${this.id}: Arrived at floor ${requestedFloorNo}`);
                    this.currentFloor = requestedFloorNo;
                    this.targetFloor = null;
                    this.isMoving = false;
                    this.liftElement.dataset.isMoving = "false";
                    this.liftElement.dataset.currentFloor = requestedFloorNo.toString();
                    building.checkPendingRequests();
                }, 2500);
            }, 2500);
        }, liftTravelDuration);
    }

    openDoors() {
        console.log(`Lift ${this.id}: Opening doors`);
        this.doorLeft.style.transform = "translateX(-25px)";
        this.doorRight.style.transform = "translateX(25px)";
        this.doorLeft.style.transitionDuration = "2500ms";
        this.doorRight.style.transitionDuration = "2500ms";
    }

    closeDoors() {
        console.log(`Lift ${this.id}: Closing doors`);
        this.doorLeft.style.transform = "translateX(0px)";
        this.doorRight.style.transform = "translateX(0px)";
        this.doorLeft.style.transitionDuration = "2500ms";
        this.doorRight.style.transitionDuration = "2500ms";
    }
}

// Building class implementation
class Building {
    constructor(floorCount, liftCount) {
        this.floorCount = floorCount;
        this.liftCount = liftCount;
        this.buildingElement = document.querySelector("#building");
        this.lifts = [];
        this.pendingRequests = new Set();
        this.renderElement();
    }

    renderElement() {
        this.buildingElement.innerHTML = "";
        for (let i = this.floorCount - 1; i >= 0; i--) {
            const floorDiv = this.createFloorElement(i);
            this.buildingElement.appendChild(floorDiv);
        }

        const liftWrapper = document.createElement("div");
        liftWrapper.classList.add("lift-wrapper");

        for (let j = 0; j < this.liftCount; j++) {
            const lift = new Lift(j);
            this.lifts.push(lift);
            liftWrapper.appendChild(lift.liftElement);
        }

        this.buildingElement.appendChild(liftWrapper);
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
            upButton.addEventListener("click", () => this.handleLiftRequest(floorNumber));
            floorButtonsWrapper.appendChild(upButton);
        }

        if (floorNumber > 0) {
            const downButton = document.createElement("button");
            downButton.id = `down-button${floorNumber}`;
            downButton.classList.add("floor-button");
            downButton.innerText = "down";
            downButton.addEventListener("click", () => this.handleLiftRequest(floorNumber));
            floorButtonsWrapper.appendChild(downButton);
        }

        floorControls.appendChild(floorButtonsWrapper);
        floorDiv.appendChild(floorControls);

        return floorDiv;
    }

    handleLiftRequest(requestedFloorNo) {
        if (this.isFloorBeingServiced(requestedFloorNo)) {
            console.log(`Floor ${requestedFloorNo} is already being serviced or in queue.`);
            return;
        }

        console.log(`New request for floor ${requestedFloorNo}`);
        this.pendingRequests.add(requestedFloorNo);
        this.checkPendingRequests();
    }

    isFloorBeingServiced(floorNo) {
        return this.pendingRequests.has(floorNo) || this.lifts.some(lift => lift.targetFloor === floorNo);
    }

    checkPendingRequests() {
        if (this.pendingRequests.size === 0) return;

        const availableLift = this.findAvailableLift();
        if (!availableLift) {
            console.log("No available lifts at the moment.");
            return;
        }

        const nextFloor = this.pendingRequests.values().next().value;
        this.pendingRequests.delete(nextFloor);
        availableLift.moveToFloor(nextFloor);
    }

    findAvailableLift() {
        return this.lifts.find(lift => !lift.isMoving);
    }
}


let building;

document.addEventListener('DOMContentLoaded', () => {
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
        building = new Building(floorCount, liftCount);
    });
});