var mySceneTLX;        
var mySceneTLY;        
var mySceneBRX;        
var mySceneBRY;        
var mySceneW;          
var mySceneH;          
var myCenterX;         
var myCenterY;

var backB=-4.0;
var wallThickness;
var myBack;
var myBox1;
var geometry, material, loader, texture, font;
var header="";

var numberLabel1;
var numberLabel2;
var resultLabel;
var answerLablel;
var computeLabel;
var nextLabel;
var quizLabel;
var num1;
var num2;
var result, resText;
var answer;
var minNumber, maxNumber, numberStep;


var flag = 0,qflag=0;
var length=0;
var arrowHelper;
var n1, n2;
var farrow = 0;
var multiplicand, multiplier;
var stepResult = [];
var steps = [];
var options = [], optionsBox = [];
var stepCount = 0;
var numText1, numText2,text;
var multiplicandText, multiplierText, multiplication;
var mulLine, addLine;
var finalResult;
var mArrowLen = 0.1;
var step = [], stepR = [], stepA = [], boxR = [], box = [];
var mant1,mant2;
var correctOption, userOption;
var decimalPoint1="", decimalPoint2="", final_decimalPoint="";
var stepres,stepresbox;

var raycaster;
var INTERSECTED, intersects;
var mantbox;

function initialiseScene()
{
    mySceneTLX = 0.0;
    mySceneTLY = 3.0;
    mySceneBRX = 4.0;
    mySceneBRY = 0.0;
    mySceneW   = (mySceneBRX - mySceneTLX);
    mySceneH   = (mySceneTLY - mySceneBRY);
    myCenterX  = (mySceneTLX + mySceneBRX) / 2.0;
    myCenterY  = (mySceneTLY + mySceneBRY) / 2.0;
    wallThickness = 0.20;

    PIEscene.background=new THREE.Color( 0xbfd1e5 );
    PIEscene.add(new THREE.AmbientLight(0x606060));

    raycaster = new THREE.Raycaster();
    document.addEventListener('mousedown', ondocmousedown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false );
}

function intialiseOtherVariables()
{
    flag = -1;
    multiplierDigits = [];
    steps = [];
    stepCount = 0;
}

function loadFont()
{
    loader = new THREE.FontLoader();
    loader.load("fonts/optimer.json", function(response){
        font = response;  
    });
}

function setSliderVariables()
{
    numberLabel1 = "Number 1";
    numberLabel2 = "Number 2";
    resultLabel  = "Your Answer";
    answerLablel = "Actual Answer";
    computeLabel = "Compute";
    nextLabel    = "Next Example";
    quizLabel    = "Quiz Me!"

    num1 = getNumber();
    num2 = getNumber();

    minNumber  = 0.01;
    maxNumber  = 9.99;
    numberStep = 0.01;
}

function setSlider()
{
    setSliderVariables();

    PIEaddInputSlider(numberLabel1, num1, getNumber1, minNumber, maxNumber, numberStep);
    PIEaddInputSlider(numberLabel2, num2, getNumber2, minNumber, maxNumber, numberStep);
    num1 = num1.toFixed(2);
    num2 = num2.toFixed(2);
    PIEaddDisplayText(numberLabel1, num1);
    PIEaddDisplayText(numberLabel2, num2);
    PIEaddDualCommand(computeLabel,computeExpt);
    PIEaddDualCommand(nextLabel,nextExpt);
    PIEaddDualCommand(quizLabel,quizExpt);  
}

function loadExperimentElements()
{
    

    PIEsetExperimentTitle("Decimal Multiplication");
    PIEsetDeveloperName("Dattatreya Sarma");

    initialiseInfo();
    initialiseHelp();

    initialiseScene();
    loadFont();

    // geometry = new THREE.BoxGeometry(11,6, wallThickness );
    // material = new THREE.MeshLambertMaterial( {color:  0xbfd1e5} );
    // myBack = new THREE.Mesh( geometry, material );
    // myBack.position.set(myCenterX, myCenterY, -0.1);
    // myBack.castShadow = false;
    // myBack.receiveShadow = false;
    // PIEaddElement(myBack);

    geometry = new THREE.BoxGeometry(1.5,0.55,0 );
    material = new THREE.MeshLambertMaterial( {color: 0x222222} );
    headerBox = new THREE.Mesh( geometry, material );
    headerBox.position.set(myCenterX-0.3, myCenterY+1, 0);
    headerBox.castShadow = false;
    headerBox.receiveShadow = false;
    PIEaddElement(headerBox);



    setSlider();
    PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);
    resetExperiment();
}

function resetExperiment()
{
    initialiseScene();

    num1 = getNumber();
    num2 = getNumber();

    PIEchangeInputSlider(numberLabel2,num2);
    PIEchangeInputSlider(numberLabel1,num1);
    
    // length = 0;
    // arrowHelper.setLength(length);

    intialiseOtherVariables();

    exptType = "Compute";

    removeOptions();
    removeSteps();

    PIEstartAnimation();

}



function updateExperimentElements(t, dt)
{   
    //console.log(stepCount);
    if(exptType == "Quiz")
    {
        if(qflag == 0)
        {
            makeSteps();
            qflag++;
        }
        else if(qflag == 1)
        {
            removeSteps();
            qflag++;
        }
        else if(qflag == 2)
        {
            if(!font)
                qflag--;
            else
                headerText('?');
            qflag++;
        }
        else if (qflag >= 50 || qflag == -1)
        {
            qflag++;
            //alert(qflag);
        }
        if(qflag >= 150)
        {
            if(resText)
            {
                //alert("asdfg");
                PIEremoveElement(resText);
            }
            quizExpt();
        }
    }
    else
    {
        if(flag==0)
        {
            makeSteps();
        }
        if(flag == 1)
            removeSteps();
        if(flag == 2)
        {
            if(!font)
                flag--;
            else
                headerText('?');
        }
        if(flag >= 3)
        {
            
            if(!stepR[stepCount])
            {
                
                mulSteps(stepCount);
            }
            else
            {
                if(!stepA[stepCount])
                {
                    mulArrow(stepCount);
                }
                else
                {
                    mArrowLen = mArrowLen + 0.05;
                    stepA[stepCount].setLength(mArrowLen, mArrowLen/20, mArrowLen/40);
                    if(mArrowLen > 2)
                    {
                        mArrowLen = 0;
                        if(stepCount == 2)
                            stepCount = 2.5;
                        else if(stepCount == 3)
                            stepCount = 3.5;
                        else
                            stepCount++;
                    }
                    else if(stepCount > 4)
                        flag = 100;
                }
            }
        }

        if(flag == 100)
        {
            intialiseOtherVariables();
            headerText('');
            PIEstopAnimation();
        }
        if(flag<3)
            flag++;    
    }
    
    PIEchangeDisplayText(numberLabel1, num1);
    PIEchangeDisplayText(numberLabel2, num2);
}

function getNumber()
{  
    var min = 1;
    var max = 9;
    var decimalPlaces = 2;

    var rand = Math.random()*(max-min) + min;
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(rand*power) / power;
}

function getNumber1(newValue)
{
    num1 = newValue.toFixed(2);
}

function getNumber2(newValue)
{
    num2 = newValue.toFixed(2);
}


function makeSteps()
{
    var len1 = parseFloat(num1).toString().length;
    var len2 = parseFloat(num2).toString().length;
    if(len1 == len2)
    {
        n1 = parseFloat(Math.max(num1,num2));
        n2 = parseFloat(Math.min(num1,num2));
    }
    else if(len1 > len2)
    {
        n1 = parseFloat(num1);
        n2 = parseFloat(num2);
    }
    else
    {
        n1 = parseFloat(num2);
        n2 = parseFloat(num1);
    }
    var c1 = decimalPlaces(parseFloat(num1.toString()));
    var c2 = decimalPlaces(parseFloat(num2.toString()));
    var min,max;
    if(c1 == c2)
    {
        min = Math.min(num1, num2);
        max = Math.max(num1, num2);
    }
    else if(c1>c2)
    {
        max = num1;
        min = num2;
    }
    else
    {
        max = num2;
        min = num1;
    }
    max = addZeroesEnd(max.toString(),3);
    min = addZeroesEnd(min.toString(),3);
    multiplicand = (max.toString().replace(".", ""));
    multiplier   = (min.toString().replace(".", ""));


    if(exptType == 'Compute')
        getSteps();
    else
        generateOptions();
}

function getSteps()
{
    var tempMultiplicand = parseInt(multiplicand);
    var div=1,sum=0;
    for(var i=2; i>=0; i--)
    {
        var digit  = parseInt(multiplier[i]);
        steps[2-i] = tempMultiplicand+" x " + (digit*div);
        var mul    = digit * tempMultiplicand*div;
        sum = sum + mul;
        stepResult[2-i] = addZeroes(mul,5-i);
        div = div * 10;
    }
    sum = addZeroes(sum, 6);
    finalResult = parseFloat(n1*n2).toFixed(4).toString();
    steps[3] = "summation";
    stepResult[3] = sum;
    stepResult[4] = "4321"   
    steps[4] = "decimal places : 2+2 = 4";
    steps[5] = "add decimal point";
    steps[6] = "before last 4 digits"
}
function computeExpt()
{
    PIEstopAnimation();
    exptType = "Compute";
    header.visible = false;
    PIEremoveElement(header);
    removeOptions();
    removeSteps();
    intialiseOtherVariables();
    PIEstartAnimation();
}

function nextExpt()
{
    PIEstopAnimation();
    if(header != "")
        PIEremoveElement(header);
    resetExperiment();
}

function quizExpt()
{
    qflag = -1;
    PIEstopAnimation();
    removeSteps();
    exptType = "Quiz";
    num1 = getNumber();
    num2 = getNumber();
    PIEchangeInputSlider(numberLabel2,num2);
    PIEchangeInputSlider(numberLabel1,num1);
    
    removeOptions();

    PIEstartAnimation();
}

function onDocumentMouseMove( event )
{
    event.preventDefault();
    raycaster.setFromCamera( PIEmouseP, PIEcamera );
    intersects = raycaster.intersectObjects(optionsBox);
    if ( intersects.length)
    {
        for(var i=0; i<intersects.length; i++)
        {
            var intersection = intersects[ i ],
            obj = intersection.object;
            ////console.log("object:", obj);
        }
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
        for(var i=0; i<4; i++)
            if(i!= obj.name)
            {
                PIEremoveElement(options[i]);
                PIEremoveElement(optionsBox[i]);
            }
        if(obj.name == correctOption)
        {
            obj.material.color.setHex('0x00ff00');
            geometry = getGeometry("Correct",0.1);
            resText = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x00ff00}));
            PIEaddElement(resText);
        }
        else
        {
            obj.material.color.setHex('0xff0000');
            geometry = getGeometry("Wrong",0.1);
            resText = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xff0000}));
            PIEaddElement(resText);
        }
        switch(obj.name)
        {
            case "0": resText.position.set(myCenterX+1.1, myCenterY+0.05, 0);
                      break;

            case "1": resText.position.set(myCenterX-1.5, myCenterY+0.05, 0);
                      break;
            case "2": resText.position.set(myCenterX+1.1, myCenterY-0.45, 0);
                      break;
            case "3": resText.position.set(myCenterX-1.5, myCenterY-0.45, 0);
                      break;
        }
        if(parseInt(obj.name)%2)
            resText.position.set(myCenterX-1.8, myCenterY-0.25, 0);
        else
            resText.position.set(myCenterX+0.8, myCenterY-0.25, 0);
        qflag = 50;
    }
}

function generateOptions()
{
    var result = parseFloat(n1*n2).toFixed(4);
    var arr = result.split('.');
    var num = parseInt(arr[0]);
    var tempOptions = [];
    tempOptions[0] = result;
    tempOptions[1] = (num - 1) + '.' + (parseInt(arr[1])+1100).toString().substring(0, 4);
    tempOptions[2] = (num+1)   + '.' + (parseInt(arr[1])+1010).toString().substring(0, 4);
    tempOptions[3] = num       + '.' + (parseInt(arr[1])+2010).toString().substring(0, 4);
    
    //console.log(tempOptions);
    tempOptions = shuffle(tempOptions);
    //console.log(tempOptions);

    
    geometry = getGeometry(tempOptions[0],0.1);
    options[0] = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
    options[0].position.set(myCenterX-1.8, myCenterY, 0);
    PIEaddElement(options[0]);

    geometry = new THREE.BoxGeometry(1,0.3,0);
    material = new THREE.MeshLambertMaterial( {color: 0x222222});
    optionsBox[0] = new THREE.Mesh( geometry, material );
    optionsBox[0].position.set(myCenterX-1.5, myCenterY+0.05, 0);
    optionsBox[0].castShadow = false;
    optionsBox[0].receiveShadow = false;
    optionsBox[0].name = "0";
    PIEaddElement(optionsBox[0]);

    optionsBox[0].addEventListener('click', function(){
        alert("clicked");
    });

    geometry = getGeometry(tempOptions[1],0.1);
    options[1] = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
    options[1].position.set(myCenterX+0.8, myCenterY, 0);
    PIEaddElement(options[1]);

    geometry = new THREE.BoxGeometry(1,0.3,0);
    material = new THREE.MeshLambertMaterial( {color: 0x222222});
    optionsBox[1] = new THREE.Mesh( geometry, material );
    optionsBox[1].position.set(myCenterX+1.1, myCenterY+0.05, 0);
    optionsBox[1].castShadow = false;
    optionsBox[1].receiveShadow = false;
    optionsBox[1].name = "1";
    PIEaddElement(optionsBox[1]);


    geometry = getGeometry(tempOptions[2], 0.1);
    options[2] = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
    options[2].position.set(myCenterX-1.8, myCenterY-0.5, 0);
    PIEaddElement(options[2]);

    geometry = new THREE.BoxGeometry(1,0.3,0);
    material = new THREE.MeshLambertMaterial( {color: 0x222222});
    optionsBox[2] = new THREE.Mesh( geometry, material );
    optionsBox[2].position.set(myCenterX-1.5, myCenterY-0.45, 0);
    optionsBox[2].castShadow = false;
    optionsBox[2].receiveShadow = false;
    optionsBox[2].name = "2";
    PIEaddElement(optionsBox[2]);


    geometry = getGeometry(tempOptions[3], 0.1);
    options[3] = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
    options[3].position.set(myCenterX+0.8, myCenterY-0.5, 0);
    PIEaddElement(options[3]);

    geometry = new THREE.BoxGeometry(1,0.3,0);
    material = new THREE.MeshLambertMaterial( {color: 0x222222});
    optionsBox[3] = new THREE.Mesh( geometry, material );
    optionsBox[3].position.set(myCenterX+1.1, myCenterY-0.45, 0);
    optionsBox[3].castShadow = false;
    optionsBox[3].receiveShadow = false;
    optionsBox[3].name = "3";
    PIEaddElement(optionsBox[3]);

    // PIEsetClick(optionsBox[0], checkResult1);
    // PIEsetClick(optionsBox[1], checkResult2);
    // PIEsetClick(optionsBox[2], checkResult3);
    // PIEsetClick(optionsBox[3], checkResult4);

    for(var i=0; i<4; i++)
    {
        if(tempOptions[i] == result)
        {
            correctOption = i.toString();
            break;
        }
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
function headerText(symbol)
{
    var result="?",data;
    if(header != "")
        PIEremoveElement(header);
    if(symbol != '?')
    {
       result = parseFloat(n1*n2).toFixed(4).toString();
    }
    var max = addZeroesEnd(Math.max(num1, num2).toString());
    var min = addZeroesEnd(Math.min(num1, num2).toString());
    if(exptType == "Compute")
        data =  max + " x " + min + " = " + result;
    else
        data = "   "+ max + "  x  " + min + "  =  " + result;
    
    geometry = getGeometry(data, 0.1);
    header = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
    header.position.set(myCenterX-1, myCenterY+1, 0);
    header.castShadow = false;
    header.receiveShadow = false;
    header.visible = true;
    PIEaddElement(header);

    if(exptType == "Compute" && symbol == '?')
        showSteps();   
}

function showSteps()
{
    geometry = new THREE.BoxGeometry(1,0.55,0 );
    material = new THREE.MeshLambertMaterial( {color: 0x222222} );
    myBox1 = new THREE.Mesh( geometry, material );
    myBox1.position.set(myCenterX-1.7, myCenterY+0.2, 0);
    myBox1.castShadow = false;
    myBox1.receiveShadow = false;
    PIEaddElement(myBox1);
    
    multiplicand =  multiplicand.split('').join(' ');
    geometry = getGeometry(multiplicand, 0.1);
    multiplicandText = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
    multiplicandText.position.set(myCenterX-1.6, myCenterY+0.3, 0);
    multiplicandText.castShadow = false;
    multiplicandText.receiveShadow = false;
    multiplicandText.visible = true;
    PIEaddElement(multiplicandText);

    geometry =  getGeometry('x',0.1);
    multiplication = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
    multiplication.position.set(myCenterX-1.8, myCenterY+0.2, 0);
    multiplication.castShadow = false;
    multiplication.receiveShadow = false;
    multiplication.visible = true;
    PIEaddElement(multiplication);

    multiplier =  multiplier.split('').join(' ');
    geometry = getGeometry(multiplier, 0.1);
    multiplierText = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
    multiplierText.position.set(myCenterX-1.6, myCenterY+0.1, 0);
    multiplierText.castShadow = false;
    multiplierText.receiveShadow = false;
    multiplierText.visible = true;
    PIEaddElement(multiplierText);

    geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3( myCenterX-1.19, myCenterY, 0.001),
        new THREE.Vector3( myCenterX-2.2, myCenterY, 0.001)
    );
    mulLine = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xffffff}));
    PIEaddElement(mulLine);
}

function mulSteps(i)
{
    if(i==2.5)
        AddLine();
    else if(i==3.5)
        addDecimalPoints();
    else if(i==4)
    {
        addStep(i,0.07);
        addStepResult(i);
    }
    else if(i==5)
        addStep(i,0.07);
    else if(i==6)
    {
        mulArrow(i);
    }
    else if(i==7)
    {
        addStep(i,0.07);
        addStep(6,0.07);
    }
    else if(i==8)
    {
        addDecimalPosition();
    }
    else
    {
        if(stepCount == 3)
        {
            addStep(stepCount,0.07);
        }
        else
             addStep(stepCount,0.07);
        addStepResult(stepCount);
    }    
}

function addDecimalPosition()
{
    //alert("addDecimalPosition")
    if(!final_decimalPoint)
    {
        geometry = new THREE.CircleGeometry( 0.01, 32 );
        material = new THREE.MeshBasicMaterial( { color: 0x111155 } );
        final_decimalPoint = new THREE.Mesh( geometry, material );
        final_decimalPoint.position.set(myCenterX+1.62,myCenterY-1.04,0);
        PIEaddElement(final_decimalPoint);
        
    }
    else
    {
        var x = final_decimalPoint.position.x;
        var y = final_decimalPoint.position.y;
        var z = final_decimalPoint.position.z;

        if(x>0.292)
        {
            x = x - 0.03;
            if(x>0.292)
                x = x - 0.01;
            final_decimalPoint.position.set(x,y,z);
        }
        else
        {
            if(y<0.76)
                y = y+0.05;
            else
            {
                stepCount++;
                flag = 100;
            }
            if(y>0.61)
                final_decimalPoint.material.color.setHex('0xffffff');
            final_decimalPoint.position.set(x,y,z);
            //alert(y);
        }
    }
}
function addStep(i,size)
{
        if(i!=4) {
            if(i==5)
            {
                i--;
                stepCount++;
            }
            else if(i==7)
            {
                i = 5;
                stepCount++;
            }
        var y  = i*0.18;
        geometry = getGeometry(steps[i], size);
        step[i] = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
        step[i].position.set(myCenterX+1.3, myCenterY-0.2-y, 0);
        step[i].castShadow = false;
        step[i].receiveShadow = false;
        step[i].visible = true;
        PIEaddElement(step[i]);

        y = (i+1)*0.2;
        if(i==6)
            y = y-0.2;
        geometry = new THREE.BoxGeometry(1.45,0.3,0 );
        material = new THREE.MeshLambertMaterial( {color: 0x222222} );
        box[i] = new THREE.Mesh( geometry, material );
        box[i].position.set(myCenterX+1.8, myCenterY-y, 0);
        box[i].castShadow = false;
        box[i].receiveShadow = false;
        PIEaddElement(box[i]);
    }
    else if(i==4)
    {
        var x1 = decimalPoint1.position.x;
        var y1 = decimalPoint1.position.y;
        var z1 = decimalPoint1.position.z;

        var x2 = decimalPoint2.position.x;
        var y2 = decimalPoint2.position.y;
        var z2 = decimalPoint2.position.z;

        var max = addZeroesEnd(Math.max(num1, num2).toString());
        var min = addZeroesEnd(Math.min(num1, num2).toString());
        geometry = getGeometry( "decimal places for", size);
        material =  new THREE.MeshBasicMaterial({color:0xffffff});
        
        mant1 = new THREE.Mesh(geometry, material);
        mant1.castShadow = false;
        mant1.receiveShadow = false;
        mant1.visible = true;
        mant1.position.set(x1+0.5,y1,z1);
        PIEaddElement(mant1);

        geometry = getGeometry( max+" : 2 , "+min+" : 2", size);
        mant2 = new THREE.Mesh(geometry, material);
        mant2.castShadow = false;
        mant2.receiveShadow = false;
        mant2.visible = true;
        mant2.position.set(x2+0.5,y2,z2);
        PIEaddElement(mant2);
        stepCount++;

        geometry = new THREE.BoxGeometry(0.96,0.45,0 );
        material = new THREE.MeshLambertMaterial( {color: 0x222222} );
        mantbox = new THREE.Mesh( geometry, material );
        mantbox.position.set(myCenterX-0.6, myCenterY+0.25, 0);
        mantbox.castShadow = false;
        mantbox.receiveShadow = false;
        PIEaddElement(mantbox);

        mulArrow(stepCount);

    }

}

function addStepResult(i)
{
        var y  = i*0.18;
        len = stepResult[i].toString().length;
        var x = (9-len)*0.12;
        stepResult[i] = stepResult[i].toString().split('').join(' ');
        var size = 0.1,color = 0xffffff;
        if(i==4)
        {
            size = 0.1;
            color = 0x222111;
        }
        geometry = getGeometry(stepResult[i], size);
        material = new THREE.MeshBasicMaterial({color:color});
        stepR[i] = new THREE.Mesh(geometry, material);
        stepR[i].position.set(myCenterX-2.3+x, myCenterY-0.2-y, 0);
        PIEaddElement(stepR[i]);
        if(i!=4){
        y = (i+1)*0.2;
        geometry = new THREE.BoxGeometry(1,0.29,0 );
        material = new THREE.MeshLambertMaterial( {color: 0x222222} );
        boxR[i] = new THREE.Mesh( geometry, material );
        boxR[i].position.set(myCenterX-1.7, myCenterY-y, 0);
        boxR[i].castShadow = false;
        boxR[i].receiveShadow = false;
        PIEaddElement(boxR[i]);
    }
}

function addDecimalPoints()
{
    if(!decimalPoint1)
    {
        geometry = new THREE.CircleGeometry( 0.01, 32 );
        material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        decimalPoint1 = new THREE.Mesh( geometry, material );
        decimalPoint1.position.set(myCenterX-0.47,myCenterY+1,0);
        PIEaddElement(decimalPoint1);

        geometry = new THREE.CircleGeometry( 0.01, 32 );
        material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        decimalPoint2 = new THREE.Mesh( geometry, material );
        decimalPoint2.position.set(myCenterX-0.905,myCenterY+1,0);
        PIEaddElement(decimalPoint2);
    }
    else
    {
        var x1 = decimalPoint1.position.x;
        var y1 = decimalPoint1.position.y;
        var z1 = decimalPoint1.position.z;
        var x2 = decimalPoint2.position.x;
        var y2 = decimalPoint2.position.y;
        var z2 = decimalPoint2.position.z;
        
        if(y2 > 1.62)
        {
            y1 = y1 - 0.1/10;
            y2 = y2 - 0.12857142/10;
            if(y1<2.25)
                decimalPoint1.material.color.setHex('0x111155');
            if(y2<2.25)
                decimalPoint2.material.color.setHex('0x111155');
            decimalPoint1.position.set(x1,y1,z1);
            decimalPoint2.position.set(x2,y2,z2);

        }
        else
        {
            if(x2 > 0.495)
            {
                x1 = x1 - 0.017333;
                x2 = x2 - 0.01;
                if(x1 < 0.77)
                    decimalPoint1.material.color.setHex('0xffffff');
                if(x2 < 0.77)
                    decimalPoint2.material.color.setHex('0xffffff');
                decimalPoint1.position.set(x1,y1,z1);
                decimalPoint2.position.set(x2,y2,z2);
            }
            else
                stepCount = 4;
        }
    }
    
}

function AddLine()
{
    
    if(!addLine)
    {
        geometry = new THREE.Geometry();
        geometry.vertices.push(
        new THREE.Vector3( myCenterX-1.19, myCenterY, 0.001),
        new THREE.Vector3( myCenterX-2.2, myCenterY, 0.001)
        );
        geometry.verticesNeedUpdate = true;
        addLine = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xffffff}));
        PIEaddElement(addLine);
    }
    else
    {
        var x = addLine.position.x;
        var y = addLine.position.y;
        var z = addLine.position.z;

        if(y <= -0.6)
            stepCount = 3;
        else
        {
            y = y-0.01;
            addLine.position.set(x,y,z);
        }
    }
}
function mulArrow(i)
{
        var temp = 0;
        if(i==6)
        {
            i = 4;
            temp = 1;
        }
        if(!stepA[i])
        {
            var y  = i*0.18;
            var dir = new THREE.Vector3( -1, 0, 0 );
            dir.normalize();
            var origin = new THREE.Vector3( myCenterX+1, myCenterY-0.15-y, 0 );
            var hex = 0x000000;
            length  = 0;
            stepA[i] = new THREE.ArrowHelper( dir, origin, length, hex, 0, 0 );
            PIEaddElement( stepA[i] );
        }

        if(temp)
        {
            if(farrow > 2)
            {
                stepCount++;
            }
            else
                farrow = farrow + 0.05;
            stepA[4].setLength(farrow, farrow/20, farrow/40);
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

function checkResult1()
{
    userOption = 1;
    if(userOption == correctOption)
        alert("Right");
    else
        alert("Wrong");
}
function checkResult1()
{
    userOption = 2;
    if(userOption == correctOption)
        alert("Right");
    else
        alert("Wrong");
}
function checkResult1()
{
    userOption = 3;
    if(userOption == correctOption)
        alert("Right");
    else
        alert("Wrong");
}
function checkResult1()
{
    userOption = 4;
    if(userOption == correctOption)
        alert("Right");
    else
        alert("Wrong");
}

function removeOptions()
{
    if(options)
    {
        if(options.length)
        {
            for(var i=0; i<4; i++)
            {
                options[i].visible = false;
                PIEremoveElement(options[i]);
            }
        }
    }
    if(optionsBox)
    {
        if(optionsBox.length)
        {
            for(var i=0; i<4; i++)
            {
                PIEremoveElement(optionsBox[i]);
            }
        }
    }
}

function removeSteps()
{
    if(multiplicandText)
    {
        PIEremoveElement(multiplicandText);
    }
    if(multiplierText)
    {
        PIEremoveElement(multiplierText);
    }
    if(multiplication)
    {
        PIEremoveElement(multiplication);
    }
    removeStepResArr();
    removeStepResBox();
    removeStepBox();
    removeStepArr();
    removeStepArrow();
    removeDecimal();
    removeLines();
    if(mant1)
        PIEremoveElement(mant1);
    if(mant2)
        PIEremoveElement(mant2);
    if(mantbox)
        PIEremoveElement(mantbox);
}
function removeLines()
{
    if(mulLine)
    {
        PIEremoveElement(mulLine);
        mulLine ="";
    }
    if(addLine)
    {
        PIEremoveElement(addLine);
        addLine="";
    }
}
function removeDecimal()
{
    if(decimalPoint1)
    {
        PIEremoveElement(decimalPoint1);
        decimalPoint1 ="";
    }
    if(decimalPoint2)
    {
        PIEremoveElement(decimalPoint2);
        decimalPoint2="";
    }
    if(final_decimalPoint)
    {
        PIEremoveElement(final_decimalPoint);
        final_decimalPoint="";
    }
    if(myBox1)
    {
        PIEremoveElement(myBox1);
        myBox1="";
    }
}
function removeStepArrow()
{
    if(stepA)
    {
        //alert("stepR:\n"+stepR);
        if(stepA.length)
        {
            for(var i =0; i<stepA.length; i++)
            {
                stepA[i].visible = false;
                PIEremoveElement(stepA[i]);
            }
            stepA = [];
        }
    }
}
function removeStepResArr()
{
    
    if(stepR)
    {
        //alert("stepR:\n"+stepR);
        if(stepR.length)
        {
            for(var i =0; i<stepR.length; i++)
            {
                stepR[i].visible = false;
                PIEremoveElement(stepR[i]);
            }
            stepR = [];
        }
    }
}
function removeStepResBox()
{
    if(boxR)
    {
        if(boxR.length)
        {
            for(var i=0; i<boxR.length; i++)
            {
                boxR[i].visible = false;
                PIEremoveElement(boxR[i]);
            }
            boxR = [];
        }
    }
}
function removeStepBox()
{
    if(box)
    {
        if(box.length)
        {
            for(var i=0; i<box.length; i++)
            {
                box[i].visible = false;
                PIEremoveElement(box[i]);
            }
        }
        box = [];
    }
}
function removeStepArr()
{
    if(step)
    {
        //alert(step.length);
        if(step.length)
        {
            for(var i =0; i<step.length; i++)
            {
                step[i].visible = false;
                PIEremoveElement(step[i]);
            }
        }
        step = [];
    }
}
function addZeroes( num, size ) {
    if(num.toString().length >= size)
        return num;
    var zeroes = "";
    for(var i=1; i<size; i++)
        zeroes = zeroes +"0";
    var s = zeroes + num;
    return s.substr(s.length-size);
}

function addZeroesEnd( num ) {
    var value = Number(num);
    var res = num.split(".");
    if(res.length == 1 || (res[1].length < 3)) {
        value = value.toFixed(2);
    }
    return value
}
function decimalPlaces(num) {
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(0,(match[1] ? match[1].length : 0)-(match[2] ? +match[2] : 0));
}

function removeMantissa()
{
    mant1.visible = false;
    mant2.visible = false;
    PIEremoveElement(mant1);
    PIEremoveElement(mant2);
}

var helpContent;
function initialiseHelp()
{
    helpContent="";
    helpContent = helpContent + "<h2>Decimal Multiplication experiment help</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>The experiment shows multiplication of 2 decimal numbers (multiplicand x multiplier)</p>"
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "<p>The top line has animation controls. There are three stages of the experiment.</p>";
    helpContent = helpContent + "<h3>The animation stage</h3>";
    helpContent = helpContent + "<p>In the animation stage, the decimal multiplication will be shown in step by step process.</p>";
    helpContent = helpContent + "<p>The right hand panel now shows the values of the two numbers and 3 buttons during animation.</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li>Number1&nbsp;&nbsp;:&nbsp;Shows the value of Number1.</li>";
    helpContent = helpContent + "<li>Number2&nbsp;&nbsp;:&nbsp;Shows the value of Number2.</li>";
    helpContent = helpContent + "<li>Compute&nbsp;:&nbsp;Button which shows the computation of the decimal multiplication of 2 numbers with values in above 2 columns when clicked</li>";
    helpContent = helpContent + "<li>Next Example&nbsp;:&nbsp;Button which shows another example of multiplication with a new pair of numbers when clicked</li>";
    helpContent = helpContent + "<li>Quiz Me!&nbsp;:&nbsp;Button which shows a quiz question to solve when clicked</li>";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<h3>The Input stage</h3>";
    helpContent = helpContent + "<p>In this stage, you can give the input values to compute the multiplication in the control window at the right.</p>";
    helpContent = helpContent + "<p>The right hand panel now shows the values of the two numbers and 3 buttons</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li>Number1&nbsp;&nbsp;:&nbsp;Slider to give the input value of Number1.</li>";
    helpContent = helpContent + "<li>Number2&nbsp;&nbsp;:&nbsp;Slider to give the input value of Number2.</li>";
    helpContent = helpContent + "<li>Compute&nbsp;:&nbsp;Button which shows the computation of the decimal multiplication of 2 numbers with values in above 2 columns when clicked</li>";
    helpContent = helpContent + "<li>Next Example&nbsp;:&nbsp;Button which shows another example of multiplication with a new pair of numbers when clicked</li>";
    helpContent = helpContent + "<li>Quiz Me!&nbsp;:&nbsp;Button which shows a quiz question to solve when clicked</li>";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<h3>The Quiz stage</h3>";
    helpContent = helpContent + "<p>In this stage, you can solve and choose the answer for the given multiplication question.</p>";
    helpContent = helpContent + "<p>You can compute the quiz question by clicking on the 'Compute' button in the panel.</p>";
    helpContent = helpContent + "<p>You can pause and resume the animation by using the pause/play nutton on the top line</p>";
    helpContent = helpContent + "<p>The round button is for resetting the animation</p>";
    helpContent = helpContent + "<h2>Happy Experimenting</h2>";
    PIEupdateHelp(helpContent);
}

var infoContent;
function initialiseInfo()
{
    infoContent =  "";
    infoContent = infoContent + "<h2>Decimal Multiplication</h2>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<p>The experiment shows multiplication of 2 decimal numbers (multiplicand x multiplier)</p>";
    infoContent = infoContent + "<h3>Multiplication</h3>";
    infoContent = infoContent + "<p>Decimal Multiplication involves two steps</p>";
    infoContent = infoContent + "<h4>1. Multiply without decimal point</h4>";
    infoContent = infoContent + "<p>Multiply the two numbers by taking individual multiplication (multiplicand x digit) with digit position (ones, tens, hundreds...) from the multiplier. Now add all the individual multiplication results which gives the final multiplication result.</p>";
    infoContent = infoContent + "<p>Example: 497 x 266</p>";
    infoContent = infoContent + "<ol><li>497 x 6 = 2982</li>";
    infoContent = infoContent + "<li>497 x 60 = 29820</li>";
    infoContent = infoContent + "<li>497 x 200 = 99400</li></ol>";
    infoContent = infoContent + "<p>Answer : 497 x 266 = 99400</p>";
    infoContent = infoContent + "<h3>2. Add the decimal point</h3>";
    infoContent = infoContent + "<p>Place the decimal point in the answer by starting at the right and moving a number of places equal to the sum of the decimal places in both numbers multiplied.</p>";
    infoContent = infoContent + "<p>Example 4.97 x 2.66</p>";
    infoContent = infoContent + "<ol><li>497 x 266 = 99400</li>";
    infoContent = infoContent + "<li>Decimal places for 4.97 = 2</li>";
    infoContent = infoContent + "<li>Decimal places for 2.66 = 2</li>";
    infoContent = infoContent + "<li>total decimal places = 4</li>";
    infoContent = infoContent + "<li>99400 => 9.9400 (4 decimal places)</li></ol>";
    infoContent = infoContent + "<p>Answer : 4.97 x 2.66 = 9.9400</p>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
    PIEupdateInfo(infoContent);
}
