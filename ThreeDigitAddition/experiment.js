var mySceneTLX;        
var mySceneTLY;        
var mySceneBRX;        
var mySceneBRY;        
var mySceneW;          
var mySceneH;          
var myCenterX;         
var myCenterY;
var num1,num2, res;
var number1Label,number2Label;

var geometry, material, loader, font;
var notes = [], resText=[];
var ones=[], tens=[], hunds=[];
var dones=[], dtens=[], dhunds=[];
var num1NotesCount = [], num2NotesCount = [], resNotesCount = [];
var oc=0,tc=0,hc=0,mc=0;
var loadedMoney = 0,droppedTens=0,droppedHunds=0,droppedOnes=0;
var mtc=0,mhc=0,moc=0;

var carryTen, carryHund, carryThousand;
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

function getNumber1(newVal)
{
    num1 = newVal;
}

function getNumber2(newVal)
{
    num2 = newVal;
}

function setSlider()
{
    setInput();

    PIEaddInputSlider("Number-1", num1, getNumber1, 100, 999, 1);
    PIEaddInputSlider("Number-2", num2, getNumber2, 100, 999, 1);
    PIEaddDisplayText("Number-1", num1);
    PIEaddDisplayText("Number-2", num2);
    PIEaddDualCommand("Learn Steps",computeExpt);
    //PIEaddDualCommand("Next Example",nextExpt);
    //PIEaddDualCommand("Quiz Me!",quizExpt);  
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

function computeExpt()
{
    initialiseVariables();
    removeElements();
    PIEstartAnimation();
}

function nextExpt()
{
    resetExperiment();
    PIEstartAnimation();
}

function quizExpt()
{

}

function initialiseScene()
{
    mySceneTLX = -20.0;
    mySceneTLY = 20.0;
    mySceneBRX = 20.0;
    mySceneBRY = -20.0;
    mySceneW   = (mySceneBRX - mySceneTLX);
    mySceneH   = (mySceneTLY - mySceneBRY);
    myCenterX  = (mySceneTLX + mySceneBRX) / 2.0;
    myCenterY  = (mySceneTLY + mySceneBRY) / 2.0;
    myCenterZ  = -15.0;

    PIEscene.background=new THREE.Color( 0xbfd1e5 );
    PIEscene.add(new THREE.AmbientLight(0x606060));

    document.getElementById(">>").addEventListener("click", speedUp);
    document.getElementById("<<").addEventListener("click", speedDown);
}


function loadExperimentElements()
{

    PIEsetExperimentTitle("Three Digit Addition");
    PIEsetDeveloperName("Dattatreya Sarma");

    initialiseScene();
    initialiseInfo();
    initialiseHelp();
    setSlider();

    loader = new THREE.FontLoader();
    loader.load("fonts/optimer.json", function(response){
        font = response;  
    });

    geometry = new THREE.CircleGeometry(2, 64);
    var texture = new THREE.TextureLoader().load('images/1.png');
    material = new THREE.MeshBasicMaterial({map: texture});
    notes[0] = new THREE.Mesh(geometry, material);
    notes[0].visible = false;
    PIEaddElement(notes[0]);

    geometry = new THREE.BoxGeometry(12,6.8, 0.1);
    var texture = new THREE.TextureLoader().load('images/10.png');
    material = new THREE.MeshBasicMaterial({map: texture});
    notes[1] = new THREE.Mesh(geometry, material);
    notes[1].visible = false;
    PIEaddElement(notes[1]);

    geometry = new THREE.BoxGeometry(15,7.5, 0.1);
    var texture = new THREE.TextureLoader().load('images/100.png');
    material = new THREE.MeshBasicMaterial({map: texture});
    notes[2] = new THREE.Mesh(geometry, material);
    notes[2].visible = false;
    PIEaddElement(notes[2]);

    geometry = new THREE.BoxGeometry(20,10, 0.1);
    var texture = new THREE.TextureLoader().load('images/1000.png');
    material = new THREE.MeshBasicMaterial({map: texture});
    notes[3] = new THREE.Mesh(geometry, material);
    notes[3].visible = false;
    PIEaddElement(notes[3]);

    resetExperiment();

    PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY); 

}

function initialiseVariables()
{
    loadedMoney = 0;
    mc = 0.5;
    moc=0;
    mtc=0;
    mhc=0;
    hc=0;
    tc=0;
    oc =0;
}

function removeElements()
{
    for(var i=0; i<ones.length; i++)
    {
        PIEremoveElement(ones[i]);
    }
    for(var i=0; i<tens.length; i++)
    {
        PIEremoveElement(tens[i]);
    }
    for(var i=0; i<hunds.length; i++)
    {
        PIEremoveElement(hunds[i]);
    }
    for(var i=0; i<resText.length; i++)
    {
        PIEremoveElement(resText[i]);
    }
    for(var i=0; i<num1NotesCount.length; i++)
    {
        PIEremoveElement(num1NotesCount[i]);
    }
    for(var i=0; i<num2NotesCount.length; i++)
    {
        PIEremoveElement(num2NotesCount[i]);
    }
    for(var i=0; i<resNotesCount.length; i++)
    {
        PIEremoveElement(resNotesCount[i]);
    }
    if(carryTen)
        PIEremoveElement(carryTen);
    if(carryThousand)
        PIEremoveElement(carryThousand);
    if(carryHund)
        PIEremoveElement(carryHund);
    droppedOnes = 0;
    droppedTens = 0;
    droppedHunds = 0;
    dones = [];
    dtens = [];
    dhunds = [];
    ones = [];
    tens = [];
    hunds = [];
    resText = [];
    resNotesCount = [];
    num1NotesCount = [];
    num2NotesCount = [];
    loadedMoney = 0;

}
function resetExperiment()
{
    setInput();
    initialiseVariables();
    removeElements();
    PIEchangeInputSlider("Number-2",num2);
    PIEchangeInputSlider("Number-1",num1);
    PIEchangeDisplayText("Number-1", num1);
    PIEchangeDisplayText("Number-2", num2);
    //PIEstartAnimation();
}

function updateExperimentElements(t, dt)
{
    if(font && !loadedMoney)
        loadMoney();
    if(ones.length == 0)
        droppedOnes = 1;
    if(tens.length == 0)
        droppedTens = 1;
    if(hunds.length == 0)
        droppedHunds = 1;
    if(loadedMoney && !droppedOnes)
    {
        if(oc==10 && !carryTen)
        {
            for(var i=0; i<10; i++)
                PIEremoveElement(ones[i]);
            //alert("oc:"+oc);
            carryTen = notes[1].clone();
            carryTen.visible = true;
            carryTen.position.set(myCenterX+25, myCenterY-14, myCenterZ-(tens.length)*0.3);
            PIEaddElement(carryTen);
            mtc++;
            moc=0;
            if(resNotesCount[1])
                    PIEremoveElement(resNotesCount[1]);
                material  = new THREE.MeshBasicMaterial({color:0xffffff});
                resNotesCount[1] = new THREE.Mesh(getGeometry(mtc,1.5),material);
                resNotesCount[1].position.set(myCenterX+2.5, myCenterY-18.6, myCenterZ);
                PIEaddElement(resNotesCount[1]);
            if(resNotesCount[0])
                    PIEremoveElement(resNotesCount[0]);
                var tx = myCenterX+25, ty = myCenterY-18.3,tz = myCenterZ;
                material = new THREE.MeshBasicMaterial({color : 0xffffff});
                resNotesCount[0] = new THREE.Mesh(getGeometry(moc,1.5),material);
                resNotesCount[0].position.set(tx,ty,tz);
                PIEaddElement(resNotesCount[0]);
        }
        else if(carryTen && carryTen.position.x > myCenterX+9.4)
        {
            x = carryTen.position.x;
            x = x - mc;
            carryTen.position.set(x,carryTen.position.y, carryTen.position.z);
        }
        else if(oc == ones.length)
        {
            if(carryTen && carryTen.position.x > myCenterX+9.4)
            {
                x = carryTen.position.x;
                x = x - mc;
                carryTen.position.set(x,carryTen.position.y, carryTen.position.z);
            }
            else
                droppedOnes = 1;
        }
        else if(!dones[oc])
        {
            x = ones[parseInt(oc)].position.x;
            y = ones[parseInt(oc)].position.y;
            z = ones[parseInt(oc)].position.z;

            y = y - mc;
            if(oc < num1%10)
            {
                if(oc<5)
                {
                    distY = 12;
                }
                else
                {
                    distY = 13;
                }
            }
            else if(num2%10>=5 && (oc-num1%10)<5)
                distY = 14;
            else
                distY = 15;
            y = y - mc;
            if(y<myCenterY-distY)
            {
                dones[oc] = 1;
                oc++;
                moc++;
                ////alert(oc);
                if(resNotesCount[0])
                    PIEremoveElement(resNotesCount[0]);
                var tx = myCenterX+25, ty = myCenterY-18.3,tz = myCenterZ;
                material = new THREE.MeshBasicMaterial({color : 0xffffff});
                resNotesCount[0] = new THREE.Mesh(getGeometry(moc,1.5),material);
                resNotesCount[0].position.set(tx,ty,tz);
                PIEaddElement(resNotesCount[0]);
            }
            else
                ones[oc].position.set(x,y,z);
        }
        
    }
    if(droppedOnes==1 && droppedTens==0)
    {
        if(tc==10 && !carryTen && !carryHund)
        {
            
            for(var i=0; i<10; i++)
                PIEremoveElement(tens[i]);
            carryHund = notes[2].clone();
            carryHund.visible = true;
            carryHund.position.set(myCenterX+9.5, myCenterY-14, myCenterZ-(tens.length * 0.3));
            PIEaddElement(carryHund);
            mtc = 0;
            mhc++;

        }
        else if(tc == tens.length)
        {
            
            if(carryHund && carryHund.position.x > myCenterX-12)
            {
                x = carryHund.position.x;
                y = carryHund.position.y;
                z = carryHund.position.z;

                x = x - mc;
                carryHund.position.set(x,y,z);
            }
            else
                droppedTens = 1;
        }
        else if(tc==9 && carryTen && !carryHund)
        {
            for(var i=0; i<9; i++)
                PIEremoveElement(tens[i]);
            PIEremoveElement(carryTen);
            carryHund = notes[2].clone();
            carryHund.visible = true;
            carryHund.position.set(myCenterX+9.5, myCenterY-14, myCenterZ-(tens.length * 0.3));
            PIEaddElement(carryHund);
            mhc++;
            mtc = 0;
            if(resNotesCount[1])
                    PIEremoveElement(resNotesCount[1]);
                material  = new THREE.MeshBasicMaterial({color:0xffffff});
                resNotesCount[1] = new THREE.Mesh(getGeometry(mtc,1.5),material);
                resNotesCount[1].position.set(myCenterX+2.5, myCenterY-18.6, myCenterZ);
                PIEaddElement(resNotesCount[1]);
            if(resNotesCount[2])
                    PIEremoveElement(resNotesCount[2]);
            material  = new THREE.MeshBasicMaterial({color:0xffffff});
            resNotesCount[2] = new THREE.Mesh(getGeometry(mhc,1.5),material);
            resNotesCount[2].position.set(myCenterX-21.4, myCenterY-18.8, myCenterZ);
            PIEaddElement(resNotesCount[2]);

        }
        else if(carryHund && carryHund.position.x > myCenterX-12)
        {
            x = carryHund.position.x;
            y = carryHund.position.y;
            z = carryHund.position.z;

            x = x - mc;
            carryHund.position.set(x,y,z);
        }
        else if(!dtens[tc])
        {
            x = tens[tc].position.x;
            y = tens[tc].position.y;
            z = tens[tc].position.z;

            y = y - mc;
            if(tc < parseInt(num1/100)%10)
            {
                if(tc<5)
                {
                    distY = 14;
                }
                else
                {
                    distY = 15;
                }
            }
            else if(parseInt(num1/100)%10>=5 && (tc-parseInt(num1/100)%10)<5)
                distY = 16;
            else
                distY = 17;
            if(y>myCenterY- distY)
                tens[tc].position.set(x,y,z);
            else
            {
                dtens[tc] = 1;
                tc++;
                mtc++;

                if(resNotesCount[1])
                    PIEremoveElement(resNotesCount[1]);
                material  = new THREE.MeshBasicMaterial({color:0xffffff});
                resNotesCount[1] = new THREE.Mesh(getGeometry(mtc,1.5),material);
                resNotesCount[1].position.set(myCenterX+2.5, myCenterY-18.6, myCenterZ);
                PIEaddElement(resNotesCount[1]);

            }
        }
        
    }
    if(droppedTens && !droppedHunds)
    {
        if(hc == hunds.length)
        {
                droppedHunds = 1;

        }
        else if(hc==10 && !carryHund && !carryThousand)
        {
            for(var i=0; i<10; i++)
                PIEremoveElement(hunds[i]);
            carryThousand = notes[3].clone();
            carryThousand.visible = true;
            carryThousand.position.set(myCenterX-12.1, myCenterY-14, myCenterZ-(hunds.length * 0.3));
            PIEaddElement(carryThousand);
        }
        else if(hc==9 && carryHund && !carryThousand)
        {
            for(var i=0; i<9; i++)
                PIEremoveElement(hunds[i]);
            PIEremoveElement(carryHund);
            carryThousand = notes[3].clone();
            carryThousand.visible = true;
            carryThousand.position.set(myCenterX-12.1, myCenterY-14, myCenterZ-(hunds.length * 0.3));
            PIEaddElement(carryThousand);
        }
        else if(!dhunds[hc])
        {
            x = hunds[hc].position.x;
            y = hunds[hc].position.y;
            z = hunds[hc].position.z;

            y = y - mc;
            if(hc < parseInt(num1/100))
            {
                if(hc<5)
                {
                    distY = 14;
                }
                else
                {
                    distY = 15;
                }
            }
            else if(parseInt(num1/100)>=5 && (tc-parseInt(num1/100))<5)
                distY = 16;
            else
                distY = 17;
            if(y>myCenterY- distY)
                hunds[hc].position.set(x,y,z);
            else
            {
                dhunds[hc] = 1;
                hc++;
                mhc++;
                if(resNotesCount[2])
                    PIEremoveElement(resNotesCount[2]);
            material  = new THREE.MeshBasicMaterial({color:0xffffff});
            resNotesCount[2] = new THREE.Mesh(getGeometry(mhc,1.5),material);
            resNotesCount[2].position.set(myCenterX-21.4, myCenterY-18.8, myCenterZ);
            PIEaddElement(resNotesCount[2]);
            }
        }
    }
    if(droppedHunds == 1 && font)
    {
        if(resText[2])
            PIEremoveElement(resText[2]);
        material = new THREE.MeshBasicMaterial({color : 0xffffff});
        resText[2] = new THREE.Mesh(getGeometry(num1+num2,4), material);
        if((num1+num2) >= 1000)
            resText[2].position.set(myCenterX-37, myCenterY-12, myCenterZ);
        else
            resText[2].position.set(myCenterX-33, myCenterY-12, myCenterZ);
        PIEaddElement(resText[2]);
    }
}

function loadMoney()
{
    var x = myCenterX - 12;
    var y = myCenterY + 11;
    var z = myCenterZ - (num1%10)*0.30;

    for(var i=0; i<parseInt(num1/100); i++)
    {
        hunds[i] = notes[2].clone();
        hunds[i].visible = true;
        hunds[i].position.set(x,y,z);
        PIEaddElement(hunds[i]);
        x = x + 0.8;
        y = y - 0.2;
        z = z + 0.3;
    }
    notes[2].visible = false;

    x = myCenterX - 12;
    y = myCenterY;
    z = myCenterZ - (num2%10)*0.3;
    for(var i= parseInt(num1/100); i<parseInt(num1/100) + parseInt(num2/100); i++)
    {

        hunds[i] = notes[2].clone();
        hunds[i].visible = true;
        hunds[i].position.set(x,y,z);
        PIEaddElement(hunds[i]);
        x = x + 0.7;
        y = y - 0.2;
        z = z + 0.3; 
    }

    x = myCenterX + 9.5;
    y = myCenterY + 10.5;
    z = myCenterZ - (parseInt(num1/10)%10)*0.3;

    for(var i=0; i<parseInt(num1/10)%10; i++)
    {
        tens[i] = notes[1].clone();
        tens[i].visible = true;
        tens[i].position.set(x,y,z);
        PIEaddElement(tens[i]);
        x = x + 0.8;
        y = y - 0.2;
        z = z + 0.3;
    }

    x = myCenterX + 9.5;
    y = myCenterY - 1;
    z = myCenterZ - (parseInt(num2/10)%10)*0.3;

    for(var i=parseInt(num1/10)%10; i<parseInt(num1/10)%10 + parseInt(num2/10)%10; i++)
    {
        tens[i] = notes[1].clone();
        tens[i].visible = true;
        tens[i].position.set(x,y,z);
        PIEaddElement(tens[i]);
        x = x + 0.8;
        y = y - 0.2;
        z = z + 0.3;
    }

    x = myCenterX + 27;
    y = myCenterY + 11;
    z = myCenterZ - parseInt(num1%10)*0.3;

    for(var i=0; i<parseInt(num1%10); i++)
    {
        ones[i] = notes[0].clone();
        ones[i].visible = true;
        ones[i].position.set(x,y,z);
        PIEaddElement(ones[i]);
        x = x + 2;  
        if(i==4)
        {
            x = myCenterX + 27;
            y = y - 3;      
        }
    }

    x = myCenterX + 27;
    y = myCenterY;
    z = myCenterZ - parseInt(num1%10)*0.3;

    for(var i=parseInt(num1%10); i<parseInt(num1%10) + parseInt(num2%10); i++)
    {
        ones[i] = notes[0].clone();
        ones[i].visible = true;
        ones[i].position.set(x,y,z);
        PIEaddElement(ones[i]);
        x = x + 2;  
        if(i== num1%10+4)
        {
            x = myCenterX + 27;
            y = y - 3;      
        }
    }

    material = new THREE.MeshBasicMaterial({color : 0xffffff});
    resText[0] = new THREE.Mesh(getGeometry(num1,4), material);
    resText[0].position.set(myCenterX-33, myCenterY+8, myCenterZ);
    PIEaddElement(resText[0]);

    material = new THREE.MeshBasicMaterial({color : 0xffffff});
    resText[1] = new THREE.Mesh(getGeometry(num2,4), material);
    resText[1].position.set(myCenterX-33, myCenterY-2, myCenterZ);
    PIEaddElement(resText[1]);

    material = new THREE.MeshBasicMaterial({color : 0xffffff});
    resText[2] = new THREE.Mesh(getGeometry("?",4), material);
    resText[2].position.set(myCenterX-30, myCenterY-12, myCenterZ);
    PIEaddElement(resText[2]);

    material = new THREE.MeshBasicMaterial({color : 0xffffff});
    resText[3] = new THREE.Mesh(getGeometry("+",4), material);
    resText[3].position.set(myCenterX-38, myCenterY-2, myCenterZ);
    PIEaddElement(resText[3]);

    material = new THREE.MeshBasicMaterial({color : 0xffffff});
    num1NotesCount[0] = new THREE.Mesh(getGeometry(parseInt(num1/100),1.5), material);
    num1NotesCount[0].position.set(myCenterX-19, myCenterY+5, myCenterZ+0.05);
    PIEaddElement(num1NotesCount[0]);

    material = new THREE.MeshBasicMaterial({color : 0xffffff});
    num2NotesCount[0] = new THREE.Mesh(getGeometry(parseInt(num2/100),1.5), material);
    num2NotesCount[0].position.set(myCenterX-19, myCenterY-6, myCenterZ+0.05);
    PIEaddElement(num2NotesCount[0]);

    material = new THREE.MeshBasicMaterial({color : 0xffffff});
    num1NotesCount[1] = new THREE.Mesh(getGeometry(parseInt(num1/10)%10,1.5), material);
    num1NotesCount[1].position.set(myCenterX+3, myCenterY+5, myCenterZ+0.05);
    PIEaddElement(num1NotesCount[1]);

    material = new THREE.MeshBasicMaterial({color : 0xffffff});
    num2NotesCount[1] = new THREE.Mesh(getGeometry(parseInt(num2/10)%10,1.5), material);
    num2NotesCount[1].position.set(myCenterX+3, myCenterY-6, myCenterZ+0.05);
    PIEaddElement(num2NotesCount[1]);

    material = new THREE.MeshBasicMaterial({color : 0xffffff});
    num1NotesCount[2] = new THREE.Mesh(getGeometry(num1%10,1.5), material);
    if(num1%10 >5)
        num1NotesCount[2].position.set(myCenterX+25, myCenterY+3.8, myCenterZ+0.05);
    else
        num1NotesCount[2].position.set(myCenterX+25, myCenterY+5, myCenterZ+0.05);
    PIEaddElement(num1NotesCount[2]);

    material = new THREE.MeshBasicMaterial({color : 0xffffff});
    num2NotesCount[2] = new THREE.Mesh(getGeometry(num2%10,1.5), material);
    if(num2%10 >5)
       num2NotesCount[2].position.set(myCenterX+25, myCenterY-7.6, myCenterZ+0.05);
    else
       num2NotesCount[2].position.set(myCenterX+25, myCenterY-6, myCenterZ+0.05);
    PIEaddElement(num2NotesCount[2]);

    for(var i=0; i<ones.length; i++)
        dones[i] = 0;
    for(var i=0; i<hunds.length; i++)
        dhunds[i] = 0;
    for(var i=0; i<tens.length; i++)
        dtens[i] = 0;

    loadedMoney = 1;
    droppedOnes = 0;
    droppedTens = 0;
    droppedHunds = 0;

    oc = 0;
    tc = 0;
    hc = 0;

    material = new THREE.MeshBasicMaterial({color : 0xffffff});
    resNotesCount[0] = new THREE.Mesh(getGeometry("0",1.5), material);
    resNotesCount[0].position.set(myCenterX+25, myCenterY-18.3, myCenterZ);
    PIEaddElement(resNotesCount[0]);

    material = new THREE.MeshBasicMaterial({color : 0xffffff});
    resNotesCount[1] = new THREE.Mesh(getGeometry("0",1.5), material);
    resNotesCount[1].position.set(myCenterX+2.5, myCenterY-18.6, myCenterZ);
    PIEaddElement(resNotesCount[1]);

    material = new THREE.MeshBasicMaterial({color : 0xffffff});
    resNotesCount[2] = new THREE.Mesh(getGeometry("0",1.5), material);
    resNotesCount[2].position.set(myCenterX-21.4, myCenterY-18.8, myCenterZ);
    PIEaddElement(resNotesCount[2]);
    // notes[0].visible = true;
    // notes[0].position.set(myCenterX+25, myCenterY-14, myCenterZ);

    // notes[1].visible = true;
    // notes[1].position.set(myCenterX+9.5, myCenterY-14, myCenterZ);

    // notes[2].visible = true;
    // notes[2].position.set(myCenterX-12, myCenterY-14, myCenterZ);
}

function setInput()
{
    min = 100;
    max = 999;
    num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    num2 = Math.floor(Math.random() * (max - min + 1)) + min;
}

var helpContent;
function initialiseHelp(){
    helpContent="";
    helpContent = helpContent + "<h2>Three Digit Addition using Money</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "<p>Top right corner contains a control panel with the sliders and a button.</p>";
    helpContent = helpContent + "<p>Number-1 and Number-2 are the sliders for the input value of 3 digit numbers.</p>";
    helpContent = helpContent + "Learn Steps button explains you to add the numbers using money";
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
    infoContent = infoContent + "<p>First the 2 numbers to be added are represent in the form of money. Units digits as 1 rupee, tenth digit as 10 rupees, hundred digit as 100 rupee note</p>";
    infoContent = infoContent + "<p>At first add unit digits i.e., 1 rupee coins are added. If coin count reaches more than 9 then all 10 coins will be replaced as 10 rupee note and add count to the ten rupee notes (make 1 rupee count = 0).</p>";
    infoContent = infoContent + "<p>Add the 10 rupee coins, if more than 9 10 rupee note occurs replace all 10 notes into a single 100 rupee note and add the count of 100 rupee notes (make 10 rupee count = 0).</p>";
    ;
    infoContent = infoContent + "<p>Similarly, add the 100 rupee notes (increment count).</p>";
    infoContent = infoContent + "<p>Together combine as a result for 3 digit addition using money</p>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
    PIEupdateInfo(infoContent);
}