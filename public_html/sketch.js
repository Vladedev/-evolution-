/* global width, height */

var neo = [[]]; // Neurons
var born = 0;
var borns = 0;
var alive = 0;
var death = 0;
var xBorn = 0;
var yBorn = 0;
var xBirth = 0;
var yBirth = 0;
var viMax = 0;
var lifeSpanMax = 0;
var xConn = 0;
var yConn = 0;
var realAlive = 0;
var maxRealAlive = 0;
var added = 0;
var byteLenghtMax = 1;
var xOutInput = 0;
var yOutInput = 0;
var c = 0;
var br3 = 10;

function setup() {
    createCanvas(90, 90);
    background(0, 0, 0);

    var cpuWidth = width / 2;
    var cpuHeight = height / 2;

    for (var i = 1; i <= width; i++) {
        neo[i] = [];
    }
//Initialize Whole Grid 
    for (var rows = 1; rows <= width; rows++) {
        for (var cols = 1; cols <= height; cols++) {
            xBorn = rows;
            yBorn = cols;
            //neo
            neo[xBorn][yBorn] = {
                outputData: [],
                inputData: [],
                cpuData: [],
                dataEating: 50,
                dead: 1,
                lifeSpan: 0,
                vi: 0,
                clock: parseInt(random(10, 250)),
                x: xBorn,
                y: yBorn,
                c1: random(0, 255),
                c2: random(0, 255),
                c3: random(0, 255)
            };

            //resetArrays
            neo[xBorn][yBorn].resetArrays = function (xReset, yReset)
            {
                neo[xReset][yReset].outputData.lenght = 1;
                neo[xReset][yReset].inputData.lenght = 1;
                neo[xReset][yReset].cpuData.lenght = 1;
                neo[xReset][yReset].outputData[0] = 0;
                neo[xReset][yReset].inputData[0] = 0;
                neo[xReset][yReset].cpuData[0] = 0;
            };

            neo[xBorn][yBorn].resetArrays(xBorn, yBorn);


            //display
            neo[xBorn][yBorn].display = function ()
            {
                stroke(this.c1, this.c2, this.c3);
                fill(0, 0, 0, [0]);
                ellipse(this.x, this.y, this.vi / 16384 - neo[xBorn][yBorn].outputData.lenght, this.vi / 16384);
            };

            //getLife
            neo[xBorn][yBorn].getLife = function ()
            {
                this.vi = this.vi - 40 * this.clock;
            };

            //getData
            neo[xBorn][yBorn].getData = function ()
            {
                if (parseInt(random(1, 100)) < 50) {
                    //console.log("Lenght " + neo[xBorn][yBorn].inputData.lenght);
                    var br = 0;
                    while (br < neo[xBorn][yBorn].inputData.lenght)
                    {
                        xConn = parseInt(random(1, cpuWidth));
                        yConn = parseInt(random(1, cpuHeight));
                        var br2 = 0;
                        while (br2 < neo[xConn][yConn].outputData.lenght)
                        {
                            var data = this.bitSum(neo[xConn][yConn].outputData[br2], neo[xBorn][yBorn].inputData[br], added);
                            if (neo[xConn][yConn].outputData[br2] === 1) {
                                //this.connectLine();
                                if (parseInt(random(1, 1000)) < 2) {
                                    br = neo[xBorn][yBorn].inputData.lenght;
                                    br2 = neo[xConn][yConn].outputData.lenght;
                                    this.evolve(xConn, yConn);
                                }
                            }
                            //console.log(data);
                            neo[xConn][yConn].outputData[br2] = data[0];
                            //console.log("O " + neo[xConn][yConn].outputData[br2]);
                            neo[xConn][yConn].inputData[br] = data[1];
                            //console.log("I " + neo[xConn][yConn].inputData[br]);
                            added = data[2];
                            //console.log("A " + added);
                            br2++;

                        }
                        br++;
                    }
                    if (added === 1) {
                        neo[xConn][yConn].outputData[0] = 1;
                        added = 0;
                    }
                } else {
                    neo[xBorn][yBorn].outsideInput();
                }
            };

            //outsideInput
            neo[xBorn][yBorn].outsideInput = function () {
                for (var i = 0; i < neo[xBorn][yBorn].inputData.lenght; i++) {
                    xOutInput = parseInt(random(1, cpuWidth));
                    yOutInput = parseInt(random(cpuHeight + 1, cpuHeight + 10));
                    c = get(xOutInput, yOutInput);
                    if (c[0] !== 0 || c[1] !== 0 || c[2] !== 0) {
                        stroke(this.c1 + 1, this.c2 + 1, this.c3 + 1);
                        point(xOutInput, yOutInput);
                        var data = this.bitSum(1, neo[xBorn][yBorn].inputData[i], added);
                        neo[xBorn][yBorn].inputData[i] = data [1];
                        added = data [2];
                    }
                }
                if (added === 1) {
                    neo[xBorn][yBorn].inputData[0] = 1;
                    added = 0;
                }


            };
            //bitSum
            neo[xBorn][yBorn].bitSum = function (bit1, bit2, added) {
                var added1 = added;
                var b1 = 0;
                var b2 = 0;
                if (added1 === 0) {
                    if ((bit1 === 0 && bit2 === 1) || (bit1 === 1 && bit2 === 0)) {
                        b1 = 0;
                        b2 = 1;
                    }
                    if (bit1 === 1 && bit2 === 1) {
                        b1 = 0;
                        b2 = 0;
                        added1 = 1;
                    }
                } else {
                    if ((bit1 === 0 && bit2 === 1) || (bit1 === 1 && bit2 === 0)) {
                        b1 = 0;
                        b2 = 0;
                    }
                    if (bit1 === 1 && bit2 === 1) {
                        b1 = 0;
                    }
                    if (bit1 === 0 && bit2 === 0) {
                        b2 = 1;
                        added1 = 0;
                    }
                }

                return [b1, b2, added1];
            };
            //connectLine
            neo[xBorn][yBorn].connectLine = function ()
            {
                stroke(this.c1, this.c2, this.c3);
                line(this.x, this.y, xConn, yConn);
            };

            //cpuPrOrNot 1
            neo[xBorn][yBorn].cpuPrOrNot = function ()
            {
                if (parseInt(random(1, 100)) > 20) {
                    this.outputDataToCpuData();
                    this.processCpu();
                }
            };

            //outputDataToCpuData 2.0
            neo[xBorn][yBorn].outputDataToCpuData = function ()
            {
                for (var i = 0; i < neo[xBorn][yBorn].inputData.lenght; i++) {
                    var data = neo[xBorn][yBorn].bitSum(neo[xBorn][yBorn].inputData[i], neo[xBorn][yBorn].cpuData[i], added);
                    neo[xBorn][yBorn].inputData[i] = data[1];
                    neo[xBorn][yBorn].inputData[i] = data[0];
                    added = data[2];
                }
            };
            //processCpu 2.1
            neo[xBorn][yBorn].processCpu = function ()
            {

                if (parseInt(random(1, 100)) > 5)
                {
                    neo[xBorn][yBorn].processBitCpu();
                } else
                {
                    neo[xBorn][yBorn].birth();
                }
            };
            //processBitCpu 3.1
            neo[xBorn][yBorn].processBitCpu = function ()
            {
                if (parseInt(random(1, 100)) > 80) {
                    neo[xBorn][yBorn].processData();
                } else
                {
                    neo[xBorn][yBorn].createData();
                }
            };

            //processData - eating 3.1.1
            neo[xBorn][yBorn].processData = function ()
            {
                if (parseInt(random(1, 1000)) > 50)
                {
                    for (var i = 0; i < neo[xBorn][yBorn].cpuData.lenght; i++) {
                        if (neo[xBorn][yBorn].cpuData[i] === 1) {
                            neo[xBorn][yBorn].vi += neo[xBorn][yBorn].dataEating * (1 + (i + 1) / 100);
                            neo[xBorn][yBorn].cpuData[i] = 0;
                            neo[xBorn][yBorn].getLife();
                        }
                    }
                }// drugs
                else if (parseInt(random(1, 100)) > 5) {
                    for (var i = 0; i < neo[xBorn][yBorn].cpuData.lenght; i++) {
                        if (this.cpuData[i] === 1) {
                            neo[xBorn][yBorn].vi += neo[xBorn][yBorn].dataEating * (1 + (i + 1) / 100) * 5;
                            neo[xBorn][yBorn].cpuData[i] = 0;
                            neo[xBorn][yBorn].getLife();
                            neo[xBorn][yBorn].clock += 9;
                        }
                    }
                } else {
                    for (var i = 0; i < neo[xBorn][yBorn].cpuData.lenght; i++) {
                        if (neo[xBorn][yBorn].cpuData[i] === 1) {
                            neo[xBorn][yBorn].vi += neo[xBorn][yBorn].dataEating * (1 + (i + 1) / 100) * 2;
                            neo[xBorn][yBorn].cpuData[i] = 0;
                            neo[xBorn][yBorn].getLife();
                            neo[xBorn][yBorn].clock += 4.5;
                        }
                    }

                }
            };
            //createData 3.1.2
            neo[xBorn][yBorn].createData = function ()
            {
                for (var i = 0; i < neo[xBorn][yBorn].cpuData.lenght; i++) {
                    if (parseInt(random(1, 100)) > 80) {
                        var data = neo[xBorn][yBorn].bitSum(1, neo[xBorn][yBorn].cpuData[i], added);
                        neo[xBorn][yBorn].cpuData[i] = data[1];
                        added = data[2];
                    } else {
                        var data = neo[xBorn][yBorn].bitSum(0, neo[xBorn][yBorn].cpuData[i], added);
                        neo[xBorn][yBorn].cpuData[i] = data[1];
                        added = data[2];
                    }
                }
                if (added === 1) {
                    neo[xBorn][yBorn].cpuData[0] = 1;
                    //console.log("CPU " + neo[xBorn][yBorn].cpuData);
                    added = 0;
                }
            };

            //birth 3.2.1
            neo[xBorn][yBorn].birth = function ()
            {
                var xBirth = parseInt(random(1, cpuWidth));
                var yBirth = parseInt(random(1, cpuHeight));

                neo[xBirth][yBirth].resetArrays(xBirth, yBirth);
                neo[xBirth][yBirth].outputData.lenght = neo[xBorn][yBorn].outputData.lenght;
                neo[xBirth][yBirth].inputData.lenght = neo[xBorn][yBorn].inputData.lenght;
                neo[xBirth][yBirth].cpuData.lenght = neo[xBorn][yBorn].cpuData.lenght;
                for (var i = 0; i < neo[xBorn][yBorn].outputData.lenght; i++) {
                    neo[xBirth][yBirth].outputData[i] = neo[xBorn][yBorn].outputData[i];
                    neo[xBirth][yBirth].inputData[i] = neo[xBorn][yBorn].inputData[i];
                    neo[xBirth][yBirth].cpuData[i] = neo[xBorn][yBorn].cpuData[i];
                }
                neo[xBirth][yBirth].dataEating = 50;
                neo[xBirth][yBirth].dead = 0;
                neo[xBirth][yBirth].lifeSpan = 0;
                neo[xBirth][yBirth].vi = 65536;
                neo[xBirth][yBirth].clock = parseInt(random(10, 50));
                neo[xBirth][yBirth].x = xBirth;
                neo[xBirth][yBirth].y = yBirth;
                neo[xBirth][yBirth].c1 = parseInt(random(this.c1 - 50, this.c1 + 50));
                neo[xBirth][yBirth].c2 = parseInt(random(this.c2 - 50, this.c2 + 50));
                neo[xBirth][yBirth].c3 = parseInt(random(this.c3 - 50, this.c3 + 50));
                this.vi -= this.vi / 10;
                for (var i = 0; i < neo[xBorn][yBorn].cpuData.lenght; i++) {
                    neo[xBorn][yBorn].cpuData[i] = 0;
                }
                alive++;
                //console.log("born 0");
            };

            //evolve 3.2.2
            neo[xBorn][yBorn].evolve = function (xConn, yConn)
            {
                //console.log("EVO   " + neo[xBorn][yBorn].cpuData.lenght);
                alive--;

                var xEvolve = xConn;
                var yEvolve = yConn;
                neo[xBorn][yBorn].vi += neo[xEvolve][yEvolve].vi;
                neo[xBorn][yBorn].clock += neo[xEvolve][yEvolve].clock;
                neo[xBorn][yBorn].outputData.lenght = neo[xBorn][yBorn].outputData.lenght + neo[xEvolve][yEvolve].inputData.lenght;
                neo[xBorn][yBorn].inputData.lenght = neo[xBorn][yBorn].inputData.lenght + neo[xEvolve][yEvolve].cpuData.lenght;
                neo[xBorn][yBorn].cpuData.lenght = neo[xBorn][yBorn].cpuData.lenght + neo[xEvolve][yEvolve].outputData.lenght;

                //console.log("Input Data  " + neo[xBorn][yBorn].inputData.lenght);
                if (neo[xBorn][yBorn].outputData.lenght > parseInt(random(7, 7))) {
                    neo[xBorn][yBorn].vi = 0;
                    neo[xBorn][yBorn].dead = 1;
                    neo[xBorn][yBorn].resetArrays(xBorn, yBorn);
                } else {
                    for (var i = Math.abs(neo[xBorn][yBorn].inputData.lenght - neo[xEvolve][yEvolve].inputData.lenght); i < neo[xBorn][yBorn].inputData.lenght; i++) {
                        neo[xBorn][yBorn].outputData[i] = neo[xEvolve][yEvolve].outputData[i - Math.abs(neo[xBorn][yBorn].outputData.lenght - neo[xEvolve][yEvolve].outputData.lenght)];
                        neo[xBorn][yBorn].inputData[i] = neo[xEvolve][yEvolve].inputData[i - Math.abs(neo[xBorn][yBorn].inputData.lenght - neo[xEvolve][yEvolve].inputData.lenght)];
                        neo[xBorn][yBorn].cpuData[i] = neo[xEvolve][yEvolve].cpuData[i - Math.abs(neo[xBorn][yBorn].cpuData.lenght - neo[xEvolve][yEvolve].cpuData.lenght)];

                    }

                    neo[xBorn][yBorn].c1 = parseInt(random(neo[xBorn][yBorn].c1, neo[xEvolve][yEvolve].c1));
                    neo[xBorn][yBorn].c2 = parseInt(random(neo[xBorn][yBorn].c2, neo[xEvolve][yEvolve].c2));
                    neo[xBorn][yBorn].c3 = parseInt(random(neo[xBorn][yBorn].c3, neo[xEvolve][yEvolve].c3));
                    neo[xEvolve][yEvolve].dead = 1;
                    neo[xEvolve][yEvolve].resetArrays(xEvolve, yEvolve);
                }
                //console.log("Input Data  " + neo[xBorn][yBorn].inputData);
                //console.log("EVOLVE  " + neo[xBorn][yBorn].inputData.lenght);


            };

            //shareData 4.0
            neo[xBorn][yBorn].shareData = function () {
                if (parseInt(random(1, 100)) < 80) {
                    for (var i = 0; i < neo[xBorn][yBorn].cpuData.lenght; i++) {
                        var data = neo[xBorn][yBorn].bitSum(neo[xBorn][yBorn].cpuData[i], neo[xBorn][yBorn].outputData[i], added);
                        neo[xBorn][yBorn].outputData[i] = data[1];
                        neo[xBorn][yBorn].cpuData[i] = 0;
                        added = data[2];
                    }
                    if (added === 1) {
                        neo[xBorn][yBorn].cpuData[0] = 1;
                        added = 0;
                    }
                }
                //console.log("OUTPUT " + neo[xBorn][yBorn].outputData);
            };

            //printByteLengh
            neo[xBorn][yBorn].printByteLengh = function () {
                if (byteLenghtMax < neo[xBorn][yBorn].cpuData.lenght) {
                    byteLenghtMax = neo[xBorn][yBorn].cpuData.lenght;
                    console.log(byteLenghtMax);
                }
            };

        }
    }
    //displayOutput
    displayOutput = function () {
        stroke(0, 0, 0);
        fill(0, 0, 0);
        rect(1 + cpuWidth, 1 + cpuHeight, cpuWidth + cpuWidth, cpuHeight + cpuHeight);

        for (var i = 1; i <= cpuWidth; i++) {

            for (var j = 1; j <= cpuHeight; j++) {
                if (neo[i][j].dead === 0) {


                    for (var k = 0; k < neo[i][j].outputData.lenght; k++) {
                        if (neo[i][j].outputData[k] === 1) {
                            stroke(neo[i][j].c1, neo[i][j].c2, neo[i][j].c3, 255 - j * 4);
                            point(i + cpuWidth + k, j + cpuHeight - k);
                        } else {
                            stroke(0, 0, 0);
                            point(i + cpuWidth + k, j + cpuHeight - k);

                        }


                    }
                }
            }
        }
    };
}


function draw() {
    cpuWidth = width / 2;
    cpuHeight = height / 2;


    if (alive <= 0) {

        var xBirth = parseInt(random(1, cpuWidth));
        var yBirth = parseInt(random(1, cpuHeight));

        neo[xBirth][yBirth].outputData = [];
        neo[xBirth][yBirth].inputData = [];
        neo[xBirth][yBirth].cpuData = [];
        neo[xBirth][yBirth].dataEating = 50;
        neo[xBirth][yBirth].dead = 0;
        neo[xBirth][yBirth].lifeSpan = 0;
        neo[xBirth][yBirth].vi = 65536;
        neo[xBirth][yBirth].clock = parseInt(random(10, 50));
        neo[xBirth][yBirth].x = xBirth;
        neo[xBirth][yBirth].y = yBirth;
        neo[xBirth][yBirth].c1 = random(0, 255);
        neo[xBirth][yBirth].c2 = random(0, 255);
        neo[xBirth][yBirth].c3 = random(0, 255);
        alive++;
        //console.log("birth 0");
    }

    for (var i = 1; i <= cpuWidth; i++) {
        for (var j = 1; j <= cpuHeight; j++) {
            xBorn = i;
            yBorn = j;

            if (neo[i][j].dead === 0) {
                neo[i][j].getData();
                neo[i][j].cpuPrOrNot();
                neo[i][j].shareData();
                neo[i][j].printByteLengh();

                neo[i][j].getLife();
                neo[i][j].display();


                if (neo[i][j].vi <= 0) {
                    neo[i][j].vi = 0;
                    neo[i][j].dead = 1;
                    neo[i][j].resetArrays(i, j);
                    alive--;
                }

            }

        }
    }
    displayOutput();

//        stroke(250, 0, 250);
//        fill(250, 0, 250);
//        rect(1,cpuHeight+1,cpuWidth,10);       
//        stroke(255, 255, 255);
//        fill(255, 255, 255);
//        rect(3,33,20,5);

    if (mouseIsPressed) {
        if (mouseButton === LEFT) {
            stroke(255, 255, 255);
            point(mouseX, mouseY);
        }
        if (mouseButton === RIGHT) {
            stroke(0, 0, 0);
            point(mouseX, mouseY);
        }
        if (mouseButton === CENTER) {
            triangle(23, 75, 50, 20, 78, 75);
        }
    }

} 