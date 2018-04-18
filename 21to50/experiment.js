var mySceneTLX;        
var mySceneTLY;        
var mySceneBRX;        
var mySceneBRY;        
var mySceneW;          
var mySceneH;          
var myCenterX;         
var myCenterY; 
var wallThickness;
var raycaster;
var geometry, material, loader, texture, font, text, material2;
var sticks = [], ones=[], tens=[];
var num;
function initialiseScene() {
    mySceneTLX = -20.0;
    mySceneTLY = 20.0;
    mySceneBRX = 20.0;
    mySceneBRY = -20.0;
    mySceneW   = (mySceneBRX - mySceneTLX);
    mySceneH   = (mySceneTLY - mySceneBRY);
    myCenterX  = (mySceneTLX + mySceneBRX) / 2.0;
    myCenterY  = (mySceneTLY + mySceneBRY) / 2.0;
    myCenterZ = 0.20;
    raycaster = new THREE.Raycaster();
    
    document.getElementById(">>").addEventListener("click",speedUp);
    document.getElementById("<<").addEventListener("click",speedDown);
    PIEscene.background=new THREE.Color( 0xbfd1e5 );
    PIEscene.add(new THREE.AmbientLight(0x606060));
}

function speedUp()
{

}

function speedDown()
{

}

function loadFont() {
    loader = new THREE.FontLoader();
    loader.load("fonts/optimer.json", function(response){
        font = response;  
    });
}

function setInput()
{
    min = 21;
    max = 50;
    num = Math.floor(Math.random() * (max - min + 1)) + min;
}

function learn()
{

}

function complete()
{

}

function quiz()
{

}
function getNumber(newVal)
{
    num = newVal;
}
function getGeometry(num,size) {
    geometry = new THREE.TextGeometry(num,{
        font: font,
        size: size,
        height  : 0.01,
        curveSegments : 3
    });
    return geometry;
}

function loadExperimentElements()
{    
    PIEsetExperimentTitle("Couting 21 to 50");
    PIEsetDeveloperName("Dattatreya Sarma Garimella");
    
    initialiseScene();
    loadFont();

    setInput();
    PIEaddInputSlider("Number",num,  getNumber, 21, 50, 1);
    PIEaddDisplayText("Number", num);
    PIEaddDualCommand("Learn Steps",learn);
    PIEaddDualCommand("Quiz",quiz);
    PIEaddDualCommand("Count 21 to 50",complete);

    geometry = new THREE.PlaneGeometry(6,1.5,0);
    imgUtils = new THREE.ImageUtils.loadTexture( 'images/ones.png' );
    material = new THREE.MeshStandardMaterial( { transparent:true,map: imgUtils, side: THREE.DoubleSide } );
    sticks[0] = new THREE.Mesh(geometry, material);
    sticks[0].position.set(myCenterX, myCenterX, myCenterZ);
    sticks[0].rotateZ(Math.PI/4);
    sticks[0].material.opacity = 1;
    sticks[0].visible = false;
    PIEaddElement(sticks[0]);

    geometry = new THREE.PlaneGeometry(8,4,0);
    imgUtils = new THREE.ImageUtils.loadTexture( 'images/tens.png' );
    material = new THREE.MeshStandardMaterial( { transparent:true,map: imgUtils, side: THREE.DoubleSide } );
    sticks[1] = new THREE.Mesh(geometry, material);
    sticks[1].position.set(myCenterX-10, myCenterX, myCenterZ);
    sticks[1].rotateZ(Math.PI/4);
    sticks[1].material.opacity = 1;
    sticks[1].visible = false;
    PIEaddElement(sticks[1]);

    var tx = 0, ty = 0;
    for(i=0; i<9; i++)
    {
        ones[i] = sticks[0].clone();
        ones[i].visible = true;
        ones[i].position.set(myCenterX-34+tx, myCenterY+10-ty, myCenterZ);
        tx = tx + 1.6;
        PIEaddElement(ones[i]);
    }
    tx = 0;
    ty = 10;
    for(i=0; i<5; i++)
    {
        tens[i] = sticks[1].clone();
        tens[i].visible = true;
        tens[i].position.set(myCenterX-35+tx, myCenterY+10-ty, myCenterZ);
        tx = tx + 5.2;
        if(i==2)
        {
            tx = 0;
            ty = 17;
        }
        PIEaddElement(tens[i]);
    }

    ones[0].position.set(myCenterX, myCenterY, myCenterZ);
    ones[0].scale.set(0.7,0.7,0.7);
    tens[0].position.set(myCenterX-2.8, myCenterY, myCenterZ);
    tens[0].scale.set(1,1,1);

    PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);
}

function resetExperiment()
{

}

function updateExperimentElements(t,dt)
{
    
}