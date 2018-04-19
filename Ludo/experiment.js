var mySceneTLX;        
var mySceneTLY;        
var mySceneBRX;        
var mySceneBRY;        
var mySceneW;          
var mySceneH;          
var myCenterX;         
var myCenterY;

var board,circle,die, textHeading = [], numHead = [];
var startX = [], startY = [], numbers = [], lines = [];
var count =0, remCount, numres = [], numcount = [], tempNumres;
var loadedNumbers = 0,font;
var diceNumber, tc=0,dc=0;
var exptType="Compute";
var quizCircle = [], quizres = [],sc,speed,dice;

function initialiseScene()
{
    mySceneTLX = -10.0;
    mySceneTLY = 10.0;
    mySceneBRX = 10.0;
    mySceneBRY = -10.0;
    mySceneW   = (mySceneBRX - mySceneTLX);
    mySceneH   = (mySceneTLY - mySceneBRY);
    myCenterX  = (mySceneTLX + mySceneBRX) / 2.0;
    myCenterY  = (mySceneTLY + mySceneBRY) / 2.0;
    myCenterZ  = -5.0;

    PIEscene.background=new THREE.Color( 0xbfd1e5 );
    PIEscene.add(new THREE.AmbientLight(0x606060));

    raycaster = new THREE.Raycaster();
    document.addEventListener('mousedown', ondocmousedown, false);
    document.getElementById(">>").addEventListener("click", speedUp);
    document.getElementById("<<").addEventListener("click", speedDown);

    speed = 1;
}

function speedUp()
{
    if(speed!=4)
    {
        speed = speed * 2;
       
        if(speed <= 0.125)
            sc = 0.05;
        else if(speed <= 0.25)
            sc = 0.07;
        else if(speed <= 0.5)
            sc = 0.09;
        else if(parseInt(speed) == 1)
            sc = 0.1;
        else if(parseInt(speed)==2)
            sc = 0.2;
        else if(parseInt(speed) == 4)
            sc = 0.25;

    }
}

function speedDown()
{
    if(speed!=0.125)
    {
        speed = speed / 2;
       
        if(speed <= 0.125)
            sc = 0.05;
        else if(speed <= 0.25)
            sc = 0.07;
        else if(speed <= 0.5)
            sc = 0.1;
        else if(parseInt(speed) == 1)
            sc = 0.2;
        else if(parseInt(speed)==2)
            sc = 0.5;
        else if(parseInt(speed) == 4)
            sc = 1;

    }
}

function getGeometry(data, size)
{
    geometry = new THREE.TextGeometry(data, {
            font : font,
            size : size ,
            height : 0.01,
            curveSegments : 3
    });
    return geometry;
}

function setControlPanel()
{
    PIEaddDualCommand("Learn Steps",compute);
    PIEaddDualCommand("Quiz me",quiz);
    PIEaddDualCommand("Roll Dice",rotate);
}

function rotate()
{
    
    if(exptType == "Compute")
    {
        diceNumber = Math.floor((Math.random() * 6)) + 1;
        if(count+diceNumber >56)
            diceNumber = 56 - count;
        tc = 0;
        exptType = "Rollc";
    }
    
}

function compute()
{
    resetExperiment();
}

function change(bool)
{
    textHeading[0].visible = bool;
    textHeading[1].visible = bool;
    numres[0].visible = bool;
    numres[1].visible = bool;
    
    var z;
    var z = myCenterZ+0.1;
    if(bool !=false)
    {
        exptType = "Compute";
        count = 0;
    }
    else
    {
        z = myCenterZ;
        exptType = "Quiz";
        diceNumber = Math.floor((Math.random() * 6)) + 1;
        count = Math.floor((Math.random() * 44)) + 1;
    }

    for (var i = 0; i < numcount.length; i++)
            numcount[i].visible = bool;

    for(var i = 1; i<= 56; i++)
    {
        var x = numbers[i].position.x;
        var y = numbers[i].position.y;
        numbers[i].position.set(x,y,z);
    }
    
    if(quizCircle)
    {
        var tbool = bool==true? false : true;
        for(var i=0; i<quizCircle.length; i++)
            quizCircle[i].visible = tbool;
    }
    
    circle.position.set(startX[count], startY[count], myCenterZ+1);

    for(var i=0; i<6; i++)
        numHead[i].visible = bool;

    for(var i=0; i<=6 ;i++)
        lines[i].visible = bool;
}

function quiz()
{
    PIEstopAnimation();
    change(false);

    tc=0;

    if(quizCircle.length!=57)
    {
        for(var i=0; i<=56; i++)
        {
            geometry = new THREE.CircleGeometry(0.5,64);
            material = new THREE.MeshBasicMaterial({color : 0xC0C0C0});
            quizCircle[i] = new THREE.Mesh(geometry, material);
            quizCircle[i].position.set(startX[i], startY[i], myCenterZ+0.9);
            quizCircle[i].name = i;
            PIEaddElement(quizCircle[i]);
        }
    }
    exptType = "Rollq";
    PIEstartAnimation();
}

function loadExperimentElements()
{

    PIEsetExperimentTitle("Counting with Ludo");
    PIEsetDeveloperName("Dattatreya Sarma");

    initialiseScene();
    initialiseHelp();
    initialiseInfo();
    setControlPanel();


    loader = new THREE.FontLoader();
    loader.load("fonts/optimer.json", function(response){
        font = response;  
    });   

    geometry = new THREE.BoxGeometry(20,20, 0.1);
    var texture = new THREE.TextureLoader().load('images/board.png');
    material = new THREE.MeshBasicMaterial({map: texture});
    board = new THREE.Mesh(geometry, material);
    board.visible = true;
    board.position.set(myCenterX, myCenterY, myCenterZ);
    PIEaddElement(board);

    matl = [];
    for (var i=0; i<6; i++)
    {
      var path  = "images/"+(i+1)+'.png';
      var texture = new THREE.TextureLoader().load(path);
      material = new THREE.MeshBasicMaterial({map: texture});
      matl.push(material);
    }

    geometry = new THREE.BoxGeometry(2.5,2.5,2.5);
    dice = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( matl ));
    dice.visible = true;
    dice.position.set(myCenterX+15, myCenterY-5, myCenterZ);
    PIEaddElement(dice);

    angleX[5] = 0;  angleX[2] = 0; angleX[6] = 0; angleX[1] = 0;
    angleY[5] = 0;  angleY[2] = 1; angleY[6] = 2.7; angleY[1] = 4.5;
    angleZ[5] = 0;  angleZ[2] = 0; angleZ[6] = 0; angleZ[1] = 0;

    angleX[3] = -4.6;  angleX[4] = -1.6;
    angleY[3] = 4.5;  angleY[4] = 4.5;
    angleZ[3] = 0.35;  angleZ[4] = 0;    


    circle = new THREE.Object3D();
    cle = new THREE.Mesh(new THREE.CircleGeometry(0.5, 64), new THREE.MeshBasicMaterial({color : 0x00FF00}));
    circle.add(cle);
    geometry = new THREE.CircleGeometry(0.5,64);
    geometry.vertices.shift();
    var circleoutline = new THREE.Line(geometry, new THREE.MeshBasicMaterial({color : 0x000000}));
    circle.add(circleoutline);
    PIEaddElement(circle);

    startX[0] = myCenterX-1.3;
    startY[0] = myCenterY-2.6 - (1.3*4);

    for(var i=1; i<=56; i++)
    {
        if(i<5)
        {
            startX[i] = startX[0];
            startY[i] = startY[i-1]+1.3;
        }
        else if(i<=10)
        {
            startX[i] = startX[i-1] -1.3;
            startY[i] = startY[4] + 1.3;
        }
        else if(i<=12)
        {
            startX[i] = startX[i-1];
            startY[i] = startY[i-1]+1.3;
        }
        else if(i<=17)
        {
            startX[i] = startX[i-1]+1.3;
            startY[i] = startY[12];
        }
        else if(i<=23)
        {
            startX[i] = startX[17]+1.3;
            startY[i] = startY[i-1] + 1.3;
        }
        else if(i<=25)
        {
            startX[i] = startX[i-1] + 1.3;
            startY[i] = startY[23];
        }
        else if(i<=30)
        {
            startX[i] = startX[25];
            startY[i] = startY[i-1] - 1.3;
        }
        else if(i<=36)
        {
            startX[i] = startX[i-1]+1.3;
            startY[i] = startY[30] - 1.3;
        }
        else if(i<=38)
        {
            startX[i] = startX[36];
            startY[i] = startY[i-1] - 1.3;
        }
        else if(i<=43)
        {
            startX[i] = startX[i-1]-1.3;
            startY[i] = startY[38];
        }
        else if(i<=49)
        {
            startX[i] = startX[43]-1.3;
            startY[i] = startY[i-1]-1.3;
        }
        else if(i==50)
        {
            startX[i] = startX[i-1]-1.3;
            startY[i] = startY[49];
        }
        else if(i<=56)
        {
            startX[i] = startX[50];
            startY[i] = startY[i-1]+1.3;
        }
    }
    circle.position.set(startX[0], startY[0], myCenterZ+1);
    resetExperiment();

    PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);  

}

function resetExperiment()
{
    PIEstopAnimation();
    count = 0;
    if(exptType !="Compute")
        change(true);
    exptType = "Compute";
    if(numres[0])
    {
        PIEremoveElement(numres[0]);
    }

    if(quizCircle)
    {
        for(var i=0; i<quizCircle.length; i++)
            quizCircle[i].visible = false;
    }

    sc = 0.2;

    circle.position.set(startX[0], startY[0], myCenterZ+1);
    dice.rotation.set(0, 0, 0);
    dice.position.set(myCenterX+15, myCenterY-5, myCenterZ);
    PIEstartAnimation();
}
var addedHeadings = 0;
var angleX = [], angleY =[], angleZ = [];
function updateExperimentElements(t, dt)
{
    
    if(font && loadedNumbers==0)
        addNumbers(startX, startY);
    if(loadedNumbers && !addedHeadings)
        addHeadings();

    if(addedHeadings && (exptType == "Rollc" || exptType == "Rollq"))
    {
            if(diceNumber == 3 || diceNumber == 4)
                  dice.rotateX(0.1);
            else
                dice.rotateY(-0.1); 
            dice.rotateZ(-0.1); 
            tc = tc + 0.1;

            var x = dice.position.x;
            var y = dice.position.y;
            var z = dice.position.z;

            dice.position.set(x+0.03,y+0.027,z);

            if(parseInt(tc) == 10)
            {
                dice.rotation.set(0,0,0);
                dice.rotateX(angleX[diceNumber]);
                dice.rotateY(angleY[diceNumber]);
                dice.rotateZ(angleZ[diceNumber]);

                if(exptType == "Rollq")
                {
                    exptType = "Quiz";

                }
                else
                {
                    exptType = "Compute";
                    move();
                }
            }
    }
    if(addedHeadings && tempNumres && exptType!="Quiz")
    {

        if(parseInt(tc) == 10)
        {
            if(dc<= diceNumber)
            {
                geometry = getGeometry(count, 0.5);
                material = new THREE.MeshBasicMaterial({color:0x000000});
                numcount[dc] = new THREE.Mesh(geometry, material);
                numcount[dc].position.set(myCenterX-21+dc-0.25, startY[10]+1, myCenterZ);
                PIEaddElement(numcount[dc]);
                dc++;

                circle.position.set(startX[count], startY[count], myCenterZ+1);

                count++;
                tc = 0;
            }
            if(dc > diceNumber)
            {
                if(parseInt(tc) == 10)
                {
                    for(i=0; i<=dc; i++)
                        PIEremoveElement(numcount[i]);

                    dice.rotation.set(0,0,0);
                    dice.position.set(myCenterX+15, myCenterY-5, myCenterZ);

                    PIEremoveElement(numres[0]);
                    PIEremoveElement(numres[1]);

                    count--;

                    geometry = getGeometry(count, 0.5);
                    material = new THREE.MeshBasicMaterial({color:0x000000});
                    numres[0] = new THREE.Mesh(geometry, material);
                    numres[0].position.set(myCenterX-16, startY[20], myCenterZ);
                    PIEaddElement(numres[0]);

                    tempNumres = 0;
                    dc = diceNumber+5;

                    if(count == 56)
                        PIEstopAnimation();
                }
            }
        }
        if(dc<= diceNumber+1)
            tc = tc+sc;

        
    }
    else if (exptType == "Result")
    {
        if(parseInt(tc) == 10)
        {
            quizres[0].visible = false;
            quizres[1].visible = false;
            dice.rotation.set(0,0,0);
            dice.position.set(myCenterX+15, myCenterY-5, myCenterZ);
            quiz();
            exptType == "Quiz";
        }
        tc = tc+0.1;
        
    }

    
}

function addHeadings()
{
    geometry = getGeometry("Present Number :",0.5);
    material = new THREE.MeshBasicMaterial({color:0x000000});

    textHeading[0] = new THREE.Mesh(geometry, material);
    material = new THREE.MeshBasicMaterial({color:0x000000});
    textHeading[0].position.set(myCenterX-22, startY[20], myCenterZ);
    PIEaddElement(textHeading[0]);

    geometry = getGeometry("Number on Dice :",0.5);
    material = new THREE.MeshBasicMaterial({color:0x000000});
    textHeading[1] = new THREE.Mesh(geometry, material);
    textHeading[1].position.set(myCenterX-22, startY[19], myCenterZ);
    PIEaddElement(textHeading[1]);

    geometry = new THREE.BoxGeometry(8,0.05,0.1);
    material = new THREE.MeshBasicMaterial({color:0x000000});
    lines[0] = new THREE.Mesh(geometry, material);
    lines[0].position.set(myCenterX-18, startY[10], myCenterZ);
    PIEaddElement(lines[0]);

    for(var i=1; i<=6; i++)
    {
        geometry = new THREE.BoxGeometry(0.05,1,0.1);
        material = new THREE.MeshBasicMaterial({color:0x000000});
        lines[i] = new THREE.Mesh(geometry, material);
        lines[i].position.set(myCenterX-21+i, startY[10], myCenterZ);
        PIEaddElement(lines[i]);

        geometry = getGeometry(i, 0.5);
        material = new THREE.MeshBasicMaterial({color:0x000000});
        numHead[i-1] = new THREE.Mesh(geometry, material);
        numHead[i-1].position.set(myCenterX-21+i-0.25, startY[10]-1.1, myCenterZ);
        PIEaddElement(numHead[i-1]);
    }

    geometry = getGeometry(count, 0.5);
    material = new THREE.MeshBasicMaterial({color:0x000000});
    numres[0] = new THREE.Mesh(geometry, material);
    numres[0].position.set(myCenterX-16, startY[20], myCenterZ);
    PIEaddElement(numres[0]);

    geometry = getGeometry("", 0.5);
    material = new THREE.MeshBasicMaterial({color:0x000000});
    numres[1] = new THREE.Mesh(geometry, material);
    numres[1].position.set(myCenterX-16, startY[19], myCenterZ);
    PIEaddElement(numres[1]);

    geometry = getGeometry("Correct",1);
    material = new THREE.MeshBasicMaterial({color : 0x00FF00});
    quizres[0] = new THREE.Mesh(geometry, material);
    quizres[0].visible = false;
    quizres[0].position.set(myCenterX-16, startY[10], myCenterZ);
    PIEaddElement(quizres[0]);

    geometry = getGeometry("Wrong",1);
    material = new THREE.MeshBasicMaterial({color : 0xff0000});
    quizres[1] = new THREE.Mesh(geometry, material);
    quizres[1].visible = false;
    quizres[1].position.set(myCenterX-17, startY[10], myCenterZ);
    PIEaddElement(quizres[1]);

    addedHeadings = 1;

}
function addNumbers(startX, startY)
{
    
    for(i=1;i<=56;i++)
    {
        geometry = getGeometry(i,0.35);
        material = new THREE.MeshBasicMaterial({color:0x000000});
        numbers[i]= new THREE.Mesh(geometry, material);
        if(i>=10 && i<=13)
            numbers[i].position.set(startX[i]-0.38, startY[i]-0.25, myCenterZ+0.1);
        else
            numbers[i].position.set(startX[i]-0.3, startY[i]-0.25, myCenterZ+0.1);
        PIEaddElement(numbers[i]);
    }
    loadedNumbers = 1;
}

function move()
{

    geometry = getGeometry(diceNumber, 0.5);
    material = new THREE.MeshBasicMaterial({color:0x000000});
    numres[1] = new THREE.Mesh(geometry, material);
    numres[1].position.set(myCenterX-16, startY[19], myCenterZ);
    PIEaddElement(numres[1]);

    tempNumres = 1;
    tc=0;
    dc = 0;
    
}

function ondocmousedown(event)
{
    event.preventDefault();

    raycaster.setFromCamera(PIEmouseP, PIEcamera);

    intersects = raycaster.intersectObjects(quizCircle);
    if(intersects.length)
    {
        var intersection = intersects[0],
        obj = intersection.object;
        if(obj.name == count+diceNumber)
        {
            quizres[0].visible = true;
        }
        else
            quizres[1].visible = true;
        tc = 0;
        exptType = "Result";
    }
}

var helpContent;
function initialiseHelp(){
    helpContent="";
    helpContent = helpContent + "<h2>Counting with Ludo</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "<p>Top right corner contains a control panel with 3 buttons.</p>";
    helpContent = helpContent + "Learn Steps explains you to count the numbers using Ludo<br>";
    helpContent = helpContent + "Quiz me tests your understanding of the Concept by asking to 'Click' the correct blank circle where the original circle should move according to the number in the Dice.<br>";
    helpContent = helpContent + "Roll Dice is used to roll the dice for getting a new value";
    helpContent = helpContent + "<p>You can pause and resume the animation by using the pause/play nutton on the top line</p>";
    helpContent = helpContent + "<p>You can slow down and speed up the animation by using the speed control buttons</p>";
    helpContent = helpContent + "<p>The round button is for resetting the animation.</p>";
    helpContent = helpContent + "<h3>Note:</h3>Please click 'Roll Dice' only if the step (procedure) is fully completed !!"
    helpContent = helpContent + "<h2>Happy Experimenting</h2>";
    PIEupdateHelp(helpContent);
}

var infoContent;
function initialiseInfo(){
    infoContent =  "";
    infoContent = infoContent + "<h2>Experiment Concepts</h2>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<h4>Ludo Board</h4>";
    infoContent = infoContent + "<p>A ludo board consists of 4 colors each with 4 objects. Each object should start from its origin and travel the whole board and finally should visit the 'home' of their group (Ex: Red goes to Red home)</p>";
    infoContent = infoContent +" <h4>Counting with Ludo</h4>";
    infoContent = infoContent + "<p>Similar to the game, a single object (green group) will travel its journey by moving step by step (counting steps) according to the values from the dice.</p>";
    infoContent = infoContent + "<p>Present Number shows the current position of the object</p>";
    infoContent = infoContent + "<p>Number on dice shows the number appeared after rolling the dice (by clicking the roll dice button)</p>";
    infoContent = infoContent + "<p>Number line is used to count the numbers from current position according to the dice value. Parallely circle (object) will move from one place to another.</p>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
    PIEupdateInfo(infoContent);
}