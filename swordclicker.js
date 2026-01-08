const sword = document.getElementsByClassName("sword")[0]
const pointDisplay = document.getElementsByClassName("point-display")[0]
const shopDiv = document.getElementsByClassName("shop")[0]
const servantWrapper = document.getElementsByClassName("servant-wrapper")[0]
const gameWrapper = document.getElementsByClassName("game-wrapper")[0]
const ground = document.getElementsByClassName("ground")[0]
const treasure = document.getElementsByClassName("treasure")[0]
const treasureText = document.getElementsByClassName("treasureText")[0]
const timer = document.getElementsByClassName("timerText")[0]
const waveText = document.getElementsByClassName("waveText")[0]

var points = 0
var highestPoints = points
var wavesSpawned = 0
var pointsPerClick = 1;

var displayHeight = 1000
gameWrapper.style.height = displayHeight + "px"

var secondsCountdown = 20
var timeBetweenWaves = secondsCountdown

var totalTreasure = 1000
var currTreasure = 1000

var autoClickerInterval = null

var Shop = {    //[name, cost, hasUnlocked, owned, total, points per sword/ * x points per click/damage]
    SERVANT: ['servant', 20, false, 0, 5, 30],
    MUD: ['mud', 100, false, 0, 1, 0, 0],
    BETTERSWORD:['better_sword', 100, false, 0, 1, 2],
    FIELD: ['field', 150, false, 0, 1, 0],
    LASER: ['laserbeam', 150, false, 0, 1, 10, 10],   //the last value (LASER[6]) is the recharge time for the laser
    LASERDAMAGE: ['damage', 175, false, 0, 1, 0],
    COLLECTOR: ['collector', 200, false, 0, 1, 0],
    FURNACE: ['furnace', 300, false, 0, 1, 0],
    BETTERSWORD2: ['better_sword2', 300, false, 0, 1, 2],
    AUTOCLICKER: ['autoclicker', 500, false, 0, 1, 2],   //AUTOCLICKER[5] is the clicks per second
    AUTOCLICKER2: ['autoclicker2', 600, false, 0, 1, 1]
    //miners find more treasure- SLOWLY. first field unlocks this. make a graphic that is placed in the dark forest to hint at the fact that you need to buy the field to discover new things
}




function shopButtonClicked(btnType){
    if((btnType == Shop.SERVANT[0]) && (points>=Shop.SERVANT[1]) && (Shop.SERVANT[3] < Shop.SERVANT[4])){
        Shop.SERVANT[3] += 1
        if(Shop.SERVANT[3] == 1)
            makeServant()
        document.getElementById("servant img").setAttribute("src", Shop.SERVANT[3] + " servant.png")
        changePoints(-Shop.SERVANT[1])
        Shop.SERVANT[1] *= 2
        const button = document.getElementsByClassName(btnType + " shop-button")[0]
        if(Shop.SERVANT[1] > points)
            button.classList.remove("can-purchase")
        const txt = document.getElementsByClassName(btnType + " shop-button-hover-text")[0]
        txt.innerHTML = "Servant-" + Shop.SERVANT[1] + " Swords." + Shop.SERVANT[3] +"/" + Shop.SERVANT[4] + " unlocked"


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
        
        displayHeight += 300
        gameWrapper.style.height = displayHeight + "px"
        Shop.FIELD[3] += 1

        const button = document.getElementsByClassName(btnType + " shop-button")[0]
        button.remove()
    }
    if((btnType == Shop.LASER[0]) && (points>=Shop.LASER[1])){
        changePoints(-Shop.LASER[1])

        var laserDiv = document.createElement("div")
        laserDiv.classList.add("laser")
        var laserProgBar = document.createElement("div")
        laserProgBar.classList.add("laser-progressBar")
        laserDiv.appendChild(laserProgBar)
        
        gameWrapper.appendChild(laserDiv)

        Shop.LASER[3] += 1


        let laserTimer = setInterval(function(){ laserRecharge(laserProgBar)}, 1000)

        const button = document.getElementsByClassName(btnType + " shop-button")[0]
        button.remove()
    }
    if((btnType == Shop.LASERDAMAGE[0]) && (points>=Shop.LASERDAMAGE[1])){
        changePoints(-Shop.LASERDAMAGE[1])

        Shop.LASER[5] *= 2

        Shop.LASERDAMAGE[3] += 1

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
    if((btnType == Shop.BETTERSWORD2[0]) && (points>=Shop.BETTERSWORD2[1])){
        changePoints(-Shop.BETTERSWORD2[1])

        Shop.BETTERSWORD2[3] += 1
        pointsPerClick *= Shop.BETTERSWORD2[5]
        const button = document.getElementsByClassName(btnType + " shop-button")[0]
        button.remove()
    }
    if((btnType == Shop.AUTOCLICKER[0]) && (points>=Shop.AUTOCLICKER[1])){
        changePoints(-Shop.AUTOCLICKER[1])
        Shop.AUTOCLICKER[3] += 1
        autoClickerInterval = setInterval(swordClicked, Shop.AUTOCLICKER[5]*1000)

        const button = document.getElementsByClassName(btnType + " shop-button")[0]
        button.remove()
    }
    if((btnType == Shop.AUTOCLICKER2[0]) && (points>=Shop.AUTOCLICKER2[1])){
        changePoints(-Shop.AUTOCLICKER2[1])
        Shop.AUTOCLICKER2[3] += 1

        clearInterval(autoClickerInterval)
        autoClickerInterval = setInterval(swordClicked, Shop.AUTOCLICKER2[5]*1000)

        const button = document.getElementsByClassName(btnType + " shop-button")[0]
        button.remove()
    }

    updateShop()
}



function swordClicked(){
    changePoints(pointsPerClick)

    addParticle()

    updateShop()
    
}

function updateShop(){
    var threshhold = highestPoints + 100
    if((Shop.SERVANT[2] == false) && (Shop.SERVANT[1] <= threshhold)){
        const btn = document.createElement('button')
        if(Shop.SERVANT[1] <= points){
            btn.className = Shop.SERVANT[0] + " shop-button can-purchase"
        } else{
            btn.className = Shop.SERVANT[0] + " shop-button"
        }
        
        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.SERVANT[0] + "\")")
        btn.style.backgroundImage = "url(\"Servant Button Bg.png\")"

        const text = document.createElement('div')
        text.className = Shop.SERVANT[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Servant-" + Shop.SERVANT[1] + " Swords." + Shop.SERVANT[3] +"/" + Shop.SERVANT[4] + " unlocked"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.SERVANT[2] = true
    }
    if( (Shop.MUD[2] == false) && (Shop.MUD[1] <= threshhold)){
        const btn = document.createElement('button')
        if(Shop.MUD[1] <= points){
            btn.className = Shop.MUD[0] + " shop-button can-purchase"
        } else{
            btn.className = Shop.MUD[0] + " shop-button"
        }
        
        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.MUD[0] + "\")")
        btn.style.backgroundColor = "brown"

        const text = document.createElement('div')
        text.className = Shop.MUD[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Mud-" + Shop.MUD[1] + " Swords.<br /> Slows enemy down"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.MUD[2] = true
    }
    if( (Shop.BETTERSWORD[2] == false) && (Shop.BETTERSWORD[1] <= threshhold)){
        const btn = document.createElement('button')
        if(Shop.BETTERSWORD[1] <= points){
            btn.className = Shop.BETTERSWORD[0] + " shop-button can-purchase"
        } else{
            btn.className = Shop.BETTERSWORD[0] + " shop-button"
        }

        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.BETTERSWORD[0] + "\")")
        btn.style.backgroundColor = "blue"

        const text = document.createElement('div')
        text.className = Shop.BETTERSWORD[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Better sword-" + Shop.BETTERSWORD[1] + " Swords.<br /> Doubles the swords gained per click"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.BETTERSWORD[2] = true
    }
    if( (Shop.FIELD[2] == false) && (Shop.FIELD[1] <= threshhold)){
        const btn = document.createElement('button')
        if(Shop.FIELD[1] <= points){
            btn.className = Shop.FIELD[0] + " shop-button can-purchase"
        } else{
            btn.className = Shop.FIELD[0] + " shop-button"
        }
        
        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.FIELD[0] + "\")")
        btn.style.backgroundColor = "green"

        const text = document.createElement('div')
        text.className = Shop.FIELD[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Field-" + Shop.FIELD[1] + " Swords.<br /> Increases field by 300 pixels"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.FIELD[2] = true
    }
    if( (Shop.LASER[2] == false) && (Shop.LASER[1] <= threshhold)){
        const btn = document.createElement('button')
        if(Shop.LASER[1] <= points){
            btn.className = Shop.LASER[0] + " shop-button can-purchase"
        } else{
            btn.className = Shop.LASER[0] + " shop-button"
        }
        
        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.LASER[0] + "\")")
        btn.style.backgroundColor = "blue"

        const text = document.createElement('div')
        text.className = Shop.LASER[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Laser-" + Shop.LASER[1] + " Swords.<br /> Deals " + Shop.LASER[5] + " damage to enemies"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.LASER[2] = true
    }
    if( (Shop.LASER[3] > 0) && (Shop.LASERDAMAGE[2] == false) && (Shop.LASERDAMAGE[1] <= threshhold)){
        const btn = document.createElement('button')
        if(Shop.LASERDAMAGE[1] <= points){
            btn.className = Shop.LASERDAMAGE[0] + " shop-button can-purchase"
        } else{
            btn.className = Shop.LASERDAMAGE[0] + " shop-button"
        }
        
        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.LASERDAMAGE[0] + "\")")
        btn.style.backgroundColor = "blue"

        const text = document.createElement('div')
        text.className = Shop.LASERDAMAGE[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Laser Upgrade-" + Shop.LASERDAMAGE[1] + " Swords.<br /> Doubles laser damage"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.LASERDAMAGE[2] = true
    }
    if( (Shop.SERVANT[3] > 0) && (Shop.COLLECTOR[2] == false) && (Shop.COLLECTOR[1] <= threshhold)){
        const btn = document.createElement('button')
        if(Shop.COLLECTOR[1] <= points){
            btn.className = Shop.COLLECTOR[0] + " shop-button can-purchase"
        } else{
            btn.className = Shop.COLLECTOR[0] + " shop-button"
        }
        
        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.COLLECTOR[0] + "\")")
        btn.style.backgroundColor = "grey"

        const text = document.createElement('div')
        text.className = Shop.COLLECTOR[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Collector-" + Shop.COLLECTOR[1] + " Swords.<br /> Automatically collects servant's swords"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.COLLECTOR[2] = true
    }
    if( (Shop.SERVANT[3] > 0) && (Shop.FURNACE[2] == false) && (Shop.FURNACE[1] <= threshhold)){
        const btn = document.createElement('button')
        if(Shop.FURNACE[1] <= points){
            btn.className = Shop.FURNACE[0] + " shop-button can-purchase"
        } else{
            btn.className = Shop.FURNACE[0] + " shop-button"
        }
        
        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.FURNACE[0] + "\")")
        btn.style.backgroundColor = "grey"

        const text = document.createElement('div')
        text.className = Shop.FURNACE[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Furnace-" + Shop.FURNACE[1] + " Swords.<br /> Increase servant sword production"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.FURNACE[2] = true
    }
    if( (Shop.BETTERSWORD2[2] == false) && (Shop.BETTERSWORD2[1] <= threshhold)){
        const btn = document.createElement('button')
        if(Shop.BETTERSWORD2[1] <= points){
            btn.className = Shop.BETTERSWORD2[0] + " shop-button can-purchase"
        } else{
            btn.className = Shop.BETTERSWORD2[0] + " shop-button"
        }

        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.BETTERSWORD2[0] + "\")")
        btn.style.backgroundColor = "blue"

        const text = document.createElement('div')
        text.className = Shop.BETTERSWORD2[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Better sword-" + Shop.BETTERSWORD2[1] + " Swords.<br /> Doubles the swords gained per click"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.BETTERSWORD2[2] = true
    }
    if( (Shop.AUTOCLICKER[2] == false) && (Shop.AUTOCLICKER[1] <= threshhold)){
        const btn = document.createElement('button')
        if(Shop.AUTOCLICKER[1] <= points){
            btn.className = Shop.AUTOCLICKER[0] + " shop-button can-purchase"
        } else{
            btn.className = Shop.AUTOCLICKER[0] + " shop-button"
        }

        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.AUTOCLICKER[0] + "\")")
        btn.style.backgroundColor = "blue"

        const text = document.createElement('div')
        text.className = Shop.AUTOCLICKER[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Autoclicker-" + Shop.AUTOCLICKER[1] + " Swords.<br /> Clicks every 2 seconds"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.AUTOCLICKER[2] = true
    }

    if( (Shop.AUTOCLICKER[3] > 0) && (Shop.AUTOCLICKER2[2] == false) && (Shop.AUTOCLICKER2[1] <= threshhold)){
        const btn = document.createElement('button')
        if(Shop.AUTOCLICKER2[1] <= points){
            btn.className = Shop.AUTOCLICKER2[0] + " shop-button can-purchase"
        } else{
            btn.className = Shop.AUTOCLICKER2[0] + " shop-button"
        }

        btn.setAttribute('onclick', "shopButtonClicked(\"" + Shop.AUTOCLICKER2[0] + "\")")
        btn.style.backgroundColor = "blue"

        const text = document.createElement('div')
        text.className = Shop.AUTOCLICKER2[0] + " shop-button-hover-text shadows-into-light-regular"
        text.innerHTML = "Autoclicker-" + Shop.AUTOCLICKER2[1] + " Swords.<br /> Reduces time between clicks"
        btn.appendChild(text)
        shopDiv.appendChild(btn)
        Shop.AUTOCLICKER2[2] = true
    }
}


function spawnEnemy(){
    wavesSpawned++
    if(wavesSpawned %2 == 0 && timeBetweenWaves < 40){
        timeBetweenWaves += 5
    }
    var numOfEnemies =  wavesSpawned * 2;
    waveText.innerHTML = "Waves Survived: " + (wavesSpawned-1)
    for(i=0; i<numOfEnemies; i++){
        var parent = document.createElement("div")
        parent.className = "enemy-wrapper"
        var h1 = document.createElement("h1")
        h1.className = "enemy-cost"
        var randomCost = Math.floor(Math.random()*(wavesSpawned*10)) + (wavesSpawned*5)
        h1.innerHTML = randomCost + " Swords"
        var btn  =document.createElement("button")
        btn.className = "enemy"
        btn.setAttribute("onclick", "clickEnemy(this)")

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

let timerInterval = setInterval(updateTimer, 1000); //uncomment this to start spawning enemies

function moveEnemy(enemy, cost){
    var leftValVW = Math.floor(Math.random()*95) + 1
    enemy.style.left = document.documentElement.clientWidth * leftValVW * 0.01 + "px"

    var topVal = 0
    var id = null
    clearInterval(id)


    id = setInterval(moveEnemyFunc, 10)


    var servantLeft = servantWrapper.getBoundingClientRect().left
    var servantRight = servantWrapper.getBoundingClientRect().right
    var servantTop = servantWrapper.getBoundingClientRect().top + window.scrollY;
    var servantBottom = servantWrapper.getBoundingClientRect().bottom +window.scrollY;

    var enemyLeft = enemy.getBoundingClientRect().left
    var enemyRight = enemy.getBoundingClientRect().right


    function moveEnemyFunc(){
        
        if(document.contains(enemy)){
            if(topVal >= (displayHeight-120)){
                    enemy.remove()
                    currTreasure -= cost
                    treasureText.innerHTML = currTreasure + "/" + totalTreasure + " Gold"
                    if(currTreasure <= 0){
                        gameOver()
                    }
                    clearInterval(id)
            } else{
                
                var enemyTop = enemy.getBoundingClientRect().top + window.scrollY;
                var enemyBottom = enemy.getBoundingClientRect().bottom + window.scrollY;
                

                if (Shop.SERVANT[3]>0 && !(enemyRight < servantLeft || enemyLeft > servantRight || enemyBottom< servantTop || enemyTop > servantBottom)){
                    var progClassList = document.getElementById("progress-1").classList + ""
                    if(progClassList.indexOf("destroyed") == -1){
                        document.getElementById("progress-1").classList.add("destroyed")
                        enemy.remove()
                        clearInterval(id)
                    }

                        
                }
                if(Shop.LASER[3]>0 && document.getElementsByClassName("laserDamage").length != 0 && (!enemy.classList.contains("damagedByLaser")) && enemyBottom >= 290 && enemyBottom <= 360){
                    enemy.classList.add("damagedByLaser")
                    cost -= Shop.LASER[5]
                    if(cost <= 0){
                        enemy.remove()
                        clearInterval(id)
                    }  
                    enemy.getElementsByClassName('enemy-cost')[0].innerHTML = cost + " Swords"
                }
                if(Shop.MUD[3]>0 && enemyBottom >= 300 && enemyBottom <= 460){
                    topVal += 0.25
                    enemy.style.top = topVal + "px"
                } else{
                    topVal += 1
                    enemy.style.top = topVal + "px"
                }
            }
        }
    }
        
}

function clickEnemy(button){
    var enemy = button.parentNode
    var cost = parseInt(enemy.getElementsByClassName('enemy-cost')[0].innerText.substring(0, enemy.getElementsByClassName('enemy-cost')[0].innerText.length-7))
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
    img.setAttribute("src", Shop.SERVANT[3] + " servant.png")
    img.setAttribute("id", "servant img")
    var progress = document.createElement("div")
    progress.className = "progress-bar shadows-into-light-regular"
    progress.setAttribute("id", "progress-" + Shop.SERVANT[3])
    btn.setAttribute("onclick", "clickServant(this)")
    parent.appendChild(progress)
    parent.appendChild(btn)
    parent.appendChild(img)
    
    parent.style.position = "relative"
    parent.setAttribute("id", "servant")
    servantWrapper.appendChild(parent)

    servantAnimation(progress)
}


function servantAnimation(progressBar){
    var size = 0
    var id = null
    clearInterval(id)

    id = setInterval(growProgress, 100)
    progressBar.classList.add("workingServant")

    function growProgress(){
        classList = progressBar.classList + ""
        if(classList.indexOf("destroyed") != -1){
            size = 0
            progressBar.style.width = size + "px"
            document.getElementById("servant img").setAttribute("src", "destroyed.png")
            var btn = document.createElement("button")
            btn.className = "destroyed-button"
            btn.innerHTML = "REPAIR- 100 swords"
            btn.setAttribute("onclick", "repairServant()")
            servantWrapper.appendChild(btn)
            clearInterval(id)
        }
        if(size == (200)){
            progressBar.innerHTML = Shop.SERVANT[5] + " swords"
            progressBar.classList.remove("workingServant")
            progressBar.classList.add("readyServant")

            if(Shop.COLLECTOR[3] != 0){
                clickServant(progressBar.nextSibling)
            }
            clearInterval(id)
            
        } else{
            size+=exponentialGrowth(Shop.SERVANT[3]);
            if(size > 200)
                size=200
            progressBar.style.width = size + "px"
        }
        
    }
}

function repairServant(){
    if(points >= 100){
        changePoints(-100)
        document.getElementById("servant img").setAttribute("src", Shop.SERVANT[3] + " servant.png")
        var progBar = document.getElementById("progress-1")
        progBar.classList.remove("destroyed")
        document.getElementsByClassName("destroyed-button")[0].remove()
        servantAnimation(progBar)
    }
}





function laserRecharge(laserProgBar){
    if(document.getElementsByClassName("laserDamage").length == 0 && document.getElementsByClassName("activateLaser").length == 0){
        laserProgBar.style.width = 50/Shop.LASER[6] + laserProgBar.getBoundingClientRect().width + "px"
        if(laserProgBar.getBoundingClientRect().width >= 50){
            laserProgBar.style.width = "0px"

            var btn = document.createElement("button")
            btn.classList.add("activateLaser")
            btn.innerHTML = "Shoot Laser!"
            btn.setAttribute('onclick', "shootLaser(this)")

            document.getElementsByClassName("laser")[0].appendChild(btn)


            var enemies = document.getElementsByClassName("enemy-wrapper")
            for(const e of enemies){
                e.classList.remove("damagedByLaser")
            }
        }
    }
    
}



function shootLaser(button){
    var beam = document.createElement("div")
    beam.classList.add("laserDamage")
    document.getElementsByClassName("laser")[0].appendChild(beam)
    button.remove()


    var timer = 0
    var id = null
    clearInterval(id)

    id = setInterval(shootBeam, 500)
    
    function shootBeam(){
        if(timer == .5){
            beam.remove()
            clearInterval(id)
        }
        timer += .5
    }
}

function exponentialGrowth(x){
    return Math.pow(2,x);
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
    if(classList.indexOf("workingServant") == -1){
        servantAnimation(progress)
    }
}

function changePoints(p){
    points += Math.round(p)
    
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
    elem.innerHTML = "GAME OVER<br/>Your enemies took all the treasure!<br/>You survived " + (wavesSpawned-1) + " waves"
    document.body.appendChild(elem)
}

