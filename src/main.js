var Lift = /** @class */ (function () {
    function Lift(id) {
        this.id = id;
        this.currentFloor = 0;
        this.isMoving = false;
        this.liftElement = this.createLiftElement();
        this.doorLeft = this.liftElement.querySelector(".door-left");
        this.doorRight = this.liftElement.querySelector(".door-right");
    }
    Lift.prototype.createLiftElement = function () {
        var liftDiv = document.createElement("div");
        liftDiv.classList.add("lift");
        liftDiv.id = "lift".concat(this.id);
        liftDiv.setAttribute("data-current-floor", "0");
        liftDiv.setAttribute("data-is-moving", "false");
        var doorLeft = document.createElement("span");
        var doorRight = document.createElement("span");
        doorLeft.classList.add("door-left", "door");
        doorRight.classList.add("door-right", "door");
        liftDiv.appendChild(doorLeft);
        liftDiv.appendChild(doorRight);
        return liftDiv;
    };
    Lift.prototype.moveToFloor = function (requestedFloorNo) {
        var _this = this;
        var numberOfFloorsTravelled = Math.abs(requestedFloorNo - this.currentFloor);
        var liftTravelDuration = numberOfFloorsTravelled * 3000;
        this.liftElement.setAttribute("style", "transform: translateY(".concat(-100 * requestedFloorNo, "px);transition-duration:").concat(liftTravelDuration, "ms;"));
        this.isMoving = true;
        this.liftElement.dataset.isMoving = "true";
        setTimeout(function () {
            _this.openDoors();
            setTimeout(function () {
                _this.closeDoors();
                setTimeout(function () {
                    _this.isMoving = false;
                    _this.liftElement.dataset.isMoving = "false";
                }, 2500);
            }, 2500);
        }, liftTravelDuration);
        this.currentFloor = requestedFloorNo;
        this.liftElement.dataset.currentFloor = requestedFloorNo.toString();
    };
    Lift.prototype.openDoors = function () {
        this.doorLeft.setAttribute("style", "transform: translateX(-25px);transition-duration:2500ms");
        this.doorRight.setAttribute("style", "transform: translateX(25px);transition-duration:2500ms");
    };
    Lift.prototype.closeDoors = function () {
        this.doorLeft.setAttribute("style", "transform: translateX(0px);transition-duration:2500ms");
        this.doorRight.setAttribute("style", "transform: translateX(0px);transition-duration:2500ms");
    };
    return Lift;
}());
var Building = /** @class */ (function () {
    function Building(floorCount, liftCount) {
        this.floorCount = floorCount;
        this.liftCount = liftCount;
        this.buildingElement = document.querySelector("#building");
        this.lifts = [];
        this.renderElement();
    }
    Building.prototype.renderElement = function () {
        this.buildingElement.innerHTML = "";
        for (var i = 0; i < this.floorCount; i++) {
            var floorDiv = this.createFloorElement(this.floorCount - 1 - i);
            this.buildingElement.appendChild(floorDiv);
        }
        var liftWrapper = document.createElement("div");
        liftWrapper.classList.add("lift-wrapper");
        for (var j = 0; j < this.liftCount; j++) {
            var lift = new Lift(j);
            this.lifts.push(lift);
            liftWrapper.appendChild(lift.liftElement);
        }
        var firstFloor = document.querySelector("#floor0");
        firstFloor.appendChild(liftWrapper);
    };
    Building.prototype.createFloorElement = function (floorNumber) {
        var _this = this;
        var floorDiv = document.createElement("div");
        floorDiv.classList.add("floor");
        floorDiv.id = "floor".concat(floorNumber);
        var floorControls = document.createElement("div");
        floorControls.classList.add("floor-controls");
        var floorNumberDiv = document.createElement("div");
        floorNumberDiv.classList.add("floor-number");
        floorNumberDiv.innerText = "".concat(floorNumber);
        floorControls.appendChild(floorNumberDiv);
        var floorButtonsWrapper = document.createElement("div");
        floorButtonsWrapper.classList.add("floor-buttons-wrapper");
        if (floorNumber < this.floorCount - 1) {
            var upButton = document.createElement("button");
            upButton.classList.add("floor-button");
            upButton.id = "up-button".concat(floorNumber);
            upButton.innerText = "^";
            upButton.addEventListener("click", function (e) { return _this.handleGoingUp(e); });
            floorButtonsWrapper.appendChild(upButton);
        }
        if (floorNumber > 0) {
            var downButton = document.createElement("button");
            downButton.id = "down-button".concat(floorNumber);
            downButton.classList.add("floor-button");
            downButton.innerText = "v";
            downButton.addEventListener("click", function (e) { return _this.handleGoingDown(e); });
            floorButtonsWrapper.appendChild(downButton);
        }
        floorControls.appendChild(floorButtonsWrapper);
        floorDiv.appendChild(floorControls);
        return floorDiv;
    };
    Building.prototype.handleGoingUp = function (e) {
        this.handleLiftRequest(e);
    };
    Building.prototype.handleGoingDown = function (e) {
        this.handleLiftRequest(e);
    };
    Building.prototype.handleLiftRequest = function (e) {
        var requestingFloorDiv = e.target.parentNode.parentNode
            .parentNode;
        var requestedFloorNo = parseInt(requestingFloorDiv.id.split("floor")[1]);
        for (var _i = 0, _a = this.lifts; _i < _a.length; _i++) {
            var lift = _a[_i];
            if (!lift.isMoving) {
                lift.moveToFloor(requestedFloorNo);
                break;
            }
        }
    };
    return Building;
}());
var generateButton = document.querySelector("#generate");
var buildingContainer = document.querySelector("#buildingContainer");
generateButton.addEventListener("click", function () {
    var floorCount = parseInt(document.querySelector("#floorsInput").value);
    var liftCount = parseInt(document.querySelector("#liftsInput").value);
    if (isNaN(floorCount) ||
        isNaN(liftCount) ||
        floorCount < 1 ||
        liftCount < 1) {
        alert("Please enter valid numbers for floors and lifts (minimum 1).");
        return;
    }
    buildingContainer.style.display = "block";
    new Building(floorCount, liftCount);
});
