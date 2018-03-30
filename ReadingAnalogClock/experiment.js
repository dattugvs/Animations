var mySceneTLX;
var mySceneTLY;
var mySceneBRX;
var mySceneBRY;
var mySceneW;
var mySceneH;
var myCenterX;
var myCenterY;

var arr = [],
    angle = 0;
var lines = [],
    dots = [];
var numbers = [],
    numbersX = [],
    numbersY = [];
var font, pivot1;
var numbersLoaded = 0;
var h = -1,
    m = -1,
    s = -1;
var hours, minutes, seconds;
var hoursHand, minutesHand, secondsHand;
var timeNumbers = [],
    circles = [];
var hh, mm, ss;
var hhResult, mmResult, ssResult, s1, s2;
var minutesCount, secondsCount;
var addedHeadings = 0,
    addedTimeNumbers = 0;
var addedHours = 0,
    addedMinutes = 0,
    addedSeconds = 0,
    addedSeperators = 0,
    addedOptions = 0;
var speed, mc, hc = 0;
var removedMinutes = 0,
    removedSeconds = 0,
    removedHours = 0;
var timeNumbersIndices = [],index1;
var exptType;
var options = [], optionsBox = [], optionsCircle = [], optionsText = [];
var correctOption;
var headings = [];
var countFlag = -1;
var ResultText;
function initialiseScene()
{
    mySceneTLX = -20.0;
    mySceneTLY = 20.0;
    mySceneBRX = 20.0;
    mySceneBRY = -20.0;
    mySceneW = (mySceneBRX - mySceneTLX);
    mySceneH = (mySceneTLY - mySceneBRY);
    myCenterX = (mySceneTLX + mySceneBRX) / 2.0;
    myCenterY = (mySceneTLY + mySceneBRY) / 2.0;
    myCenterZ = -2.0;

    PIEscene.background = new THREE.Color(0xffffff);
    PIEscene.add(new THREE.AmbientLight(0x606060));

    speed = 1;
    mc = 0.2;
    raycaster = new THREE.Raycaster();
    document.addEventListener('mousedown', ondocmousedown, false);
    document.getElementById(">>").addEventListener("click", speedUp);
    document.getElementById("<<").addEventListener("click", speedDown);
}

function initialiseOtherVariables()
{
    addedOptions = 0;
    addedSeperators = 0;
    addedSeconds = 0;
    removedMinutes = 0;
    addedMinutes = 0;
    addedHours = 0;
    hc = 0;
    minutesCount = 0;
    secondsCount = 0;
}

function setSliderVariables()
{
    computeLabel = "Compute";
    nextLabel = "Next Example";
    quizLabel = "Quiz Me!";
}

function setSlider()
{
    setSliderVariables();

    PIEaddDualCommand(computeLabel, computeExpt);
    PIEaddDualCommand(nextLabel, nextExpt);
    PIEaddDualCommand(quizLabel, quizExpt);
    PIEaddDisplayText("Correct", 0);
    PIEaddDisplayText("Wrong", 0);
}

function computeExpt()
{
    removeResultText();
    PIEstopAnimation();
    removeOptions();
    initialiseOtherVariables();
    exptType = "Compute";
    moveHeadings();
    if(h && circles[h])
        circles[h].material.color.setHex(0xffffff);
    hoursHand.material.color.setHex(0x000000);
    minutesHand.material.color.setHex(0x000000);
    secondsHand.material.color.setHex(0x000000);
    getMc();
    PIEstartAnimation();
}

function nextExpt()
{
    PIEstopAnimation();
    resetExperiment();
}

function quizExpt()
{
    PIEstopAnimation();
    removeOptions();
    if(h && circles[h])
        circles[h].material.color.setHex(0xffffff);
    addedOptions = 0;
    exptType = "Quiz";
    moveHeadings();
    hoursHand.material.color.setHex(0x000000);
    minutesHand.material.color.setHex(0x000000);
    secondsHand.material.color.setHex(0x000000);
    removeResultText();
    getNewTime();
    getMc();
    PIEstartAnimation();

}

function speedUp()
{
    if (speed < 2)
    {
        speed = speed * 2;
        if (speed == 1)
            mc = 0.15;
        else if (speed == 2)
            mc = 0.3;
        else if (speed == 4)
            mc = 0.5;
        else if (speed == 0.5)
            mc = 0.1;
        else if (speed == 0.25)
            mc = 0.09;
        else if (speed == 0.125)
            mc = 0.07;
    }
}

function speedDown()
{
    if (speed > 0.125)
    {
        speed = speed / 2;
        if (speed == 1)
            mc = 0.15;
        else if (speed == 2)
            mc = 0.3;
        else if (speed == 4)
            mc = 0.5;
        else if (speed == 0.5)
            mc = 0.1;
        else if (speed == 0.25)
            mc = 0.09;
        else if (speed == 0.125)
            mc = 0.07;
    }
}

function loadFont()
{
    loader = new THREE.FontLoader();
    loader.load("fonts/optimer.json", function(response)
    {
        font = response;
    });
}

function loadExperimentElements()
{

    PIEsetExperimentTitle("Analog Clock Reading");
    PIEsetDeveloperName("Dattatreya Sarma");

    loader = new THREE.FontLoader();
    loader.load("fonts/optimer.json", function(response)
    {
        font = response;
    });

    initialiseScene();
    setSlider();

    for (i = 0; i < 60; i++)
    {
        if (i % 5 == 0)
            geometry = new THREE.BoxGeometry(0.3, 0.9, 0.1);
        else
            geometry = new THREE.BoxGeometry(0.1, 0.9, 0.1);
        material = new THREE.MeshBasicMaterial(
        {
            color: 0x000000
        });
        dots[i] = new THREE.Mesh(geometry, material);
        dots[i].rotateZ(i * -0.105);
        PIEaddElement(dots[i]);
    }

    geometry = new THREE.CircleGeometry(1, 64);
    material = new THREE.MeshBasicMaterial(
    {
        color: 0x000000
    });
    nut = new THREE.Mesh(geometry, material);
    nut.position.set(myCenterX, myCenterY, -5);
    PIEaddElement(nut);

    geometry = new THREE.CircleGeometry(0.5, 64);
    var texture = new THREE.TextureLoader().load('images/steel.jpg');
    material = new THREE.MeshBasicMaterial(
    {
        map: texture
    });
    bolt = new THREE.Mesh(geometry, material);
    bolt.position.set(myCenterX, myCenterY, myCenterZ);
    PIEaddElement(bolt);

    var texture = new THREE.TextureLoader().load('images/steel.jpg');
    material = new THREE.MeshBasicMaterial({map: texture});

    placeDots();

    hours = new THREE.Object3D();
    PIEaddElement(hours);

    minutes = new THREE.Object3D();
    PIEaddElement(minutes);

    seconds = new THREE.Object3D();
    PIEaddElement(seconds);

    geometry = new THREE.BoxGeometry(0.8, 10, 0.1);
    material = new THREE.MeshLambertMaterial(
    {
        color: 0x000000
    });
    hoursHand = new THREE.Mesh(geometry, material);
    hoursHand.position.set(myCenterX, myCenterY + 4.1, -10);
    hours.add(hoursHand);

    geometry = new THREE.BoxGeometry(0.4, 12, 0.1);
    material = new THREE.MeshLambertMaterial(
    {
        color: 0x000000
    });
    minutesHand = new THREE.Mesh(geometry, material);
    minutesHand.position.set(myCenterX, myCenterY + 6, -10);
    minutes.add(minutesHand);

    geometry = new THREE.BoxGeometry(0.1, 16, 0.1);
    material = new THREE.MeshLambertMaterial(
    {
        color: 0x000000
    });
    secondsHand = new THREE.Mesh(geometry, material);
    secondsHand.position.set(myCenterX, myCenterY + 6, -10);
    seconds.add(secondsHand);

    geometry = new THREE.RingGeometry(15, 17, 64);
    material = new THREE.MeshBasicMaterial({color: 0xe60000});
    ring = new THREE.Mesh(geometry, material);
    ring.position.set(myCenterX, myCenterY, 0);
    PIEaddElement(ring);

    resetExperiment();

    PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);

}

function resetExperiment()
{

    PIEstopAnimation();
    removeOptions();
    initialiseOtherVariables();
    exptType = "Compute";
    moveHeadings();
    hoursHand.material.color.setHex(0x000000);
    minutesHand.material.color.setHex(0x000000);
    secondsHand.material.color.setHex(0x000000);
    speed = 1;

    PIEchangeDisplayText("Wrong", 0);
    PIEchangeDisplayText("Correct", 0);

    if(h && circles[h])
        circles[h].material.color.setHex(0xffffff);
    if(!font)
    {
        h= 5;
        m = 47;
        s = 59;
        var th = ((5 * h) + (m / 12)).toFixed(3);
        hours.rotateZ(th * -0.105);
        minutes.rotateZ(m * -0.105);
        seconds.rotateZ(s * -0.105);
    }
    else
        getNewTime();
    removeResultText();
    getMc();
    PIEstartAnimation();
}

function updateExperimentElements(t, dt)
{
    
    boundaryT = dt / 1000.0;
    boundaryT *= 1000;
    if (exptType == "Compute")
    {
        if (font && !numbersLoaded)
        {
            //console.log(hc);
            addNumbers();
        }
        if (numbersLoaded && !addedHeadings)
        {
            //console.log(hc+"  hahahahah");
            addHeadings();
        }
        if (addedHeadings && !addedTimeNumbers)
        {
            //console.log(hc+"  huhuhuhuhuhuhuhuh");
            addTimeNumbers();
        }
        if (addedTimeNumbers && !addedHours && circles[h])
        {
            hc = hc + mc;
            //console.log("1");
            if (parseInt(hc) > 30)
            {
                addedHours = 1;
                minutesHand.material.color.setHex(0x0000ff);
            }
            else if (parseInt(hc) > 25)
                hoursHand.material.color.setHex(0x000000);
            else if (parseInt(hc) > 15)
            {
                if (hhResult)
                    PIEremoveElement(hhResult);
                circles[h].material.color.setHex(0xD4318C);
                if (h < 10)
                    data = "0" + h;
                else
                    data = h;
                geometry = new THREE.TextGeometry(data,
                {
                    font: font,
                    size: 1.5,
                    height: 0.01,
                    curveSegments: 3
                });
                material = new THREE.MeshBasicMaterial(
                {
                    color: 0xD4318C
                });
                hhResult = new THREE.Mesh(geometry, material);
                hhResult.position.set(myCenterX + 22, myCenterY + 2, myCenterZ);
                PIEaddElement(hhResult);
            }
            else if (parseInt(hc) > 5)
            {
                minutesHand.material.color.setHex(0x000000);
                hoursHand.material.color.setHex(0xD4318C);
            }
        }
        if (addedHours && !addedMinutes)
        {
            if (!minutesCount || minutesCount < 0)
                minutesCount = 0;
            if (parseInt(minutesCount) <= m - (m % 5))
            {
                if (parseInt(minutesCount) % 5 == 0)
                    timeNumbers[parseInt(minutesCount)].material.color.setHex(0xffffff);
                if (parseInt(minutesCount) == m - (m % 5))
                    mc = 0.05;
            }
            else
            {
                if (parseInt(minutesCount) <= m)
                    timeNumbers[parseInt(minutesCount)].material.color.setHex(0xffffff);
                else
                {
                    var data;
                    if (m < 10)
                        data = "0" + m;
                    else
                        data = m;
                    geometry = new THREE.TextGeometry(data,
                    {
                        font: font,
                        size: 1.5,
                        height: 0.01,
                        curveSegments: 3
                    });
                    material = new THREE.MeshBasicMaterial(
                    {
                        color: 0x0000ff
                    });
                    mmResult = new THREE.Mesh(geometry, material);
                    mmResult.position.set(myCenterX + 26.25, myCenterY + 2, myCenterZ);
                    PIEaddElement(mmResult);
                    minutesCount = 60;
                    addedMinutes = 1;
                    minutesHand.material.color.setHex(0x000000);
                    secondsHand.material.color.setHex(0x008000);
                }
            }
            minutesCount = minutesCount + mc;
        }
        if (addedMinutes && !addedSeconds)
        {
            if (mmResult && !removedMinutes)
            {
                removeTimeNumbers("minutes");
            }
            if (removedMinutes)
            {
                if (!secondsCount || secondsCount < 0)
                {
                    getMc();
                    ////console.log(mc);    
                    secondsCount = 0;
                }
                if (parseInt(secondsCount) <= s - (s % 5))
                {
                    if (parseInt(secondsCount) % 5 == 0)
                        timeNumbers[parseInt(secondsCount)].material.color.setHex(0xffffff);
                    if (parseInt(secondsCount) == s - (s % 5))
                        mc = 0.05;
                }
                else
                {
                    if (parseInt(secondsCount) <= s)
                    {
                        ////console.log(timeNumbers[parseInt(secondsCount)]);
                        timeNumbers[parseInt(secondsCount)].material.color.setHex(0xffffff);
                    }
                    else
                    {
                        var data;
                        if (s < 10)
                            data = "0" + s;
                        else
                            data = s;
                        geometry = new THREE.TextGeometry(data,
                        {
                            font: font,
                            size: 1.5,
                            height: 0.01,
                            curveSegments: 3
                        });
                        material = new THREE.MeshBasicMaterial(
                        {
                            color: 0x008000
                        });
                        ssResult = new THREE.Mesh(geometry, material);
                        ssResult.position.set(myCenterX + 31, myCenterY + 2, myCenterZ);
                        PIEaddElement(ssResult);
                        secondsCount = 60;
                        addedSeconds = 1;
                        secondsHand.material.color.setHex(0x000000);
                        removeTimeNumbers("seconds");
                    }
                }
                secondsCount = secondsCount + mc;
            }

        }
        if (addedSeconds && addedSeperators < 2)
        {
            if (addedSeperators == 0)
            {
                //alert("adding...");
                s1 = headings[2].clone();
                s2 = headings[3].clone();
                s1.position.set(myCenterX + 25.25, myCenterY + 4, myCenterZ);
                s2.position.set(myCenterX + 30, myCenterY + 4, myCenterZ)
                PIEaddElement(s1);
                PIEaddElement(s2);
                addedSeperators = 1
            }
            else if (addedSeperators == 1)
            {
                if (s1.position.y > myCenterY + 2)
                {
                    //alert("changing 2");
                    s1.position.set(myCenterX + 25.25, s1.position.y - mc, myCenterZ);
                    s2.position.set(myCenterX + 30, s2.position.y - mc, myCenterZ);
                }
                else
                {
                    //PIEstopAnimation();
                    addedSeperators = 0;
                    addedSeconds = 0;
                    removedMinutes = 0;
                    addedMinutes = 0;
                    addedHours = 0;
                    hc = 0;
                    minutesCount = 0;
                    secondsCount = 0;
                    hoursHand.material.color.setHex(0x000000);
                    secondsHand.material.color.setHex(0x000000);
                    exptType = "loop";
                }
            }
        }
    }
    else if(exptType == "Result")
    {
        console.log(countFlag);
        countFlag++;
        if(countFlag == 100)
        {
            ResultText.visible  = false;
            optionsText[index1].visible = false;
            optionsBox[index1].visible  = false;
            optionsCircle[index1].visible = false;
            PIEremoveElement(ResultText);
            quizExpt();
        }
       
    }
    else if(exptType == "Quiz" && !addedOptions)
    {
        addOptions();
    }
    if (boundaryT < dt)
        PIEadjustAnimationTime(dt - boundaryT);
}

function addOptions()
{   
    
    var ht = (h<10 ? ("0"+h) : h);
    var mt = (m<10 ? ("0"+m) : m);
    var st = (s<10 ? ("0"+s) : s);
    options[0] = ht+" : "+mt+" : "+st;
    var hmone = (h==1 ? 12 : h-1);
    hmone  = (hmone<10 ? ("0"+hmone) : hmone);
    var hpone = h==12? 12 : h+1;
    hpone  = (hpone<10 ? ("0"+hpone) : hpone);
    var mmone = m==0 ? m  : m-1;
    mmone  = (mmone<10 ? ("0"+mmone) : mmone);
    var mpone = m==59? 0  : m+1;
    mpone  = (mpone<10 ? ("0"+mpone) : mpone);

    var th = parseInt((5 * h) + (m / 12)); 
    var th2;
    if(parseInt(m/5) == 0)
        th2 = 12;
    else
        th2 = parseInt(m/5);
    var temp = th2%13;
    th2 = (th2%13 < 10? ("0"+th2%13) : (th2%13).toString());
    th = (th%60 < 10? ("0"+th%60) : th%60);
    options[1] = th2+" : "+th+" : "+st;
    // if(th2 == "59")f
    //     th2 = "58";
    // else if(parseInt(th2[]))
    //     th2 = th2[0]+""
    options[2] = th2+" : "+(th-1)+" : "+st;
    options[3] = h+" : "+mpone+" : "+st;
    var ans = options[0];
    options = shuffle(options);
    ////console.log(options);
    var xd=0,yd,zd;
    var x =[myCenterX-25, myCenterX+25, myCenterX-25, myCenterX+25];
    var y =[myCenterY+8, myCenterY+8, myCenterY-6, myCenterY-6];
    for(var i=0; i<4; i++)
    {
        if(ans == options[i])
            correctOption = i;
        if(i%2)
            xd = 0.8;
        else
            xd = 0;
        geometry = getGeometry(options[i],1);
        material = new THREE.MeshBasicMaterial({color:0xffffff});
        optionsText[i] = new THREE.Mesh(geometry, material);

        optionsText[i].position.set(x[i]-3-xd,y[i]-0.5,-2);
        PIEaddElement(optionsText[i]);

        geometry = new THREE.CircleGeometry(2.6,64);
        material = new THREE.MeshBasicMaterial({color:0x000000});
        optionsCircle[i] = new THREE.Mesh(geometry, material);
        optionsCircle[i].position.set(x[i]-xd+0.5,y[i]-0.5,-3);
        PIEaddElement(optionsCircle[i]);

        geometry = new THREE.CircleGeometry(5,64);
        var texture = new THREE.TextureLoader().load( 'images/clock.png' );
        var material = new THREE.MeshBasicMaterial( { map: texture } );
        optionsBox[i] = new THREE.Mesh(geometry, material);
        optionsBox[i].position.set(x[i], y[i], -4);
        optionsBox[i].name = i;
        PIEaddElement(optionsBox[i]);
        yd = yd - 2;

    }
    addedOptions = 1;
}

function moveHeadings()
{
    if(!font)
        return;
    
    if(exptType == "Quiz")
    {
        headings[0].position.set(myCenterX + 22-3, myCenterY -23, myCenterZ);
        headings[1].position.set(myCenterX + 26-3, myCenterY -23, myCenterZ);
        headings[2].position.set(myCenterX + 25.25-3, myCenterY -23, myCenterZ);
        headings[3].position.set(myCenterX + 30-3, myCenterY -23, myCenterZ);
        headings[4].position.set(myCenterX + 30.8-3, myCenterY -23, myCenterZ);
    }
    else
    {
        headings[0].position.set(myCenterX + 22, myCenterY+4, myCenterZ);
        headings[1].position.set(myCenterX + 26, myCenterY+4, myCenterZ);
        headings[2].position.set(myCenterX + 25.25, myCenterY+4, myCenterZ);
        headings[3].position.set(myCenterX + 30, myCenterY+4, myCenterZ);
        headings[4].position.set(myCenterX + 30.8, myCenterY+4, myCenterZ);
    }
}

function ondocmousedown(event)
{
    event.preventDefault();

    raycaster.setFromCamera(PIEmouseP, PIEcamera);

    intersects = raycaster.intersectObjects(optionsBox);
    if(intersects.length)
    {
        var intersection = intersects[0],
        obj = intersection.object;
        if(obj.name == correctOption)
        {
            obj.material.color.setHex('0x00ff00');
            optionsText[obj.name].material.color.setHex('0x00ff00');
            PIEchangeDisplayText("Correct", parseInt(PIEgetDisplayText("Correct"))+1);           
            ShowResult(true,obj.name);
        }
        else
        {
            obj.material.color.setHex('0xff0000');
            optionsText[obj.name].material.color.setHex('0xff0000');
            PIEchangeDisplayText("Wrong", parseInt(PIEgetDisplayText("Wrong"))+1);
            ShowResult(false,obj.name);
        }
        
        //quizExpt();
    }
}

function ShowResult(bool, index)
{
    index1 = index;
    for(var i=0; i<4; i++)
    {
        if(index1!=i)
        {
            optionsText[i].visible = false;
            optionsBox[i].visible  = false;
            optionsCircle[i].visible = false;
        }
    }

    var data,color;
    if(bool)
    {
        data = "Correct";
        color = 0x00ff00;
    }
    else
    {
        data = "Wrong";
        color = 0xff0000;
    }

    var x,y,z;
    x = optionsText[index1].position.x;
    y = optionsText[index1].position.y;
    z = optionsText[index1].position.z;

    if(index1 <= 1)
    {
        y = y-10;
        if(index1 == 0)
            x = x-1;
    }
    else
    {
        y = y + 10;
        if(index1 == 2)
            x = x-1;
    }

    geometry = getGeometry(data,2);
    material = new THREE.MeshBasicMaterial({color : color});
    ResultText = new THREE.Mesh(geometry, material);
    PIEaddElement(ResultText);
    ResultText.position.set(x,y,z); 

    exptType = "Result"
    countFlag = 0;
   
}

function removeOptions()
{
    if(options.length)
    {        
        for (var i = 0; i < options.length; i++)
        {
           PIEremoveElement(optionsBox[i]);
           PIEremoveElement(optionsText[i]);
           PIEremoveElement(optionsCircle[i]);
        }
    }
    if(ResultText)
        PIEremoveElement(ResultText);
}

function shuffle(array)
{
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex)
    {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
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

function removeResultText()
{

    if(!addHeadings)
        return;
    if (mmResult)
        PIEremoveElement(mmResult);
    if (ssResult)
        PIEremoveElement(ssResult);
    if (s1)
        PIEremoveElement(s1);
    if (s2)
        PIEremoveElement(s2);
    if(timeNumbers.length)
        for (var i = 0; i < 60; i++)
            timeNumbers[i].material.color.setHex(0xe60000);
    if (h && circles[h])
        circles[h].material.color.setHex(0xffffff);
    if (hhResult)
        PIEremoveElement(hhResult);


}

function getMc()
{
    if (speed == 1)
        mc = 0.15;
    else if (speed == 2)
        mc = 0.3;
    else if (speed == 4)
        mc = 0.5;
    else if (speed == 0.5)
        mc = 0.1;
    else if (speed == 0.25)
        mc = 0.09;
    else if (speed == 0.125)
        mc = 0.07;
}

function removeTimeNumbers(type)
{
    var time, i;
    if (type == "all")
    {
        for (var i = 0; i < 60; i++)
            PIEremoveElement(timeNumbers[i]);
        timeNumbers = [];

        return;
    }
    else if (type == "minutes")
        time = m;
    else if (type == "seconds")
        time = s;
    for (i = 0; parseInt(i) <= time - time % 5; i = i + 0.5)
        if (parseInt(i) % 5 == 0)
            timeNumbers[parseInt(i)].material.color.setHex(0xe60000);

    for (i = time - time % 5 + 1; i < time; i++)
        timeNumbers[parseInt(i)].material.color.setHex(0xe60000);

    if (type == "minutes")
    {
        timeNumbers[time].material.color.setHex(0x0000ff);
        removedMinutes = 1;
    }
    else
    {
        timeNumbers[m].material.color.setHex(0x0000ff);
        timeNumbers[s].material.color.setHex(0x008000);
        removedSeconds = 1;
    }
}

function addHeadings()
{
    geometry = new THREE.TextGeometry("HH",
    {
        font: font,
        size: 1.5,
        height: 0.01,
        curveSegments: 3
    });
    material = new THREE.MeshBasicMaterial(
    {
        color: 0xD4318C
    });
    headings[0] = new THREE.Mesh(geometry, material);
    headings[0].position.set(myCenterX + 22, myCenterY + 4, myCenterZ);
    PIEaddElement(headings[0]);

    geometry = new THREE.TextGeometry(":",
    {
        font: font,
        size: 1.5,
        height: 0.01,
        curveSegments: 3
    });
    material = new THREE.MeshBasicMaterial(
    {
        color: 0xe60000
    });
    headings[2] = new THREE.Mesh(geometry, material);
    headings[2].position.set(myCenterX + 25.25, myCenterY + 4, myCenterZ);
    PIEaddElement(headings[2]);

    geometry = new THREE.TextGeometry("MM",
    {
        font: font,
        size: 1.5,
        height: 0.01,
        curveSegments: 3
    });
    material = new THREE.MeshBasicMaterial(
    {
        color: 0x0000ff
    });
    headings[1] = new THREE.Mesh(geometry, material);
    headings[1].position.set(myCenterX + 26, myCenterY + 4, myCenterZ);
    PIEaddElement(headings[1]);

    headings[3] = headings[2].clone();
    headings[3].position.set(myCenterX + 30, myCenterY + 4, myCenterZ);
    PIEaddElement(headings[3]);

    geometry = new THREE.TextGeometry("SS",
    {
        font: font,
        size: 1.5,
        height: 0.01,
        curveSegments: 3
    });
    material = new THREE.MeshBasicMaterial(
    {
        color: 0x008000
    });
    headings[4] = new THREE.Mesh(geometry, material);
    headings[4].position.set(myCenterX + 30.8, myCenterY + 4, myCenterZ);
    PIEaddElement(headings[4]);

    addedHeadings = 1;
}

function getNewTime()
{
    seconds.rotation.set(0, 0, 0);
    minutes.rotation.set(0, 0, 0);
    hours.rotation.set(0, 0, 0);

    h = (Math.floor((Math.random() * 12)) + 1);
    m = Math.floor(Math.random() * 60);
    s = Math.floor(Math.random() * 60);

    var th = ((5 * h) + (m / 12)).toFixed(3);

    hours.rotateZ(th * -0.105);
    minutes.rotateZ(m * -0.105);
    seconds.rotateZ(s * -0.105);

    ////console.log(h+" "+m+" "+s);
}

function addNumbers()
{
    for (var i = 0; i < 12; i++)
    {
        var x = dots[5 * i].position.x + 15;
        var y = dots[5 * i].position.y;
        var z = dots[5 * i].position.z;

        var data = i;
        if (!i)
            data = 12;
        geometry = new THREE.TextGeometry(data,
        {
            font: font,
            size: 2,
            height: 0.01,
            curveSegments: 3
        });
        material = new THREE.MeshBasicMaterial(
        {
            color: 0x000000
        });
        numbers[i] = new THREE.Mesh(geometry, material);
        numbers[i].position.set(x - 1, y - 2, z);

        PIEaddElement(numbers[i]);
        var w = 1.5;
        if (i > 9 || i == 0)
            w = 1.8;

        geometry = new THREE.CircleGeometry(w, 64);
        material = new THREE.MeshBasicMaterial(
        {
            color: 0xffffff
        });
        circles[i] = new THREE.Mesh(geometry, material);
        PIEaddElement(circles[i]);
    }

    numbers[0].position.set(numbers[0].position.x - 0.7 - 15, numbers[0].position.y - 1, z);
    numbers[1].position.set(numbers[1].position.x - 1 - 15, numbers[1].position.y - 0.5, z);
    numbers[2].position.set(numbers[2].position.x - 1.5 - 15, numbers[2].position.y + 0.5, z);
    numbers[3].position.set(numbers[3].position.x - 1.5 - 13.5, numbers[3].position.y + 1, z);
    numbers[4].position.set(numbers[4].position.x - 1.5 - 15, numbers[4].position.y + 2, z);
    numbers[5].position.set(numbers[5].position.x - 1 - 15, numbers[5].position.y + 2.5, z);
    numbers[6].position.set(numbers[6].position.x + 0.2 - 15, numbers[6].position.y + 3, z);
    numbers[7].position.set(numbers[7].position.x + 1 - 15, numbers[7].position.y + 3, z);
    numbers[8].position.set(numbers[8].position.x + 2 - 15, numbers[8].position.y + 2, z);
    numbers[9].position.set(numbers[9].position.x + 2 - 15, numbers[9].position.y + 1, z);
    numbers[10].position.set(numbers[10].position.x + 1.8 - 15, numbers[10].position.y + 0.3, z);
    numbers[11].position.set(numbers[11].position.x + 1 - 15, numbers[11].position.y - 1, z);
    //changeDotsDir();

    circles[0].position.set(myCenterX + 0.1, myCenterY + 13.3, -10);
    circles[1].position.set(myCenterX + 6.8, myCenterY + 11.8, -10);
    circles[2].position.set(myCenterX + 11.6, myCenterY + 7.1, -10);
    circles[3].position.set(myCenterX + 13.5, myCenterY, -10);
    circles[4].position.set(myCenterX + 11.65, myCenterY - 7, -10);
    circles[5].position.set(myCenterX + 6.5, myCenterY - 12, -10);
    circles[6].position.set(myCenterX, myCenterY - 13.6, -10);
    circles[7].position.set(myCenterX - 7, myCenterY - 11.4, -10);
    circles[8].position.set(myCenterX - 11.6, myCenterY - 6.6, -10);
    circles[9].position.set(myCenterX - 13.5, myCenterY + 0.2, -10);
    circles[10].position.set(myCenterX - 10.6, myCenterY + 7, -10);
    circles[11].position.set(myCenterX - 5.7, myCenterY + 11.5, -10);
    numbersLoaded = 1;
}

function addTimeNumbers()
{
    for (var i = 0; i < 60; i++)
    {
        geometry = new THREE.TextGeometry(i,
        {
            font: font,
            size: 0.9,
            height: 0.01,
            curveSegments: 3
        });
        material = new THREE.MeshBasicMaterial(
        {
            color: 0xe60000
        });
        timeNumbers[i] = new THREE.Mesh(geometry, material);
        PIEaddElement(timeNumbers[i]);
    }
    timeNumbers[0].position.set(myCenterX - 0.4, myCenterY + 15.5, 0);
    timeNumbers[1].position.set(myCenterX + 1.3, myCenterY + 15.5, 0);
    timeNumbers[59].position.set(myCenterX - 2.2, myCenterY + 15.5, 0);
    timeNumbers[2].position.set(myCenterX + 3, myCenterY + 15.2, 0);
    timeNumbers[58].position.set(myCenterX - 3.8, myCenterY + 15.2, 0);
    timeNumbers[3].position.set(myCenterX + 4.5, myCenterY + 14.7, 0);
    timeNumbers[57].position.set(myCenterX - 5.5, myCenterY + 15, 0);
    timeNumbers[4].position.set(myCenterX + 6, myCenterY + 14.2, 0);
    timeNumbers[56].position.set(myCenterX - 7.05, myCenterY + 14.4, 0);
    timeNumbers[5].position.set(myCenterX + 7.5, myCenterY + 13.4, 0);
    timeNumbers[55].position.set(myCenterX - 8.6, myCenterY + 13.6, 0);
    timeNumbers[6].position.set(myCenterX + 9, myCenterY + 12.5, 0);
    timeNumbers[54].position.set(myCenterX - 10, myCenterY + 12.4, 0);
    timeNumbers[7].position.set(myCenterX + 10.3, myCenterY + 11.4, 0);
    timeNumbers[53].position.set(myCenterX - 11.6, myCenterY + 11.4, 0);
    timeNumbers[8].position.set(myCenterX + 11.5, myCenterY + 10, 0);
    timeNumbers[52].position.set(myCenterX - 12.75, myCenterY + 10.2, 0);
    timeNumbers[9].position.set(myCenterX + 12.5, myCenterY + 8.7, 0);
    timeNumbers[51].position.set(myCenterX - 13.75, myCenterY + 8.7, 0);
    timeNumbers[10].position.set(myCenterX + 13.1, myCenterY + 7.1, 0);
    timeNumbers[50].position.set(myCenterX - 14.7, myCenterY + 7.5, 0);
    timeNumbers[11].position.set(myCenterX + 13.9, myCenterY + 5.5, 0);
    timeNumbers[49].position.set(myCenterX - 15.4, myCenterY + 6.1, 0);
    timeNumbers[12].position.set(myCenterX + 14.4, myCenterY + 4, 0);
    timeNumbers[48].position.set(myCenterX - 16, myCenterY + 4.5, 0);
    timeNumbers[13].position.set(myCenterX + 14.8, myCenterY + 2.5, 0);
    timeNumbers[47].position.set(myCenterX - 16.4, myCenterY + 3, 0);
    timeNumbers[14].position.set(myCenterX + 15, myCenterY + 1, 0);
    timeNumbers[46].position.set(myCenterX - 16.55, myCenterY + 1.5, 0);
    timeNumbers[15].position.set(myCenterX + 15, myCenterY - 0.5, 0);
    timeNumbers[45].position.set(myCenterX - 16.7, myCenterY - 0.3, 0);
    timeNumbers[16].position.set(myCenterX + 15, myCenterY - 2.1, 0);
    timeNumbers[44].position.set(myCenterX - 16.6, myCenterY - 2.1, 0);
    timeNumbers[17].position.set(myCenterX + 14.8, myCenterY - 3.8, 0);
    timeNumbers[43].position.set(myCenterX - 16.25, myCenterY - 3.8, 0);
    timeNumbers[18].position.set(myCenterX + 14.3, myCenterY - 5.2, 0);
    timeNumbers[42].position.set(myCenterX - 15.9, myCenterY - 5.2, 0);
    timeNumbers[19].position.set(myCenterX + 13.8, myCenterY - 6.8, 0);
    timeNumbers[41].position.set(myCenterX - 15.3, myCenterY - 6.8, 0);
    timeNumbers[20].position.set(myCenterX + 13.15, myCenterY - 8.2, 0);
    timeNumbers[40].position.set(myCenterX - 14.6, myCenterY - 8.2, 0);
    timeNumbers[21].position.set(myCenterX + 12.4, myCenterY - 9.6, 0);
    timeNumbers[39].position.set(myCenterX - 13.8, myCenterY - 9.6, 0);
    timeNumbers[22].position.set(myCenterX + 11.3, myCenterY - 10.8, 0);
    timeNumbers[38].position.set(myCenterX - 12.8, myCenterY - 10.8, 0);
    timeNumbers[23].position.set(myCenterX + 10.2, myCenterY - 12, 0);
    timeNumbers[37].position.set(myCenterX - 11.7, myCenterY - 12.1, 0);
    timeNumbers[24].position.set(myCenterX + 8.8, myCenterY - 13.3, 0);
    timeNumbers[36].position.set(myCenterX - 10.3, myCenterY - 13.2, 0);
    timeNumbers[25].position.set(myCenterX + 7.2, myCenterY - 14.3, 0);
    timeNumbers[35].position.set(myCenterX - 8.9, myCenterY - 14.2, 0);
    timeNumbers[26].position.set(myCenterX + 5.7, myCenterY - 15.25, 0);
    timeNumbers[34].position.set(myCenterX - 7.4, myCenterY - 15, 0);
    timeNumbers[27].position.set(myCenterX + 4.1, myCenterY - 15.9, 0);
    timeNumbers[33].position.set(myCenterX - 5.6, myCenterY - 15.8, 0);
    timeNumbers[28].position.set(myCenterX + 2.5, myCenterY - 16.1, 0);
    timeNumbers[32].position.set(myCenterX - 4, myCenterY - 16.2, 0);
    timeNumbers[29].position.set(myCenterX + 0.8, myCenterY - 16.4, 0);
    timeNumbers[31].position.set(myCenterX - 2.5, myCenterY - 16.4, 0);
    timeNumbers[30].position.set(myCenterX - 0.8, myCenterY - 16.5, 0);

    addedTimeNumbers = 1;
}

function placeDots()
{
    dots[0].position.set(-15 + 15, 15.5, -10);
    dots[30].position.set(-15.1 + 15, -15.5, -10);

    dots[1].position.set(-13.4 + 15, 15.4, -10);
    dots[29].position.set(-13.5 + 15, -15.4, -10);
    dots[59].position.set(-16.4 + 15, 15.4, -10);
    dots[31].position.set(-16.75 + 15, -15.4, -10);

    dots[2].position.set(-11.7 + 15, 15.2, -10);
    dots[28].position.set(-11.9 + 15, -15.2, -10);
    dots[58].position.set(-18 + 15, 15.2, -10);
    dots[32].position.set(-18.3 + 15, -15.1, -10);

    dots[3].position.set(-10.2 + 15, 14.7, -10);
    dots[27].position.set(-10.3 + 15, -14.7, -10);
    dots[57].position.set(-19.6 + 15, 14.8, -10);
    dots[33].position.set(-19.95 + 15, -14.7, -10);

    dots[4].position.set(-8.65 + 15, 14.2, -10);
    dots[26].position.set(-8.75 + 15, -14.2, -10);
    dots[56].position.set(-21 + 15, 14.2, -10);
    dots[34].position.set(-21.45 + 15, -14.1, -10);

    dots[5].position.set(-7.15 + 15, 13.4, -10);
    dots[25].position.set(-7.3 + 15, -13.4, -10);
    dots[55].position.set(-22.5 + 15, 13.6, -10);
    dots[35].position.set(-22.8 + 15, -13.3, -10);

    dots[6].position.set(-5.8 + 15, 12.5, -10);
    dots[24].position.set(-6 + 15, -12.5, -10);
    dots[54].position.set(-23.9 + 15, 12.6, -10);
    dots[36].position.set(-24.2 + 15, -12.4, -10);

    dots[7].position.set(-4.7 + 15, 11.5, -10);
    dots[23].position.set(-4.6 + 15, -11.55, -10);
    dots[53].position.set(-25.1 + 15, 11.6, -10);
    dots[37].position.set(-25.45 + 15, -11.3, -10);

    dots[8].position.set(-3.45 + 15, 10.3, -10);
    dots[22].position.set(-3.5 + 15, -10.3, -10);
    dots[52].position.set(-26.4 + 15, 10.6, -10);
    dots[38].position.set(-26.65 + 15, -10.2, -10);


    dots[9].position.set(-2.45 + 15, 9.1, -10);
    dots[21].position.set(-2.5 + 15, -9.2, -10);
    dots[51].position.set(-27.4 + 15, 9.2, -10);
    dots[39].position.set(-27.5 + 15, -9, -10);

    dots[10].position.set(-1.6 + 15, 7.7, -10);
    dots[20].position.set(-1.6 + 15, -7.9, -10);
    dots[50].position.set(-28.2 + 15, 7.9, -10);
    dots[40].position.set(-28.4 + 15, -7.6, -10);

    dots[11].position.set(-0.8 + 15, 6.3, -10);
    dots[19].position.set(-0.9 + 15, -6.45, -10);
    dots[49].position.set(-29 + 15, 6.5, -10);
    dots[41].position.set(-29.2 + 15, -6, -10);

    dots[12].position.set(-0.25 + 15, 4.7, -10);
    dots[18].position.set(-0.35 + 15, -4.8, -10);
    dots[48].position.set(-29.6 + 15, 5, -10);
    dots[42].position.set(-29.7 + 15, -4.7, -10);

    dots[13].position.set(0.1 + 15, 3.2, -10);
    dots[17].position.set(0 + 15, -3.3, -10);
    dots[47].position.set(-30 + 15, 3.4, -10);
    dots[43].position.set(-30. + 15, -3.1, -10);

    dots[14].position.set(0.4 + 15, 1.6, -10);
    dots[16].position.set(0.5 + 15, -1.6, -10);
    dots[46].position.set(-30.4 + 15, 1.85, -10);
    dots[44].position.set(-30.5 + 15, -1.4, -10);

    dots[15].position.set(-1.35 + 15, 0, 0);
    dots[45].position.set(-30.5 + 15, 0.2, -10);
}