let time = new Date()

let deltaTime = 0;
let paused = false;

let btnPlay = document.getElementById('btnPlay')
let btnPaused = document.getElementById('btnPaused')
let textoPausa = document.querySelector('.paused')

textoPausa.style.display = 'none';

btnPlay.addEventListener('click', () =>{

    paused = false;
    textoPausa.style.display = 'none';

    Init()

})


function Init(){

    time = new Date();
    Start();        
    Loop();
    
}

function Loop(){

    btnPaused.addEventListener('click', () =>{

        paused = true

        textoPausa.style.display = 'inline-block';
        
    })

    if(!paused){

        deltaTime=(new Date() - time)/1000;
        time = new Date ();

        Update()
        requestAnimationFrame(Loop)
        playAnimation()

    } else if (paused){

        stopAnimation() 

    }
  
}

let sueloY= 115;
let velY= 0;
let impulso = 1100;
let gravedad = 2500;

let playerPosX = 25;
let playerPosY = sueloY;

let sueloX= 0;
let velEscenario = 1280/3;
let gameVel = 0.5;
let score = 0;

let parado = false;
let saltando = false;

let tiempoHastaObstaculo = 2;
let tiempoHastaObstaculoMin =1.8;
let tiempoHastaObstaculoMax =3;
let obstaculoPosY = 16;
let obstaculos = [];

let contenedor;
let player;
let textoScore;
let suelo;
let gameOver;
let boss;

let ataquePosX = 400;
let scoreToBoss = 10;
let bossLife = 1000;
let bossCreated = false;
let ataques = []

let desplazamiento;
let playerMov = playerPosX

let bossHeart = document.querySelector('.bossHeart')

bossHeart.style.display = "none"


function Start (){

    suelo = document.querySelector('.suelo')
    player = document.querySelector('.player')
    textoScore = document.querySelector('.score')
    contenedor = document.querySelector('.contenedor')
    document.addEventListener('keydown', HandleKeyDown)
    bossHeart.addEventListener('click', bossAttacked)

}



function HandleKeyDown(e){

    if(e.keyCode === 32){
        e.preventDefault()
        Saltar();

    } else if(e.keyCode === 68){

        MoverDerecha()
        
    } else if(e.keyCode === 65){

        MoverIzquierda()
    }
}

function Saltar(){
    
    if ( playerPosY === sueloY){

        saltando = true;
        velY = impulso;
        
        player.classList.add('player-saltando')

    }

}

function Update(){

    if (parado) return;
        
    MoverSuelo();
    MoverPlayer()
    DecidirCrearObstaculos()
    MoverObstaculos()
    DetectarColision()

    if (score >= scoreToBoss && obstaculos.length <= 0) {

        CrearBoss()
        PararPlayer()

        if(bossCreated){

            DecidirCrearAtaque()
            MoverAtaque()
            DetectarMuerte()
            Win()

        }
    }

    velY -= gravedad * deltaTime;
   
}

function MoverSuelo(){
    
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX )+'px'
    
}

function CalcularDesplazamiento(){

    desplazamiento = velEscenario * deltaTime* gameVel;

    return desplazamiento

}

function MoverPlayer(){

    playerPosY += velY * deltaTime;

    if (playerPosY > 270){

        player.classList.remove('player-saltando')
        player.classList.add('player-cayendo')

    }

    if(playerPosY < sueloY){
        
        TocarSuelo()

    }

    player.style.bottom = playerPosY+"px";
    
}

function TocarSuelo (){

    playerPosY = sueloY;
    velY=0;

    if (saltando){ 

        player.classList.remove('player-cayendo')
        player.classList.add('player-tocandosuelo')

        setTimeout( ()=>{

            player.classList.remove('player-tocandosuelo')

        },100)

        player.classList.add('player-corriendo')
    }

    saltando = false
}

function DecidirCrearObstaculos(){

    if (score >= scoreToBoss) return; // para darle paso al boss

    tiempoHastaObstaculo -= deltaTime;

    if ( tiempoHastaObstaculo<=0){

        CrearObstaculo ();

    }
    
}

function CrearObstaculo(){
    
    let obstaculo = document.createElement('div')

    contenedor.appendChild(obstaculo)
    obstaculo.classList.add('obstaculo')
    obstaculo.posX=contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth

    obstaculos.push(obstaculo);

    tiempoHastaObstaculo = tiempoHastaObstaculoMin * Math.random() * (tiempoHastaObstaculoMax-tiempoHastaObstaculoMin)/ gameVel
    
}

function MoverObstaculos(){

    for( let i = obstaculos.length - 1; i>=0 ; i--){

        if(obstaculos[i].posX < - obstaculos[i].clientWidth){

            obstaculos[i].parentNode.removeChild(obstaculos[i])
            obstaculos.splice(i,1)
            GanarPuntos()

        }else{

            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX+"px";

        }
    }

   
}

function GanarPuntos(){

    score++
    textoScore.innerText = score;
    gameVel += 0.025

}

function DetectarColision(){

    obstaculoPosY = 115

    for( let i = 0; i <obstaculos.length; i++){

        let pX = Math.floor(player.getBoundingClientRect().x) 
        let aX = Math.floor(obstaculos[i].getBoundingClientRect().x) -5
        
        if( pX == aX && playerPosY == obstaculoPosY ){

            Estrellarse()
            GameOver()
        } 
    }
}



function GameOver(){

    textoGameOver = document.createElement('div')
    textoGameOver.classList.add('gameOver')
    contenedor.appendChild(textoGameOver)

    setTimeout(()=>{

        fraseGameOver = document.createElement('span')
        fraseGameOver.classList.add('gameOverFont')
        fraseGameOver.innerText = 'GAME OVER'
        textoGameOver.appendChild(fraseGameOver)

    },2000)
    
    
}

function Estrellarse(){

    player.classList.remove('player-corriendo')
    player.classList.add('player-ensuelo')
    parado = true;
    paused = true;
  
}

function CrearBoss (){
    
    if (!contenedor.contains(boss)){

        boss = document.createElement('div')
        bossPoints = document.createElement('span')
        bossLifeText = document.createElement('span')

        boss.classList.add('boss')
        boss.classList.add('intBoss')
        bossLifeText.classList.add('bossLifeText')

        contenedor.appendChild(boss)
        contenedor.appendChild(bossLifeText)
        contenedor.appendChild(bossPoints)
        
        setTimeout(()=>{

            bossPoints.classList.add('bossPoints')
            document.querySelector('.bossPoints').innerText = bossLife
            document.querySelector('.bossLifeText').innerText = "BOSS LIFE"

        },2000)
    
        setTimeout(() => {

            bossHeart.classList.add('bossHeart')
            bossHeart.style.display = 'inline-block'
            boss.classList.remove('intBoss')
            bossCreated = true;

        }, 3000);

        boss.setAttribute('id', 'boss')
        boss = document.getElementById('boss')
        
        gameVel = 0.5
    
    }
    
}

function PararPlayer (){

    player.classList.remove('player-corriendo')
    

    setTimeout(()=>{

        velEscenario = 0;

    },1000)
    
}

function MoverDerecha (){

    playerMov += 10
    player.style.left = playerMov+"px"

}

function MoverIzquierda (){

    playerMov -=10
    player.style.left = playerMov+"px"

}


function DecidirCrearAtaque(){

    tiempoHastaObstaculo -= deltaTime;

    if ( tiempoHastaObstaculo<=0){

        boss.classList.remove('boss-recibiendo')
        boss.classList.add('boss-atacando')
        CrearAtaque ();
    }
    
}

function CrearAtaque (){

    setTimeout(()=>{

        let attack = document.createElement('div')

        attack.classList.add('attack')
        contenedor.appendChild(attack)
        attack.posX = ataquePosX
        ataques.push(attack);

    },1000)
    
    tiempoHastaObstaculo = tiempoHastaObstaculoMin * Math.random() * (tiempoHastaObstaculoMax-tiempoHastaObstaculoMin)/ gameVel
    
}

function MoverAtaque(){
  
    for( let i = ataques.length - 1; i>=0 ; i--){
    
        
        if(ataques[i].posX < - ataques[i].clientWidth){
            
            ataques[i].parentNode.removeChild(ataques[i])
            ataques.splice(i,1)
            GanarPuntos()

        }else{

            ataques[i].posX -= 10;
            ataques[i].style.left = ataques[i].posX+"px";

        }
    }

   
}

function DetectarMuerte(){
    for( let i = ataques.length - 1; i>=0 ; i--){

        let pX = Math.floor(player.getBoundingClientRect().x) 
        let aX = Math.floor(ataques[i].getBoundingClientRect().x) -5
        let ataquePosY = 115

        if(playerPosY == ataquePosY && pX == aX){
            Estrellarse()
            GameOver()
        }

    }   
}

function stopAnimation(){

    for(i = 0; i < obstaculos.length; i++){

        obstaculos[i].style.animationPlayState = 'paused';

    }
    for(i = 0; i < ataques.length; i++){

        ataques[i].style.animationPlayState = 'paused';
    }

    if(bossCreated){
    bossHeart.style.animationPlayState = 'paused'
    boss.style.animationPlayState = 'paused'
    }
}

function playAnimation(){

    for(i = 0; i < obstaculos.length; i++){

        obstaculos[i].style.animationPlayState = 'running';

    }

    for(i = 0; i < ataques.length; i++){

        ataques[i].style.animationPlayState = 'running';

    }
    
    if(bossCreated){
        bossHeart.style.animationPlayState = 'running'
        boss.style.animationPlayState = 'running'
    }
}

function bossAttacked(){

    if(!paused && bossLife >= 0){

        bossLife -=5

        document.querySelector('.bossPoints').innerText = bossLife 
        boss.classList.remove('boss-atacando')
        boss.classList.toggle('boss-recibiendo')
    }
    
    
}

function Win (){
    if (bossLife <= 0){

        boss.classList.remove('boss-atacando')
        boss.classList.remove('boss-recibiendo')
        boss.classList.remove('boss')
        boss.classList.add('boss-muriendo')
        bossHeart.style.display = 'none'

        parado = true;
        
        setTimeout(()=>{

            win = document.createElement('div')
            win.classList.add('win')
            contenedor.appendChild(win)
            
            paused = true;

        },2000)

        setTimeout(()=>{

            winText = document.createElement('span')
            winText.classList.add('winFont')
            winText.innerText = '¡YOU  WIN!'
            win.appendChild(winText)
            
        },4000)
        
    }
}