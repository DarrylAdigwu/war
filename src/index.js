let deckId = localStorage.getItem("deckId")
const newDeck = document.getElementById("get-new-deck");
const drawCardsBtn = document.getElementById("draw-cards");
const cardContainer = document.getElementById("card-container");
const remaining = document.getElementById("remaining");
const computerScore = document.getElementById("comp-score");
const userScore = document.getElementById("user-score");
const statusMessage = document.getElementById("status-message")
let compCount = 0;
let userCount = 0;

const getNewDeck = async function (){
  const response = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
  const data = await response.json();

  remaining.textContent = `Remaining cards: ${data.remaining}`;
  localStorage.setItem("deckId", data.deck_id)
  deckId = data.deck_id
  
  compCount = 0;
  userCount = 0
  computerScore.textContent = `Computer: 0`;
  userScore.textContent = `Me: 0`;
}

newDeck.addEventListener("click", getNewDeck);

const drawCards = async function(){
  const response = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
  const data = await response.json()

  const computerCard = data.cards[0];
  const playerCard = data.cards[1];

  if(data.remaining === 0) {
    if(compCount > userCount) {
      statusMessage.textContent = "Computer Won the Game!"
    } else if (userCount > compCount) {
      statusMessage.textContent = "You won the Game!"
    } else {
      statusMessage.textContent = "It's a tie..."
    }

    statusMessage.textContent = result;
    drawCardsBtn.setAttribute("disabled", true)
  }

  remaining.textContent = `Remaining cards: ${data.remaining}`;

  cardContainer.children[0].innerHTML = `
    <img src="${computerCard.image}" />
  `
  cardContainer.children[1].innerHTML = `
    <img src=${playerCard.image} />
  `

  const winner = getWinningCard(computerCard, playerCard);
  statusMessage.innerHTML = `${winner}`
}

drawCardsBtn.addEventListener("click", drawCards)

function getWinningCard(compCard, userCard) {
  const currentCards = [compCard.value, userCard.value];
  
  currentCards.map((card, index) => {
    switch(card) {
      case "JACK":
        currentCards[index] = 11;
        break;
      case "QUEEN":
        currentCards[index] = 12;
        break;
      case "KING":
        currentCards[index] = 13;
        break;
      case "ACE":
        currentCards[index] = 14;
        break;
      default:
        currentCards[index] = Number(card);
    }
  })
  
  const highCard = currentCards.reduce((initial, currentCard) => {
     if(initial > currentCard) {
      compCount++
      computerScore.textContent = `Computer: ${compCount}`
      return `Computer wins!`
     } else if (currentCard > initial) {
      userCount++
      userScore.textContent = `Me: ${userCount}`
      return `You win!`
     } else {
      return "War!"
     }
  })

  return highCard;
}
