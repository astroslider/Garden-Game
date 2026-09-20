console.log("Garden Game has started!")

// Getting dynamic input value and logging value to console and getting the type
// and Updating the minutes in stat-minutes; using a closure and a callback function
function updateStatistics () {
    let totalMinutes = 0;
    let totalUnits = 0;
    let totalPlants = 0;
    let plantCollection = [];
    let loadFailed = false;
    
    const hiddenMessageBox = document.getElementById("hidden-message-box");
    const hiddenMessage = document.getElementById("hidden-message");
    const statPlantsEl = document.getElementById("stat-plants");
    const statUnitsEl = document.getElementById("stat-trainings");
    const statMinutesEl = document.getElementById("stat-minutes");

    
    let timerId;

     const plantImage = {
        "Meadow Flowers": {
            Daisy:"Garden Game Images/Meadow Flowers/daisy.png",
            Buttercup: "Garden Game Images/Meadow Flowers/buttercup.png",
            Clover: "Garden Game Images/Meadow Flowers/clover.png",
            "Forget-me-not": "Garden Game Images/Meadow Flowers/forget-me-not.png"
        },
        
        "Spring Flowers": {
            Tulip: "Garden Game Images/Spring Flowers/tulip.png",
            Daffodil: "Garden Game Images/Spring Flowers/daffodil.png",
            Hyacinth: "Garden Game Images/Spring Flowers/hyacinth.png",
            Crocus: "Garden Game Images/Spring Flowers/crocus.png"
        },

        "Wildflowers": {
            Chamomile: "Garden Game Images/Wildflowers/chamomile.png",
            Cornflower: "Garden Game Images/Wildflowers/cornflower.png",
            Poppy: "Garden Game Images/Wildflowers/poppy.png",
            Yarrow: "Garden Game Images/Wildflowers/yarrow.png"
        },

        "Garden Perennials": {
            Aster: "Garden Game Images/Garden Perennials/aster.png",
            Coneflower: "Garden Game Images/Garden Perennials/coneflower.png",
            Lavender: "Garden Game Images/Garden Perennials/lavender.png",
            Sage: "Garden Game Images/Garden Perennials/sage.png"
        },

        "Shrubs": {
            Hydrangea: "Garden Game Images/Shrubs/hydrangea.png",
            Lilac: "Garden Game Images/Shrubs/lilac.png",
            Rhododendron: "Garden Game Images/Shrubs/rhododendron.png",
            Azalea: "Garden Game Images/Shrubs/azalea.png"
        },

        "Magnificent Perennials": {
            Sunflower: "Garden Game Images/Magnificent Perennials/sunflower.png",
            Hollyhock: "Garden Game Images/Magnificent Perennials/hollyhock.png",
            Delphinium: "Garden Game Images/Magnificent Perennials/delphinium.png",
            Lupine: "Garden Game Images/Magnificent Perennials/lupine.png"
        },

        "Young Trees": {
            Birch: "Garden Game Images/Young Trees/birch.png",
            "Apple Tree": "Garden Game Images/Young Trees/apple-tree.png",
            Willow: "Garden Game Images/Young Trees/willow.png",
            "Cherry Tree": "Garden Game Images/Young Trees/cherry-tree.png"
        },

        "Magnificent Trees": {
            Oak: "Garden Game Images/Magnificent Trees/oak.png",
            Maple: "Garden Game Images/Magnificent Trees/maple.png",
            Beech: "Garden Game Images/Magnificent Trees/beech.png",
            Chestnut: "Garden Game Images/Magnificent Trees/chestnut.png"
        }
    };

    const gardenEl = document.getElementById("garden");
    const savedGameStats = localStorage.getItem("gameStats");

    // Fehlerprüfung für den gespeicherten Spielstand, um sicherzustellen, dass die Daten korrekt sind und keine Fehler enthalten
if (savedGameStats) { 
    try {const gameStats = JSON.parse(savedGameStats); 
        // gameStats.totalMinutes = -1; // Nur zum Fehler testen
        const validMinutes = Number.isInteger(gameStats.totalMinutes) && 
        gameStats.totalMinutes >= 0; 
        const validUnits = Number.isInteger(gameStats.totalUnits) && 
        gameStats.totalUnits >= 0; 
        const validPlants = Number.isInteger(gameStats.totalPlants) && 
        gameStats.totalPlants >= 0; const
        validCollection = Array.isArray(gameStats.plantCollection);
         // Check every plant for errors within the array for plantGroup, plantName, top & left 
        const checkArrayPlantCollection = validCollection 
        && gameStats.plantCollection.every(
            plant => {
                const validStructure =
                typeof plant === "object" && 
                !Array.isArray(plant) && 
                plant !== null && 
                typeof plantImage[plant.plantGroup]?.[plant.plantName] === "string" &&
                typeof plant.top === "string" &&
                typeof plant.left === "string";
                
                if (!validStructure) {
                    return false;
                }
                // Check top and left
                const plantTopCheckNumber = Number(plant.top.slice(0, -2));
                const plantLeftCheckNumber = Number(plant.left.slice(0, -2));
                const plantTopCheckPx = plant.top.slice(-2);
                const plantLeftCheckPx = plant.left.slice(-2);
                // Check that plant sizes are valid
                 // Create plant image element
                const testPlant = document.createElement("img");
            
                // Breite und Höhe des Gartens ermitteln    
                const gardenElWidth = gardenEl.offsetWidth;
                const gardenElHeight = gardenEl.offsetHeight;
            
                // assign the plant Element a class named "testplant"
                testPlant.classList.add("plant");
                const plantGroupClass = plant.plantGroup.toLowerCase().replace(" ", "-")
                testPlant.classList.add(plantGroupClass)
                gardenEl.appendChild(testPlant);
                
                // Breite und Höhe der einzelnen Pflanzen ermitteln
                const testPlantWidth = testPlant.offsetWidth;
                const testPlantHeight = testPlant.offsetHeight;
                const plantStyle = getComputedStyle(testPlant);
                const plantMarginLeft = parseFloat(plantStyle.marginLeft);
                const plantMarginTop = parseFloat(plantStyle.marginTop);
                testPlant.remove()
                        
                return (
                plant.top.slice(0, -2).trim() !== "" &&
                plant.left.slice(0, -2).trim() !== "" &&
                Number.isInteger(plantTopCheckNumber) && plantTopCheckNumber >= 0 &&
                Number.isInteger(plantLeftCheckNumber) && plantLeftCheckNumber >= 0 &&
                plantTopCheckPx === "px" &&
                plantLeftCheckPx === "px" &&
                plantLeftCheckNumber + plantMarginLeft + testPlantWidth <= gardenElWidth &&
                plantTopCheckNumber + plantMarginTop + testPlantHeight <= gardenElHeight
                )
                }
                ); 
        if (validMinutes && validUnits && validPlants && validCollection && checkArrayPlantCollection) {
            totalMinutes = gameStats.totalMinutes; 
            totalUnits = gameStats.totalUnits; 
            totalPlants = gameStats.totalPlants; 
            plantCollection = gameStats.plantCollection; 
            } else {
                console.warn("Der Speicherstand enthält ungültige Daten und wurde nicht geladen.")
                loadFailed = true;
            }
        } catch (error) {
            console.warn("Der Speicherstand konnte nicht geladen werden.", error); 
            loadFailed = true;
        } 
    }
    if (loadFailed) {
        hiddenMessageBox.hidden = false;
        hiddenMessage.textContent = "Dein Speicherstand konnte nicht geladen werden. Neue Einträge sind zum Schutz deiner Daten gesperrt.";
    }
// Dafür sorgen, dass die Pflanzen aus dem localStorage wieder im Garten angezeigt werden, wenn die Seite neu geladen wird
const gardenViewport = document.getElementById("garden-viewport");

function resizeGarden() {
    const scale = gardenViewport.clientWidth / gardenEl.offsetWidth;

    gardenEl.style.transform = `scale(${scale})`;
    gardenViewport.style.height = `${gardenEl.offsetHeight * scale}px`;
}

resizeGarden();
window.addEventListener("resize", resizeGarden);
plantCollection.forEach((plant) => {
        const nextPlant = document.createElement("img");
        nextPlant.src = plantImage[plant.plantGroup][plant.plantName];
        nextPlant.classList.add("plant");
        const plantFromArray = plant.plantGroup.toLowerCase().replace(" ", "-");
        nextPlant.classList.add(plantFromArray);
        nextPlant.style.top = plant.top;
        nextPlant.style.left = plant.left
        gardenEl.appendChild(nextPlant);
    }
    )

function saveGameStats () {
    const gameStats = {
        totalMinutes: totalMinutes,
        totalUnits: totalUnits,
        totalPlants: totalPlants,
        plantCollection: plantCollection
    };
    localStorage.setItem("gameStats", JSON.stringify(gameStats))
}

function updateStatisticsDisplay () {
    statMinutesEl.textContent = totalMinutes;
    statUnitsEl.textContent = totalUnits;
    statPlantsEl.textContent = totalPlants;
    }

    updateStatisticsDisplay();


// Garten zurücksetzen
document.getElementById("reset-btn").addEventListener("click", () => {
    if (window.confirm("Möchtest Du den Garten wirklich zurücksetzen?")) {
        totalMinutes = 0;
        totalUnits = 0;
        totalPlants = 0;
        updateStatisticsDisplay()
        plantCollection = [];
        localStorage.removeItem("gameStats");
        loadFailed = false;
        gardenEl.querySelectorAll(".plant").forEach((plant) => {
            plant.remove();
            });
        clearTimeout(timerId);
        hiddenMessageBox.hidden = true;
    } else {
        return;
    }
});


// "Eintragen" wird gedrückt
document.querySelector(".time-tracker-form").addEventListener("submit", (event) => {
    event.preventDefault();
    // Eintragungen bei fehlerhaftem Laden nicht ermöglichen
    if (loadFailed) {
        return;
    }
    

    // Minutes Statistics Update
    const value = document.getElementById("time").value;
    const minutes = Number(value);
    // Gemeinsamer Nenner, um dafür zu sorgen, dass unter 5 Minuten die Statistik nicht aktualisiert wird
    if (minutes >= 5) {
    hiddenMessage.textContent = `Du hast ${value} Minuten eingetragen.`;
    totalMinutes += minutes;
        
    // Trainings Statistics Update
    totalUnits++
    } else {
        hiddenMessage.textContent = `Bitte gib mindestens 5 Minuten ein.`;
    }


    // Selecting plantGroup based on minutes input
    let plantGroup;
  if (minutes >= 90) {
        plantGroup = "Magnificent Trees"
    } else if (minutes >= 60) {
        plantGroup = "Young Trees"
    } else if (minutes >= 45) {
        plantGroup = "Magnificent Perennials"
    } else if (minutes >= 30) {
        plantGroup = "Shrubs"
    } else if (minutes >= 20) {
        plantGroup = "Garden Perennials"
    } else if (minutes >= 15) {
        plantGroup = "Wildflowers"
    } else if (minutes >= 10) {
        plantGroup = "Spring Flowers"
    } else if (minutes >= 5) {
        plantGroup = "Meadow Flowers"
    } else {
        plantGroup = null
}
    console.log(plantGroup)
    console.log(minutes);
    
    // Determine plantGroup and select random plant from plantGroup
    function plantChooser (plantGroup) {
        let plants; 
        
        if (plantGroup === "Meadow Flowers") {
            const meadowFlowers = ["Daisy", "Buttercup", "Clover","Forget-me-not"];
            plants = meadowFlowers;
        } else if (plantGroup === "Spring Flowers") {
            const springFlowers = ["Tulip", "Daffodil", "Crocus", "Hyacinth"];
            plants = springFlowers;
        } else if (plantGroup === "Wildflowers") {
            const wildflowers = ["Poppy", "Cornflower", "Chamomile", "Yarrow"];
            plants = wildflowers;
        } else if (plantGroup === "Garden Perennials") {
            const gardenPerennials = ["Lavender", "Sage", "Coneflower", "Aster"];
            plants = gardenPerennials;
        } else if (plantGroup === "Shrubs") {
            const shrubs = [ "Hydrangea", "Lilac", "Rhododendron", "Azalea"];
            plants = shrubs;
        } else if (plantGroup === "Magnificent Perennials") {
            const magnificentPerennials = ["Sunflower", "Hollyhock", "Delphinium", "Lupine"]
            plants = magnificentPerennials;
        } else if (plantGroup === "Young Trees") {
            const youngTrees = ["Birch", "Apple Tree", "Willow", "Cherry Tree"];
            plants = youngTrees;
        } else if (plantGroup === "Magnificent Trees") {
            const magnificentTrees = ["Oak", "Maple", "Beech", "Chestnut"];
            plants = magnificentTrees;
        } else { 
            return
        }
        const randomIndex = Math.floor(Math.random() * plants.length);
        const randomPlant = plants[randomIndex];
        return randomPlant;   
    }
    const randomPlant = plantChooser(plantGroup);
    if (randomPlant) {
         // Plant appears as an img Element in garden
    const gardenEl = document.getElementById("garden");
    
    // Create plant image element
    const nextPlant = document.createElement("img");
    nextPlant.src = plantImage[plantGroup][randomPlant];
       
        // Breite und Höhe des Gartens ermitteln    
        const gardenElWidth = gardenEl.offsetWidth;
        const gardenElHeight = gardenEl.offsetHeight;
       
        // assign the plant Element a class named "plant"
        nextPlant.classList.add("plant");
        const plantGroupClass = plantGroup.toLowerCase().replace(" ", "-")
        nextPlant.classList.add(plantGroupClass)
        const plants = document.querySelectorAll(".plant")
        gardenEl.appendChild(nextPlant);
        
        // Breite und Höhe der einzelnen Pflanzen ermitteln
        const nextPlantWidth = nextPlant.offsetWidth;
        const nextPlantHeight = nextPlant.offsetHeight;

        // Algorithmus der prüft, ob ein freier Platz für eine Pflanze gefunden werden kann. Bei 100 Fehlversuchen wird Schleife beendet.
        let positionFound = false;
        let i = 0;
        while (!positionFound && i < 100) {
            i++
            let collisionFound = false;
            // Zufällige Positionsfindung, s. Stern1
            nextPlant.style.top = Math.floor(Math.random() * (gardenElHeight - nextPlantHeight - 20)) + 10 + "px"
            nextPlant.style.left = Math.floor(Math.random() * (gardenElWidth - nextPlantWidth - 20)) + 10 + "px"
            // Vier Kanten der neuen Pflanze bestimmen
            const nextPlantLeft = nextPlant.offsetLeft;
            const nextPlantTop = nextPlant.offsetTop;
            const nextPlantRight = nextPlantLeft + nextPlant.offsetWidth;
            const nextPlantBottom = nextPlantTop + nextPlant.offsetHeight;
            // Alle Pflanzen mit einer Schleife prüfen
            for (const plant of plants) {
                const plantLeft = plant.offsetLeft;
                const plantTop = plant.offsetTop;
                const plantRight = plantLeft + plant.offsetWidth;
                const plantBottom = plantTop + plant.offsetHeight;
                // Feststellung von Überlappung
                const isOverLapping = !(
                    plantTop > nextPlantBottom ||
                    plantBottom < nextPlantTop ||
                    plantLeft > nextPlantRight ||
                    nextPlantLeft > plantRight
                    )
                if (isOverLapping === true) {
                    collisionFound = true; 
                    break
                    }
            }
            if (collisionFound === false) {
                positionFound = true
            }
            }
        
            // Create plantData Object
            if (positionFound === true) {
                hiddenMessage.textContent += ` Dein Garten wächst!`;
                // Plants Statistics Update
                const plantData = {
                    plantGroup: plantGroup,
                    plantName: randomPlant,
                    top: nextPlant.style.top,
                    left: nextPlant.style.left
                }
                const addPlantData = plantCollection.push(plantData);
                    totalPlants++   
            } else {
                nextPlant.remove()
                hiddenMessage.textContent += ` Für diese Pflanze wurde kein freier Platz gefunden.`;
            }
    }
    console.log(plantGroup)
    console.log(randomPlant)

   
    updateStatisticsDisplay();        
    saveGameStats();
    document.getElementById("time").value = "";
    hiddenMessageBox.hidden = false;
    clearTimeout(timerId);
    timerId = setTimeout(function() {
        hiddenMessageBox.hidden = true;
    }, 4000);

    }
);
}

updateStatistics();
