import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const endorsementFieldEl = document.getElementById("endorsement-value")
const publishBtn = document.getElementById("publish-btn")
const endorsementListEl = document.getElementById("endorsement-list")

// to and from info
const fromInputEl = document.getElementById("from-input")
const toInputEl = document.getElementById("to-input")

const appSettings = {
    databaseURL: "https://new-app-a0dbd-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementInDB = ref(database, "endorsement")

publishBtn.addEventListener("click", function() {
    
    let data = {
        from: fromInputEl.value,
        to: toInputEl.value,
        text: endorsementFieldEl.value,
        count: 0,
    }

    if (fromInputEl.value || toInputEl.value || endorsementFieldEl.value) {
        push(endorsementInDB, data)
        clearEndorsementFieldEl()
        
    }
})

onValue (endorsementInDB, function(snapshot) {
    if (snapshot.exists()) {
        let endorsementArray = Object.entries(snapshot.val()).reverse()
        clearEndorsementsListEl()
        for (let i = 0; i < endorsementArray.length; i++) {
            let currentEndorsementArray = endorsementArray[i]
            appendItemsToendorsementListEl(currentEndorsementArray)
        }
    } else {
        endorsementListEl.innerHTML = `Please write your 1st endorsement`
    }

})


function appendItemsToendorsementListEl(entry) {
    const entryText = entry[1].text
    const entryFrom = entry[1].from
    const entryTo = entry[1].to
    let itemID = entry[0]
    let likesCount = entry[1].count


    const newEl = document.createElement("li")
    newEl.innerHTML = `<p class="bold-p">To ${entryTo}</p>
                       <p>${entryText}</p>`
    const divEl = document.createElement("div")
    divEl.innerHTML = `<span class="bold-p">From ${entryFrom}</span>`

    const countEl = document.createElement("span")
    countEl.addEventListener("click", function() {
        let exactLocationOfEntryInDB = ref(database, `/endorsement/${itemID}`)

        let likedArray = JSON.parse(localStorage.getItem("likedPosts"))

        if (likedArray === null) {
            update(exactLocationOfEntryInDB, { count: ++likesCount })
            localStorage.setItem("likedPost", JSON.stringify([itemID]))
        } else if (!likedArray.includes(itemID)) {
            update(exactLocationOfEntryInDB, { count: ++likesCount })
            likedArray.push(itemID)
            localStorage.setItem("likedPost", JSON.stringify(likedArray))
        }

    })
    countEl.innerHTML = `❤️ ${likesCount}`

    divEl.append(countEl)
    newEl.append(divEl)
    endorsementListEl.append(newEl)
}

function clearEndorsementFieldEl() {
    endorsementFieldEl.value = ""
    fromInputEl.value = ""
    toInputEl.value = ""
}

function clearEndorsementsListEl() {
    endorsementListEl.innerHTML = "";
  }
