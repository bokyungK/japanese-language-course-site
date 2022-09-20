// api 호출
const courselevelList = ['basic', 'middle', 'advanced'];
const url = "http://localhost:3001/"

courselevelList.forEach((level, levelIdx) => {
    fetch(url + level)
    .then((response) => response.json())
    .then((data) => {
        data.forEach((courseInfo, courseInfoIdx) => {
            const id = courseInfo.id;
            const name = courseInfo.name;
            const description = courseInfo.description;

            const cardContainer = document.getElementsByClassName('card-container');
            const card = document.createElement('li');
            card.classList.add('card');
            const cardImg = document.createElement('img');
            cardImg.classList.add('card-img');
            cardImg.style.width = '180px';
            cardImg.style.height = '140px';
            const cardDetail = document.createElement('a');
            cardDetail.classList.add('card-detail');
            cardDetail.setAttribute('href', 'https://www.youtube.com/');
            const cardName = document.createElement('div');
            cardName.classList.add('card-detail-name');
            const cardDescription = document.createElement('div')
            cardDescription.classList.add('card-detail-description');
            
            cardImg.setAttribute('src', './img/course-img/' + `${level}/${id}.jpg`);
            cardName.innerText = name;
            cardDescription.innerText = description;
            cardDetail.appendChild(cardName);
            cardDetail.appendChild(cardDescription);
            card.appendChild(cardImg);
            card.appendChild(cardDetail);
            cardContainer[levelIdx].appendChild(card);
        })
    })
    .then(() => {
        flowText();
    });
});



// 페이지 업 버튼
const upward = document.getElementById('upward-button');
const checkScroll = () => {
    let pageYOffset = window.pageYOffset;

    if (pageYOffset !== 0) {
        upward.classList.add('show');
    } else {
        upward.classList.remove('show');
    }
}

const moveBackToTop = () => {
    if (window.pageYOffset > 0) {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}

window.addEventListener('scroll', checkScroll);
upward.addEventListener('click', moveBackToTop);



// 강의 슬라이더
const leftButton = document.getElementsByClassName('left-button');
const rightButton = document.getElementsByClassName('right-button');

function moveRight(event) {
    const leftButton = event.target;
    const rightButton = leftButton.nextElementSibling;
    const cardContainer = leftButton.parentElement.parentElement.nextElementSibling;
    const lectureContainer = cardContainer.parentElement;
    let moveDist = parseInt(lectureContainer.getAttribute('data-moveDist'));

    moveDist = moveDist + 196 * 4;
    lectureContainer.setAttribute('data-moveDist', `${moveDist}`);
    cardContainer.style.transform = 'translateX(' + String(moveDist) + 'px';    
    rightButton.addEventListener('click', moveLeft);
    rightButton.classList.remove('button-right-off');
    rightButton.classList.add('button-right-on');

    if (moveDist === 0) {
        leftButton.removeEventListener('click', moveRight);
        leftButton.classList.remove('button-left-on');
    }
}

function moveLeft(event) {
    const rightButton = event.target;
    const leftButton = rightButton.previousElementSibling;
    const cardContainer = rightButton.parentElement.parentElement.nextElementSibling;
    const liList = rightButton.parentElement.parentElement.nextElementSibling.children;
    const lectureContainer = cardContainer.parentElement;
    let lectureContainerWidth = parseInt(window.getComputedStyle(lectureContainer).width);
    let moveDist = parseInt(lectureContainer.getAttribute('data-moveDist'));

    leftButton.addEventListener('click', moveRight);
    leftButton.classList.add('button-left-on');
    moveDist = moveDist - 196 * 4;
    lectureContainer.setAttribute('data-moveDist', `${moveDist}`);
    cardContainer.style.transition = 'transform 1s';
    cardContainer.style.transform = 'translateX(' + String(moveDist) + 'px';

    if (liList.length * 196 + moveDist < lectureContainerWidth) {
        rightButton.removeEventListener('click', moveLeft);
        rightButton.classList.remove('button-right-on');
        rightButton.classList.add('button-right-off');
    }
}

for (let i = 0; i < leftButton.length; i++) {
    rightButton[i].addEventListener('click', moveLeft);
}



// 강의 description 이동 기능
const flowText = () => {
    const cardDetail = document.getElementsByClassName('card-detail');
    
    const moveDescription = (event) => {
        const description = event.target.children[1];
        const descriptionWidth = parseInt(window.getComputedStyle(description).width);
    
        if (descriptionWidth >= 164) {
        description.style.transition = 'transform 2s';
        description.style.transform = `translateX(-${Math.abs(descriptionWidth - 164)}px)`
        event.target.addEventListener('mouseout', returnDescription);
        }
    }
    
    const returnDescription = (event) => {
        const description = event.target.children[1];
        description.style.transform = 'translateX(0)';
    }
    
    for (let i = 0; i < cardDetail.length; i++) {
        cardDetail[i].addEventListener('mouseover', moveDescription);
    }
}