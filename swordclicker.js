const sword = document.getElementsByClassName("sword")[0]
const pointDisplay = document.getElementsByClassName("point-display")[0]
const shopDiv = document.getElementsByClassName("shop")[0]
const servantWrapper = document.getElementsByClassName("servant-wrapper")[0]
const gameWrapper = document.getElementsByClassName("game-wrapper")[0]
const ground = document.getElementsByClassName("ground")[0]
const treasure = document.getElementsByClassName("treasure")[0]
const timer = document.getElementsByClassName("timerText")[0]
const waveText = document.getElementsByClassName("waveText")[0]

var points = 0
var highestPoints = points
var wavesSpawned = 0
var pointsPerClick = 1;

var displayHeight = 900

var secondsCountdown = 20
var timeBetweenWaves = secondsCountdown

var Shop = {    //[name, cost, hasUnlocked, owned, total, points per sword/ * x points per click, swords per x seconds]
    SERVANT: ['servant', 20, false, 0, 5, 30, 10],
    MUD: ['mud', 100, false, 0, 1, 0, 0],
    BETTERSWORD:['better_sword', 100, false, 0, 1, 2],
    FIELD: ['field', 150, false, 0, 1, 0, 0],
    COLLECTOR: ['collector', 200, false, 0, 1, 0, 0],
    FURNACE: ['furnace', 300, false, 0, 1, 0, 0]
    //a cannon that does a bit of damage to the baloons- 400
    //autoclicker for sword- 500
    //increase servant speed
}



function shopButtonClicked(btnType){
    if((btnType == Shop.SERVANT[0]) && (points>=Shop.SERVANT[1]) && (Shop.SERVANT[3] < Shop.SERVANT[4])){
        makeServant()
        changePoints(-Shop.SERVANT[1])
        const button = document.getElementsByClassName(btnType + " shop-button")[0]
        button.classList.remove("can-purchase")
        Shop.SERVANT[3] += 1
        Shop.SERVANT[1] *= 2
        const txt = document.getElementsByClassName(btnType + " shop-button-hover-text")[0]
        txt.innerHTML = "Servant-" + Shop.SERVANT[1] + " Swords.<br /> Generates " + Shop.SERVANT[5] + " swords per " + Shop.SERVANT[6] + " seconds <br />" + Shop.SERVANT[3] +"/" + Shop.SERVANT[4] + " unlocked"


        if(Shop.SERVANT[3] == Shop.SERVANT[4]){
            button.remove()
        }
    }
    
    if((btnType == Shop.MUD[0]) && (points>=Shop.MUD[1])){
        changePoints(-Shop.MUD[1])
        const div = document.createElement("div")
        div.className = "mud-obstacle"
        document.body.appendChild(div)
        const button = document.getElementsByClassName(btnType + " shop-button")[0]
        Shop.MUD[3] += 1
        button.remove()
    }
    if((btnType == Shop.BETTERSWORD[0]) && (points>=Shop.BETTERSWORD[1])){
        changePoints(-Shop.BETTERSWORD[1])
        pointsPerClick *= Shop.BETTERSWORD[5]
        const button = document.getElementsByClassName(btnType + " shop-button")[0]
        button.remove()
    }
    if((btnType == Shop.FIELD[0]) && (points>=Shop.FIELD[1])){
        changePoints(-Shop.FIELD[1])
        
        displayHeight += 200
        gameWrapper.style.height = displayHeight + "px"
        Shop.FIELD[3] += 1

        const button = document.getElementsByClassName(btnType + " shop-button")[0]
        button.remove()
    }
    if((btnType == Shop.COLLECTOR[0]) && (points>=Shop.COLLECTOR[1])){
        changePoints(-Shop.COLLECTOR[1])

        Shop.COLLECTOR[3] += 1
        
        const button = document.getElementsByClassName(btnType + " shop-button")[0]
        button.remove()
    }
    if((btnType == Shop.FURNACE[0]) && (points>=Shop.FURNACE[1])){
        changePoints(-Shop.FURNACE[1])

        Shop.FURNACE[3] += 1

        Shop.SERVANT[5] += 20;
        
        const button = document.getElementsByClassName(btnType + " shop-button")[0]
        button.remove()
    }
}

function swordClicked(){
    changePoints(pointsPerClick)

    addParticle()

    updateShop()
    
}

function updateShop(){
    if((Shop.SERVANT[2] == false) && (Shop.SERVANT[1] <= highestPoints)){
        const btn = document.createElement('button')
        btn.className = Shop.SERVANT[0] + " shop-button can-purchase"
        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.SERVANT[0] + "\")")
        btn.style.backgroundImage = "url(\"Servant Button Bg.png\")"

        const text = document.createElement('div')
        text.className = Shop.SERVANT[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Servant-" + Shop.SERVANT[1] + " Swords.<br /> Generates " + Shop.SERVANT[5] + " swords per " + Shop.SERVANT[6] + " seconds <br />" + Shop.SERVANT[3] +"/" + Shop.SERVANT[4] + " unlocked"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.SERVANT[2] = true
    }
    if( (Shop.MUD[2] == false) && (Shop.MUD[1] <= highestPoints)){
        const btn = document.createElement('button')
        btn.className = Shop.MUD[0] + " shop-button can-purchase"
        
        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.MUD[0] + "\")")
        btn.style.backgroundColor = "brown"

        const text = document.createElement('div')
        text.className = Shop.MUD[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Mud-" + Shop.MUD[1] + " Swords.<br /> Slows enemy down"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.MUD[2] = true
    }
    if( (Shop.BETTERSWORD[2] == false) && (Shop.BETTERSWORD[1] <= highestPoints)){
        const btn = document.createElement('button')
        btn.className = Shop.BETTERSWORD[0] + " shop-button can-purchase"

        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.BETTERSWORD[0] + "\")")
        btn.style.backgroundColor = "blue"

        const text = document.createElement('div')
        text.className = Shop.BETTERSWORD[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Better sword-" + Shop.BETTERSWORD[1] + " Swords.<br /> Doubles the swords gained per click"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.BETTERSWORD[2] = true
    }
    if( (Shop.FIELD[2] == false) && (Shop.FIELD[1] <= highestPoints)){
        const btn = document.createElement('button')
        btn.className = Shop.FIELD[0] + " shop-button can-purchase"
        
        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.FIELD[0] + "\")")
        btn.style.backgroundColor = "green"

        const text = document.createElement('div')
        text.className = Shop.FIELD[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Field-" + Shop.FIELD[1] + " Swords.<br /> Increases field by 200 pixels"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.FIELD[2] = true
    }
    if( (Shop.COLLECTOR[2] == false) && (Shop.COLLECTOR[1] <= highestPoints)){
        const btn = document.createElement('button')
        btn.className = Shop.COLLECTOR[0] + " shop-button can-purchase"
        
        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.COLLECTOR[0] + "\")")
        btn.style.backgroundColor = "grey"

        const text = document.createElement('div')
        text.className = Shop.COLLECTOR[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Collector-" + Shop.COLLECTOR[1] + " Swords.<br /> Automatically collects servant's swords"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.COLLECTOR[2] = true
    }
    if( (Shop.FURNACE[2] == false) && (Shop.FURNACE[1] <= highestPoints)){
        const btn = document.createElement('button')
        btn.className = Shop.FURNACE[0] + " shop-button can-purchase"
        
        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.FURNACE[0] + "\")")
        btn.style.backgroundColor = "grey"

        const text = document.createElement('div')
        text.className = Shop.FURNACE[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Furnace-" + Shop.FURNACE[1] + " Swords.<br /> +20 swords created by servants"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.FURNACE[2] = true
    }
}

//const spawnEnemy = setInterval(trySpawningEnemy, 10000)

function spawnEnemy(){
    wavesSpawned++
    if(wavesSpawned %5 == 0){
        timeBetweenWaves += 5
    }
    var numOfEnemies =  wavesSpawned * 2; //wavesSpawned * 2
    waveText.innerHTML = "Waves Survived: " + wavesSpawned
    for(i=0; i<numOfEnemies; i++){
        var parent = document.createElement("div")
        parent.className = "enemy-wrapper"
        var h1 = document.createElement("h1")
        h1.className = "enemy-cost"
        var randomCost = Math.floor(Math.random()*(wavesSpawned*10)) + 5
        h1.innerHTML = randomCost + " Swords"
        var btn  =document.createElement("button")
        btn.className = "enemy"
        btn.setAttribute("onclick", "clickEnemy(this, " + randomCost + ")")

        parent.appendChild(h1)
        parent.appendChild(btn)

        parent.style.zIndex = 99999999
        document.body.appendChild(parent)

        moveEnemy(parent, randomCost)
        
    }
}

function updateTimer() {
    secondsCountdown--
    timer.innerHTML = "Seconds until next wave: " + secondsCountdown
    
    if(secondsCountdown <= 0){
        secondsCountdown = timeBetweenWaves
        spawnEnemy()
    }
}

let timerInterval = setInterval(updateTimer, 1000);


function reachedBottom(enemy, cost){
    if(document.body.contains(enemy)){
        enemy.remove()
        changePoints(-cost * 1.5)
    }
    
}

function moveEnemy(enemy, cost){
    var leftVal = Math.floor(Math.random()*95) + 1
    enemy.style.left = leftVal + "vw"

    var topVal = 0
    var id = null
    clearInterval(id)
    id = setInterval(moveEnemyFunc, 10)

    function moveEnemyFunc(){
        if(topVal >= displayHeight){
            reachedBottom(enemy, cost)
            clearInterval(id)
        } else{
            if(Shop.MUD[3]>0 && topVal >= 300 && topVal <= 400){
                topVal += 0.25
                enemy.style.top = topVal + "px"
            } else{
                topVal += 1
                enemy.style.top = topVal + "px"
            }
            
        }
    }
}

function clickEnemy(button, cost){
    if(points >= cost){
        button.parentNode.remove()
        changePoints(-cost)
    }
        
}
function addParticle(){
    const particle = document.createElement('div')
    particle.className = "clicked-particle"
    const child = document.createElement('h1')
    child.className = "shadows-into-light-regular"
    child.innerText = "+" + pointsPerClick
    particle.appendChild(child)

    var left = 15 + (Math.random()*75)
    var top = 15 + (Math.random()*85)
    particle.style.left = left + "vw"
    particle.style.top = top + "vh"

    document.body.appendChild(particle)

    animateParticle(particle, top)
}

function animateParticle(particle, originalTop){
    var pos = originalTop
    var id = null
    clearInterval(id)
    id = setInterval(move, 20)
    var counter = 0
    
    function move(){
        counter++
        if(counter == 20){
            clearInterval(id)
            particle.remove()
        }
        if(!((originalTop-pos) > 5)){
            pos--;
            particle.style.top = pos + "vh"
        }
    }
}


function makeServant(){
    var parent = document.createElement("div")
    parent.className = "servant"
    var btn = document.createElement("button")
    btn.className = "servant-button"
    btn.setAttribute("id", Shop.SERVANT[3])
    var img = document.createElement("img")
    img.setAttribute("src", "Smelting Sword.png")
    var progress = document.createElement("div")
    progress.className = "progress-bar shadows-into-light-regular"
    progress.setAttribute("id", "progress-" + Shop.SERVANT[3])
    btn.setAttribute("onclick", "clickServant(this)")
    parent.appendChild(progress)
    parent.appendChild(btn)
    parent.appendChild(img)
    
    parent.style.position = "relative"
    parent.setAttribute("id", "servant-" + Shop.SERVANT[3])
    servantWrapper.appendChild(parent)

    servantAnimation(progress)
}



function servantAnimation(progressBar){
    progressBar.style.height = "0px"
    var size = 0
    var id = null
    clearInterval(id)

    id = setInterval(growProgress, 100)
    progressBar.classList.add("workingServant")

    function growProgress(){
        if(size == (100)){

            progressBar.innerHTML = Shop.SERVANT[5] + " swords"
            progressBar.classList.remove("workingServant")
            progressBar.classList.add("readyServant")

            if(Shop.COLLECTOR[3] != 0){
                clickServant(progressBar.nextSibling)
            }
            
            clearInterval(id)
        } else{
            size+=1 * (100/(Shop.SERVANT[6]*10));
            progressBar.style.height = size + "px"
        }
    }
}

function clickServant(button){
    var idNum = button.id
    const progress = document.getElementById("progress-" + idNum)
    var classList = progress.classList + ""
    if(classList.indexOf("readyServant") != -1){
        progress.classList.remove("readyServant")
        progress.innerHTML = ""
        changePoints(Shop.SERVANT[5])
        updateShop()
    } 
    if(!(classList.indexOf("workingServant") != -1)){
        servantAnimation(progress)
    }
}

function changePoints(p){
    points += Math.max(p)
    if(points < 0){
        gameOver()
    }
    if(highestPoints < points)
        highestPoints = points
    pointDisplay.innerHTML = "Swords: " + points

    if(p>0){
        Object.values(Shop).forEach(shopArray => {
            if((shopArray[2] == true) && (shopArray[1] <= points)){
                var button = document.getElementsByClassName(shopArray[0] + " shop-button")
                if(button.length > 0){
                    button = button[0]
                    button.classList.add("can-purchase")
                }
                
            }
        })
    } else if(p<0){
        Object.values(Shop).forEach(shopArray => {
            if((shopArray[2] == true) && (shopArray[1] >= points)){
                var button = document.getElementsByClassName(shopArray[0] + " shop-button")
                if(button.length > 0){
                    button = button[0]
                    button.classList.remove("can-purchase")
                }
                
            }
        })
    }
}

function gameOver(){
    gameWrapper.remove()
    clearInterval(timerInterval)
    var elem = document.createElement("div")
    elem.className = "game-over-text shadows-into-light-regular"
    elem.innerHTML = "GAME OVER<br/>You ran out of swords!"
    document.body.appendChild(elem)
}

