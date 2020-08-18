const cardFormContainer = document.querySelector(".container");
const addBtn = document.querySelector("#new-card-btn") 
let addCard = false;
addBtn.addEventListener("click", function() {
// hide & seek with the form
addCard = !addCard;
if (addCard) {
    cardFormContainer.style.display = "block";
} else {
    cardFormContainer.style.display = "none";
}
});
const baseUrl = 'http://localhost:3000'
const cardUrl = baseUrl + '/cards/'
const commentUrl = baseUrl + '/comments/'
const cardDiv = document.querySelector('#card-collection')
const cardForm = document.querySelector('.add-card-form')
cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    createACard(e);
    cardForm.reset();
    cardFormContainer.style.display = "none"
});

const apiHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json"
}


function getAllCards() {
    fetch(cardUrl)
    .then((resp) => resp.json())
    .then((cards) => cards.forEach((card) => makeOneCard(card)));
}


function patch(card, number) {
const configObject = {
method: 'PATCH',
headers: {
'Content-Type': 'application/json',
Accept: 'application/json'
},
body: JSON.stringify({
likes: number,
})
};
return fetch(cardUrl + `${card.id}`, configObject)
.then(resp => resp.json())
}

function post(e, card) { 
    let object = {
        card_id: card.id,
        content: e.target[0].value
    };
    let configObject = {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    },
    body: JSON.stringify(object)
    };
    return fetch(commentUrl, configObject)
    .then(resp => resp.json())
    .catch(error => console.log(error))
};

function makeAComment (comment, ul) {
    const li = document.createElement('li') 
        li.className = 'comment-list'
        li.innerText = comment.content
        const deleteButton = document.createElement('button')
        deleteButton.className = 'delete-comment'
        deleteButton.innerText = 'Delete'
        deleteButton.addEventListener('click', () => {
            deleteSomething(commentUrl, comment.id )
                li.remove()
        })
    
        li.append(deleteButton)
        ul.append(li)
}

function deleteSomething(url, id) {
    const configObject = {
    method: 'DELETE'
    };
    return fetch(url + `${id}`, configObject)
    .then(resp => resp.json())
}

function createACard(e) {
    let object = {
        likes: 0, 
        image: e.target[0].value
    };
    
    let configObject = {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    },
    body: JSON.stringify(object)
    };
    
    fetch(cardUrl, configObject)
    .then(resp => resp.json())
    .then(data => makeOneCard(data))
    .catch(error => console.log(error));
}

function makeOneCard(card) {
    const cardCard = document.createElement('div')
    cardCard.className = "card"

    const x = document.createElement('button')
    x.className = "deleteCard"
    x.innerText = 'x'
    x.addEventListener('click', () => {
        deleteSomething(cardUrl, card.id)
        cardCard.remove()
    })

    const img = document.createElement('img')
    img.src = card.image
    img.className = "card-avatar"

    const likeDiv = document.createElement('div')
    likeDiv.className = "likes-section"
    
    const likeButton = document.createElement('button')
    likeButton.className = "like-btn"
    likeButton.innerText = "❤️"
    likeButton.addEventListener('click', () => {
        let number = parseInt(likeSpan.innerText)
        ++number

        patch(card, number).then(likeSpan.innerText = `${number} Likes`)
    })
    
    const likeSpan = document.createElement('span')
    likeSpan.className = "likes"
    likeSpan.innerText = `${card.likes} Likes`

    const commentDiv = document.createElement('div')
    commentDiv.className = "comment-section"

    const ul = document.createElement('ul')
    ul.className = "comments"

    // get comments in li so it renders all comment for a particular card
    if (card.comments) { 
    card.comments.forEach(comment => {
        makeAComment(comment, ul)
    })
    }
    const commentButton = document.createElement('button')
    commentButton.className = 'commentButton'
    commentButton.innerText = '🗯'
    commentButton.addEventListener('click', () => {
        if (ul.style.display === 'none') {
            ul.style.display = 'block'
        }else{
        ul.style.display = 'none'
        }
    })

    const form = document.createElement("form");
    const input = document.createElement("input"); //input element, text
    input.setAttribute('type',"text");
    input.setAttribute('placeholder',"Add Comment...");

    const submitButton = document.createElement("input"); //input element, Submit button
    // submitButton.className = "comment-button";
    submitButton.setAttribute('type', "submit");
    submitButton.setAttribute('value',"Post");
    submitButton.innerText = "Post";
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const comment = {
            content: e.target[0].value
        }
        post(e, card)
        .then(newComment => makeAComment(newComment, ul))
        form.reset();
    })

    form.append(input, submitButton)
    commentDiv.append(commentButton, ul, form)
    likeDiv.append(likeSpan, likeButton)
    cardCard.append(x, img, likeDiv, commentDiv)
    cardDiv.append(cardCard)

}
getAllCards();