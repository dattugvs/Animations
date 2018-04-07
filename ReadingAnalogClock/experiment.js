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
var dotsZ = -5;
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
    myCenterZ = -20.0;

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
    computeLabel = "Learn";
    nextLabel = "Next Example";
    quizLabel = "Quiz Me!";
}

function setSlider()
{
    setSliderVariables();

    PIEaddDualCommand(computeLabel, computeExpt);
    PIEaddDualCommand(nextLabel, nextExpt);
    PIEaddDualCommand(quizLabel, quizExpt);
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
    removeOptions();
    initialiseOtherVariables();
    exptType = "Compute";
    moveHeadings();
    hoursHand.material.color.setHex(0x000000);
    minutesHand.material.color.setHex(0x000000);
    secondsHand.material.color.setHex(0x000000);
    speed = 1;

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
    initialiseInfo();
    initialiseHelp();

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
    material = new THREE.MeshBasicMaterial({color: 0x000000});
    nut = new THREE.Mesh(geometry, material);
    nut.position.set(myCenterX, myCenterY, myCenterZ);
    PIEaddElement(nut);

    geometry = new THREE.CircleGeometry(0.5, 64);
    var texture = new THREE.TextureLoader().load('images/steel.jpg');
    material = new THREE.MeshBasicMaterial({map: texture});
    bolt = new THREE.Mesh(geometry, material);
    bolt.position.set(myCenterX, myCenterY, myCenterZ+1);
    PIEaddElement(bolt);

    placeDots();

    hours = new THREE.Object3D();
    PIEaddElement(hours);

    minutes = new THREE.Object3D();
    PIEaddElement(minutes);

    seconds = new THREE.Object3D();
    PIEaddElement(seconds);

    geometry = new THREE.BoxGeometry(0.8, 9.9, 0.1);
    material = new THREE.MeshLambertMaterial(
    {
        color: 0x000000
    });
    hoursHand = new THREE.Mesh(geometry, material);
    hoursHand.position.set(myCenterX, myCenterY + 5.905, myCenterZ);
    hours.add(hoursHand);

    geometry = new THREE.BoxGeometry(0.4, 15.5, 0.1);
    material = new THREE.MeshLambertMaterial(
    {
        color: 0x000000
    });
    minutesHand = new THREE.Mesh(geometry, material);
    minutesHand.position.set(myCenterX, myCenterY + 6, myCenterZ+0.1);
    minutes.add(minutesHand);

    geometry = new THREE.BoxGeometry(0.1, 16, 0.1);
    material = new THREE.MeshLambertMaterial(
    {
        color: 0x000000
    });
    secondsHand = new THREE.Mesh(geometry, material);
    secondsHand.position.set(myCenterX, myCenterY + 6, myCenterZ);
    seconds.add(secondsHand);

    geometry = new THREE.RingGeometry(15, 17, 64);
    material = new THREE.MeshBasicMaterial({color: 0xe60000});
    ring = new THREE.Mesh(geometry, material);
    ring.position.set(myCenterX, myCenterY, myCenterZ);
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
                geometry = new THREE.TextGeometry(data,{
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
                PIEaddElement(hhResult);

                if(window.innerWidth<=400)
                {
                    s1 = headings[2].clone();
                    s1.position.set(myCenterX-2, myCenterY -20, myCenterZ);
                    PIEaddElement(s1);
                    hhResult.position.set(myCenterX-5, myCenterY -20, myCenterZ);
                }
                else
                    hhResult.position.set(myCenterX + 19, myCenterY + 2, myCenterZ);
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
                    PIEaddElement(mmResult);

                    if(window.innerWidth<=400)
                    {
                        s2 = headings[3].clone();
                        s2.position.set(myCenterX+1.8, myCenterY -20, myCenterZ);
                        mmResult.position.set(myCenterX -1.2, myCenterY -20, myCenterZ);
                        PIEaddElement(s2);
                    }
                    else
                        mmResult.position.set(myCenterX + 23.3, myCenterY + 2, myCenterZ);

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
                        PIEaddElement(ssResult);
                        if(window.innerWidth<=400)
                            ssResult.position.set(myCenterX + 2.6, myCenterY -20, myCenterZ);
                        else
                            ssResult.position.set(myCenterX + 27.5, myCenterY + 2, myCenterZ);
                        secondsCount = 60;
                        addedSeconds = 1;
                        secondsHand.material.color.setHex(0x000000);
                        removeTimeNumbers("seconds");
                    }
                }
                secondsCount = secondsCount + mc;
            }

        }
        if (addedSeconds && addedSeperators < 2 && window.innerWidth>400)
        {
            if (addedSeperators == 0)
            {
                s1 = headings[2].clone();
                s2 = headings[3].clone();
                s1.position.set(myCenterX + 23, myCenterY + 4, myCenterZ);
                s2.position.set(myCenterX + 26.8, myCenterY + 4, myCenterZ);
                PIEaddElement(s1);
                PIEaddElement(s2);   
                addedSeperators = 1
            }
            else if (addedSeperators == 1)
            {
                if (s1.position.y > myCenterY + 2 && window.innerWidth>380)
                {
                    s1.position.set(myCenterX + 22.25, s1.position.y - mc, myCenterZ);
                    s2.position.set(myCenterX + 26.8, s2.position.y - mc, myCenterZ);
                }
                else
                {
                    PIEstopAnimation();
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
        countFlag++;
        if(countFlag == 100)
        {
            ResultText.visible  = false;
            optionsText[index1].visible = false;
            optionsBox[index1].visible  = false;
            optionsCircle[index1].visible = false;
            ResultText.material.color.setHex(0xffffff);
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
    options[3] = ht+" : "+mpone+" : "+st;
    var ans = options[0];
    options = shuffle(options);
    ////console.log(options);
    var xd=0,yd,zd,bx=0;
    var x =[myCenterX-25, myCenterX+25, myCenterX-25, myCenterX+25];
    var y =[myCenterY+8, myCenterY+8, myCenterY-6, myCenterY-6];
    for(var i=0; i<4; i++)
    {
        if(ans == options[i])
            correctOption = i;
        if(i%2)
        {
            xd = 2;
            bx = 1.5;
        }
        else
        {
            xd = -0.8;
            bx = -1;
        }
        geometry = getGeometry(options[i],1);
        material = new THREE.MeshBasicMaterial({color:0xffffff});
        optionsText[i] = new THREE.Mesh(geometry, material);

        optionsText[i].position.set(x[i]-3-xd,y[i]-0.5,myCenterZ);
        PIEaddElement(optionsText[i]);

        geometry = new THREE.CircleGeometry(2.6,64);
        material = new THREE.MeshBasicMaterial({color:0x000000});
        optionsCircle[i] = new THREE.Mesh(geometry, material);
        optionsCircle[i].position.set(x[i]-xd+0.5,y[i]-0.5,myCenterZ-1);
        PIEaddElement(optionsCircle[i]);

        geometry = new THREE.CircleGeometry(5,64);
        var texture = new THREE.TextureLoader().load( 'images/clock.png' );
        var material = new THREE.MeshBasicMaterial( { map: texture } );
        optionsBox[i] = new THREE.Mesh(geometry, material);
        optionsBox[i].position.set(x[i]-bx, y[i], myCenterZ-2);
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
        headings[0].position.set(myCenterX + 19, myCenterY -35, myCenterZ);
        headings[1].position.set(myCenterX + 23, myCenterY -35, myCenterZ);
        headings[2].position.set(myCenterX + 22.5, myCenterY -35, myCenterZ);
        headings[3].position.set(myCenterX + 26.8, myCenterY -35, myCenterZ);
        headings[4].position.set(myCenterX + 27.5, myCenterY -35, myCenterZ);
    }
    else
    {
        headings[0].position.set(myCenterX + 19, myCenterY+4, myCenterZ);
        headings[1].position.set(myCenterX + 23, myCenterY+4, myCenterZ);
        headings[2].position.set(myCenterX + 22.25, myCenterY+4, myCenterZ);
        headings[3].position.set(myCenterX + 26.8, myCenterY+4, myCenterZ);
        headings[4].position.set(myCenterX + 27.5, myCenterY+4, myCenterZ);
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
            ShowResult(true,obj.name);
        }
        else
        {
            obj.material.color.setHex('0xff0000');
            optionsText[obj.name].material.color.setHex('0xff0000');
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
    {
        ResultText.visible = true;
        PIEremoveElement(ResultText);
    }
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
    headings[0].position.set(myCenterX + 19, myCenterY + 4, myCenterZ);
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
    headings[2].position.set(myCenterX + 22.25, myCenterY + 4, myCenterZ);
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
    headings[1].position.set(myCenterX + 23, myCenterY + 4, myCenterZ);
    PIEaddElement(headings[1]);

    headings[3] = headings[2].clone();
    headings[3].position.set(myCenterX + 26.8, myCenterY + 4, myCenterZ);
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
    headings[4].position.set(myCenterX + 27.5, myCenterY + 4, myCenterZ);
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
            size: 1.4,
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
        var r = 1;
        if (i > 9 || i == 0)
            r = 1.3;

        geometry = new THREE.CircleGeometry(r, 64);
        material = new THREE.MeshBasicMaterial({color: 0xffffff});
        circles[i] = new THREE.Mesh(geometry, material);
        PIEaddElement(circles[i]);
    }

    numbers[0].position.set(numbers[0].position.x - 0.7 - 14.6, numbers[0].position.y - 1.1, myCenterZ);
    numbers[1].position.set(numbers[1].position.x - 1 - 15, numbers[1].position.y - 0.5, myCenterZ);
    numbers[2].position.set(numbers[2].position.x - 1.5 - 15, numbers[2].position.y + 0.5, myCenterZ);
    numbers[3].position.set(numbers[3].position.x - 1.5 - 15.1, numbers[3].position.y + 1.3, myCenterZ);
    numbers[4].position.set(numbers[4].position.x - 1.5 - 15, numbers[4].position.y + 2.3, myCenterZ);
    numbers[5].position.set(numbers[5].position.x - 1 - 14.8, numbers[5].position.y + 3.2, myCenterZ);
    numbers[6].position.set(numbers[6].position.x + 0.2 - 14.8, numbers[6].position.y + 3.5, myCenterZ);
    numbers[7].position.set(numbers[7].position.x + 1 - 14.6, numbers[7].position.y + 3.4, myCenterZ);
    numbers[8].position.set(numbers[8].position.x + 2 - 14.7, numbers[8].position.y + 2.1, myCenterZ);
    numbers[9].position.set(numbers[9].position.x + 2 - 14.6, numbers[9].position.y + 1.3, myCenterZ);
    numbers[10].position.set(numbers[10].position.x + 1.8 - 14.6, numbers[10].position.y + 0.15, myCenterZ);
    numbers[11].position.set(numbers[11].position.x + 1 - 14.8, numbers[11].position.y - 1, myCenterZ);
    //changeDotsDir();

    circles[0].position.set(myCenterX + 0.05, myCenterY + 12.95, myCenterZ);
    circles[1].position.set(myCenterX + 6.6, myCenterY + 11.56, myCenterZ);
    circles[2].position.set(myCenterX + 11.4, myCenterY + 6.8, myCenterZ);
    circles[3].position.set(myCenterX + 13.3, myCenterY, myCenterZ);
    circles[4].position.set(myCenterX + 11.45, myCenterY - 6.9, myCenterZ);
    circles[5].position.set(myCenterX + 6.5, myCenterY - 11.55, myCenterZ);
    circles[6].position.set(myCenterX-0.05, myCenterY - 13.3, myCenterZ);
    circles[7].position.set(myCenterX - 6.8, myCenterY - 11.2, myCenterZ);
    circles[8].position.set(myCenterX - 11.55, myCenterY - 6.8, myCenterZ);
    circles[9].position.set(myCenterX - 13.42, myCenterY + 0.2, myCenterZ);
    circles[10].position.set(myCenterX - 10.66, myCenterY + 6.7, myCenterZ);
    circles[11].position.set(myCenterX - 6, myCenterY + 11.2, myCenterZ);
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
    timeNumbers[0].position.set(myCenterX - 0.4, myCenterY + 15.5, myCenterZ);
    timeNumbers[1].position.set(myCenterX + 1.3, myCenterY + 15.5, myCenterZ);
    timeNumbers[59].position.set(myCenterX - 2.2, myCenterY + 15.5, myCenterZ);
    timeNumbers[2].position.set(myCenterX + 3, myCenterY + 15.2, myCenterZ);
    timeNumbers[58].position.set(myCenterX - 3.8, myCenterY + 15.2, myCenterZ);
    timeNumbers[3].position.set(myCenterX + 4.5, myCenterY + 14.7, myCenterZ);
    timeNumbers[57].position.set(myCenterX - 5.5, myCenterY + 15, myCenterZ);
    timeNumbers[4].position.set(myCenterX + 6, myCenterY + 14.2, myCenterZ);
    timeNumbers[56].position.set(myCenterX - 7.05, myCenterY + 14.4, myCenterZ);
    timeNumbers[5].position.set(myCenterX + 7.5, myCenterY + 13.4, myCenterZ);
    timeNumbers[55].position.set(myCenterX - 8.6, myCenterY + 13.6, myCenterZ);
    timeNumbers[6].position.set(myCenterX + 9, myCenterY + 12.5, myCenterZ);
    timeNumbers[54].position.set(myCenterX - 10, myCenterY + 12.4, myCenterZ);
    timeNumbers[7].position.set(myCenterX + 10.3, myCenterY + 11.4, myCenterZ);
    timeNumbers[53].position.set(myCenterX - 11.6, myCenterY + 11.4, myCenterZ);
    timeNumbers[8].position.set(myCenterX + 11.5, myCenterY + 10, myCenterZ);
    timeNumbers[52].position.set(myCenterX - 12.75, myCenterY + 10.2, myCenterZ);
    timeNumbers[9].position.set(myCenterX + 12.5, myCenterY + 8.7, myCenterZ);
    timeNumbers[51].position.set(myCenterX - 13.75, myCenterY + 8.7, myCenterZ);
    timeNumbers[10].position.set(myCenterX + 13.1, myCenterY + 7.1, myCenterZ);
    timeNumbers[50].position.set(myCenterX - 14.7, myCenterY + 7.5, myCenterZ);
    timeNumbers[11].position.set(myCenterX + 13.9, myCenterY + 5.5, myCenterZ);
    timeNumbers[49].position.set(myCenterX - 15.4, myCenterY + 6.1, myCenterZ);
    timeNumbers[12].position.set(myCenterX + 14.4, myCenterY + 4, myCenterZ);
    timeNumbers[48].position.set(myCenterX - 16, myCenterY + 4.5, myCenterZ);
    timeNumbers[13].position.set(myCenterX + 14.8, myCenterY + 2.5, myCenterZ);
    timeNumbers[47].position.set(myCenterX - 16.4, myCenterY + 3, myCenterZ);
    timeNumbers[14].position.set(myCenterX + 15, myCenterY + 1, myCenterZ);
    timeNumbers[46].position.set(myCenterX - 16.55, myCenterY + 1.5, myCenterZ);
    timeNumbers[15].position.set(myCenterX + 15, myCenterY - 0.5, myCenterZ);
    timeNumbers[45].position.set(myCenterX - 16.7, myCenterY - 0.3, myCenterZ);
    timeNumbers[16].position.set(myCenterX + 15, myCenterY - 2.1, myCenterZ);
    timeNumbers[44].position.set(myCenterX - 16.6, myCenterY - 2.1, myCenterZ);
    timeNumbers[17].position.set(myCenterX + 14.8, myCenterY - 3.8, myCenterZ);
    timeNumbers[43].position.set(myCenterX - 16.25, myCenterY - 3.8, myCenterZ);
    timeNumbers[18].position.set(myCenterX + 14.3, myCenterY - 5.2, myCenterZ);
    timeNumbers[42].position.set(myCenterX - 15.9, myCenterY - 5.2, myCenterZ);
    timeNumbers[19].position.set(myCenterX + 13.8, myCenterY - 6.8, myCenterZ);
    timeNumbers[41].position.set(myCenterX - 15.3, myCenterY - 6.8, myCenterZ);
    timeNumbers[20].position.set(myCenterX + 13.15, myCenterY - 8.2, myCenterZ);
    timeNumbers[40].position.set(myCenterX - 14.6, myCenterY - 8.2, myCenterZ);
    timeNumbers[21].position.set(myCenterX + 12.4, myCenterY - 9.6, myCenterZ);
    timeNumbers[39].position.set(myCenterX - 13.8, myCenterY - 9.6, myCenterZ);
    timeNumbers[22].position.set(myCenterX + 11.3, myCenterY - 10.8, myCenterZ);
    timeNumbers[38].position.set(myCenterX - 12.8, myCenterY - 10.8, myCenterZ);
    timeNumbers[23].position.set(myCenterX + 10.2, myCenterY - 12, myCenterZ);
    timeNumbers[37].position.set(myCenterX - 11.7, myCenterY - 12.1, myCenterZ);
    timeNumbers[24].position.set(myCenterX + 8.8, myCenterY - 13.3, myCenterZ);
    timeNumbers[36].position.set(myCenterX - 10.3, myCenterY - 13.2, myCenterZ);
    timeNumbers[25].position.set(myCenterX + 7.2, myCenterY - 14.3, myCenterZ);
    timeNumbers[35].position.set(myCenterX - 8.9, myCenterY - 14.2, myCenterZ);
    timeNumbers[26].position.set(myCenterX + 5.7, myCenterY - 15.25, myCenterZ);
    timeNumbers[34].position.set(myCenterX - 7.4, myCenterY - 15, myCenterZ);
    timeNumbers[27].position.set(myCenterX + 4.1, myCenterY - 15.9, myCenterZ);
    timeNumbers[33].position.set(myCenterX - 5.6, myCenterY - 15.8, myCenterZ);
    timeNumbers[28].position.set(myCenterX + 2.5, myCenterY - 16.1, myCenterZ);
    timeNumbers[32].position.set(myCenterX - 4, myCenterY - 16.2, myCenterZ);
    timeNumbers[29].position.set(myCenterX + 0.8, myCenterY - 16.4, myCenterZ);
    timeNumbers[31].position.set(myCenterX - 2.5, myCenterY - 16.4, myCenterZ);
    timeNumbers[30].position.set(myCenterX - 0.8, myCenterY - 16.5, myCenterZ);

    addedTimeNumbers = 1;
}

function placeDots()
{
    dots[0].position.set(-15 + 15, 15.5,  myCenterZ+dotsZ);
    dots[30].position.set(-15.1 + 15, -15.5,  myCenterZ+dotsZ);

    dots[1].position.set(-13.4 + 15, 15.4,  myCenterZ+dotsZ);
    dots[29].position.set(-13.5 + 15, -15.4,  myCenterZ+dotsZ);
    dots[59].position.set(-16.4 + 15, 15.4,  myCenterZ+dotsZ);
    dots[31].position.set(-16.75 + 15, -15.4,  myCenterZ+dotsZ);

    dots[2].position.set(-11.7 + 15, 15.2,  myCenterZ+dotsZ);
    dots[28].position.set(-11.9 + 15, -15.2,  myCenterZ+dotsZ);
    dots[58].position.set(-18 + 15, 15.2,  myCenterZ+dotsZ);
    dots[32].position.set(-18.3 + 15, -15.1,  myCenterZ+dotsZ);

    dots[3].position.set(-10.2 + 15, 14.7,  myCenterZ+dotsZ);
    dots[27].position.set(-10.3 + 15, -14.7,  myCenterZ+dotsZ);
    dots[57].position.set(-19.6 + 15, 14.8,  myCenterZ+dotsZ);
    dots[33].position.set(-19.95 + 15, -14.7,  myCenterZ+dotsZ);

    dots[4].position.set(-8.65 + 15, 14.2,  myCenterZ+dotsZ);
    dots[26].position.set(-8.75 + 15, -14.2,  myCenterZ+dotsZ);
    dots[56].position.set(-21 + 15, 14.2,  myCenterZ+dotsZ);
    dots[34].position.set(-21.45 + 15, -14.1, myCenterZ+dotsZ);

    dots[5].position.set(-7.15 + 15, 13.4,  myCenterZ+dotsZ);
    dots[25].position.set(-7.3 + 15, -13.4,  myCenterZ+dotsZ);
    dots[55].position.set(-22.5 + 15, 13.6,  myCenterZ+dotsZ);
    dots[35].position.set(-22.8 + 15, -13.3,  myCenterZ+dotsZ);

    dots[6].position.set(-5.8 + 15, 12.5,  myCenterZ+dotsZ);
    dots[24].position.set(-6 + 15, -12.5,  myCenterZ+dotsZ);
    dots[54].position.set(-23.9 + 15, 12.6,  myCenterZ+dotsZ);
    dots[36].position.set(-24.2 + 15, -12.4,  myCenterZ+dotsZ);

    dots[7].position.set(-4.7 + 15, 11.5,  myCenterZ+dotsZ);
    dots[23].position.set(-4.6 + 15, -11.55,  myCenterZ+dotsZ);
    dots[53].position.set(-25.1 + 15, 11.6,  myCenterZ+dotsZ);
    dots[37].position.set(-25.45 + 15, -11.3,  myCenterZ+dotsZ);

    dots[8].position.set(-3.45 + 15, 10.3,  myCenterZ+dotsZ);
    dots[22].position.set(-3.5 + 15, -10.3,  myCenterZ+dotsZ);
    dots[52].position.set(-26.4 + 15, 10.6,  myCenterZ+dotsZ);
    dots[38].position.set(-26.65 + 15, -10.2,  myCenterZ+dotsZ);


    dots[9].position.set(-2.45 + 15, 9.1,  myCenterZ+dotsZ);
    dots[21].position.set(-2.5 + 15, -9.2,  myCenterZ+dotsZ);
    dots[51].position.set(-27.4 + 15, 9.2,  myCenterZ+dotsZ);
    dots[39].position.set(-27.5 + 15, -9,  myCenterZ+dotsZ);

    dots[10].position.set(-1.6 + 15, 7.7,  myCenterZ+dotsZ);
    dots[20].position.set(-1.6 + 15, -7.9,  myCenterZ+dotsZ);
    dots[50].position.set(-28.2 + 15, 7.9,  myCenterZ+dotsZ);
    dots[40].position.set(-28.4 + 15, -7.6,  myCenterZ+dotsZ);

    dots[11].position.set(-0.8 + 15, 6.3,  myCenterZ+dotsZ);
    dots[19].position.set(-0.9 + 15, -6.45,  myCenterZ+dotsZ);
    dots[49].position.set(-29 + 15, 6.5,  myCenterZ+dotsZ);
    dots[41].position.set(-29.2 + 15, -6,  myCenterZ+dotsZ);

    dots[12].position.set(-0.25 + 15, 4.7,  myCenterZ+dotsZ);
    dots[18].position.set(-0.35 + 15, -4.8,  myCenterZ+dotsZ);
    dots[48].position.set(-29.6 + 15, 5,  myCenterZ+dotsZ);
    dots[42].position.set(-29.7 + 15, -4.7,  myCenterZ+dotsZ);

    dots[13].position.set(0.1 + 15, 3.2,  myCenterZ+dotsZ);
    dots[17].position.set(0 + 15, -3.3,  myCenterZ+dotsZ);
    dots[47].position.set(-30 + 15, 3.4,  myCenterZ+dotsZ);
    dots[43].position.set(-30. + 15, -3.1,  myCenterZ+dotsZ);

    dots[14].position.set(0.4 + 15, 1.6,  myCenterZ+dotsZ);
    dots[16].position.set(0.5 + 15, -1.6,  myCenterZ+dotsZ);
    dots[46].position.set(-30.4 + 15, 1.85,  myCenterZ+dotsZ);
    dots[44].position.set(-30.5 + 15, -1.4,  myCenterZ+dotsZ);

    dots[15].position.set(-1.35 + 16.7, 0, myCenterZ+dotsZ);
    dots[45].position.set(-30.5 + 15, 0.2,  myCenterZ+dotsZ);
}

var helpContent;
function initialiseHelp(){
    helpContent="";
    helpContent = helpContent + "<h2>Reading Analog Clock</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>To Read the time in the analog clock</p>";
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "Learn allows you to read the time in the clock<br>";
    helpContent = helpContent + "Next Example teaches the concept by taking another example.<br>";
    helpContent = helpContent + "Quiz Me questions your understanding of this concept.</p>";
    helpContent = helpContent + "<p>You can compute the quiz question before clicking any option</p>";
    helpContent = helpContent + "<p>You can pause and resume the animation by using the pause/play nutton on the top line</p>";
    helpContent = helpContent + "<p>You can slow down and speed up the animation by using the speed control buttons</p>";
    helpContent = helpContent + "<p>The round button is for resetting the animation.</p>";
    helpContent = helpContent + "<h2>Happy Experimenting</h2>";
    PIEupdateHelp(helpContent);
}

var infoContent;
function initialiseInfo(){
    infoContent =  "";
    infoContent = infoContent + "<h2>Experiment Concepts</h2>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<p>There are 3 hands to indicate hours, minutes, seconds</p>"; 
    infoContent = infoContent + "<p>To read the analogue clock, Use the little hand to read the hour (1-12), Use the big hand to read the minutes (0-60), Use the longest (thinnest) hand to read the seconds (0-60)</p>"; 
    infoContent = infoContent + "<p>Put these together to get the time in the Hours : minutes : seconds format</p>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
    PIEupdateInfo(infoContent);
}
