// api 호출
const courselevelList = ['basic', 'middle', 'advanced'];
const url = "https://unks9ywcwe.execute-api.ap-northeast-2.amazonaws.com/";

courselevelList.forEach((level, levelIdx) => {
    fetch(url + level)
    .then((response) => response.json())
    .then((data) => {
        data.forEach((courseInfo) => {
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
            cardDetail.setAttribute('href', '');
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
    })
    .then(() => {
        setButton(levelIdx);
    })
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



// 데이터 개수에 따른 초기 버튼 상태 세팅
const setButton = (levelIdx) => {
    const cardContainer = document.getElementsByClassName('card-container')[levelIdx];
    const cardContainerWidth = parseInt(window.getComputedStyle(cardContainer).width) + 16;
    const lectureContainer = cardContainer.parentElement;
    const nowSliderWidth = parseInt(window.getComputedStyle(lectureContainer).width);
    const rightButton = cardContainer.previousElementSibling.children[1].children[1];

    if (cardContainerWidth > nowSliderWidth) {
        rightButton.classList.add('button-on');
        rightButton.addEventListener('click', moveLeft);
    } else {
        rightButton.classList.remove('button-on');
        rightButton.removeEventListener('click', moveLeft);
    }
}        



// 화면 크기별 버튼 상태 바꾸기
const changeButton = () => {
    const cardContainer = document.getElementsByClassName('card-container');
    const cardContainerArr = Array.from(cardContainer);

    cardContainerArr.forEach((cardContainer) => { 
        const cardContainerWidth = parseInt(window.getComputedStyle(cardContainer).width) + 16;
        const lectureContainer = cardContainer.parentElement;
        const nowSliderWidth = parseInt(window.getComputedStyle(lectureContainer).width);
        const rightButton = cardContainer.previousElementSibling.children[1].children[1];
    
        if (cardContainerWidth > nowSliderWidth) {
            rightButton.classList.add('button-on');
            rightButton.addEventListener('click', moveLeft);
        } else {
            rightButton.classList.remove('button-on');
            rightButton.removeEventListener('click', moveLeft);
        }
    })
}



// 강의 슬라이더 기능
function moveRight(event) {
    const leftButton = event.target;
    const rightButton = leftButton.nextElementSibling;
    const cardContainer = leftButton.parentElement.parentElement.nextElementSibling;
    const lectureContainer = cardContainer.parentElement;
    const nowSliderWidth = parseInt(window.getComputedStyle(lectureContainer).width);
    let moveDist = parseInt(lectureContainer.getAttribute('data-move'));
    cardContainer.style.removeProperty('transition');

    if (Math.abs(moveDist) > nowSliderWidth) {
        moveDist += nowSliderWidth;
        cardContainer.style.transform = 'translateX(' + String(moveDist) + 'px)';
    } else {
        moveDist = 0;
        cardContainer.style.transform = 'translateX(' + String(moveDist) + 'px)';
        leftButton.removeEventListener('click', moveRight);
        leftButton.classList.remove('button-on');
    }
    lectureContainer.setAttribute('data-move', `${moveDist}`);
    rightButton.addEventListener('click', moveLeft);
    rightButton.classList.add('button-on');
    rightButton.removeAttribute('data-last-width');
}

function moveLeft(event) {
    const rightButton = event.target;
    const leftButton = rightButton.previousElementSibling;
    const cardContainer = rightButton.parentElement.parentElement.nextElementSibling;
    const cardContainerWidth = parseInt(window.getComputedStyle(cardContainer).width);
    const lectureContainer = cardContainer.parentElement;
    const nowSliderWidth = parseInt(window.getComputedStyle(lectureContainer).width);
    let moveDist = parseInt(lectureContainer.getAttribute('data-move'));
    moveDist -= nowSliderWidth;

    if (cardContainerWidth + moveDist > nowSliderWidth) {
        cardContainer.style.transform = 'translateX(' + String(moveDist) + 'px)';
    } else {
        moveDist -= cardContainerWidth + moveDist - nowSliderWidth;
        cardContainer.style.transform = 'translateX(' + String(moveDist) + 'px)';
        rightButton.removeEventListener('click', moveLeft);
        rightButton.classList.remove('button-on');
        rightButton.setAttribute('data-last-width', `${nowSliderWidth}`);
    }
    lectureContainer.setAttribute('data-move', `${moveDist}`);
    leftButton.addEventListener('click', moveRight);
    leftButton.classList.add('button-on');
}



// 터치로 이동하는 경우
const cardContainer = Array.from(document.getElementsByClassName('card-container'));

const startTouchOnSlider= (event) => {
    const currentSlider = event.currentTarget;
    const startX = event.touches[0].clientX;
    
    currentSlider.addEventListener('touchmove', moveTouchOnSlider);
    currentSlider.addEventListener('touchend', endTouchOnSlider);
    currentSlider.setAttribute('data-touch-X', `${startX}`);
}

const moveTouchOnSlider = (event) => {
    const currentSlider = event.currentTarget;
    const currentX = event.touches[0].clientX;
    const lectureContainer = currentSlider.parentElement;
    let moveDist = parseInt(lectureContainer.getAttribute('data-move'));
    const previousX = parseInt(currentSlider.getAttribute('data-touch-X'));
    const xDist = currentX - previousX;

    moveDist += xDist;
    currentSlider.style.transform = 'translateX(' + String(`${moveDist}`) + 'px)';
    lectureContainer.setAttribute('data-move', `${moveDist}`);
    currentSlider.setAttribute('data-touch-X', `${currentX}`);
}

const endTouchOnSlider = (event) => {
    const currentSlider = event.currentTarget;
    currentSlider.removeEventListener('touchmove', moveTouchOnSlider);
    currentSlider.removeEventListener('touchend', endTouchOnSlider);
    const cardContainerWidth = parseInt(window.getComputedStyle(currentSlider).width);
    const lectureContainer = currentSlider.parentElement;
    const nowSliderWidth = parseInt(window.getComputedStyle(lectureContainer).width);
    let moveDist = parseInt(lectureContainer.getAttribute('data-move'));

    if (cardContainerWidth + moveDist < nowSliderWidth) {
        moveDist += nowSliderWidth - (cardContainerWidth + moveDist);
    }
    if (moveDist > 0) {
        moveDist = 0;
    }
    
    currentSlider.style.transform = 'translateX(' + String(`${moveDist}`) + 'px)';
    lectureContainer.setAttribute('data-move', `${moveDist}`);
    currentSlider.removeAttribute('data-touch-X');
}



// 슬라이더 끝 위치에서 화면 키우면 공백 생기지 않게 방지
const setSliderEnd = (event) => {
    const cardContainer = document.getElementsByClassName('card-container')[0];
    const rightButton = cardContainer.previousElementSibling.children[1].children[1];
    const moveDist = parseInt(cardContainer.parentElement.getAttribute('data-move'));
    const lastWidth = parseInt(rightButton.getAttribute('data-last-width'));
    const lectureContainer = cardContainer.parentElement;
    const nowSliderWidth = parseInt(window.getComputedStyle(lectureContainer).width);
    const distance = moveDist + (nowSliderWidth - lastWidth);

    if (lastWidth) {
        rightButton.classList.remove('button-on');
        cardContainer.style.transition = 'transform 0s';
        cardContainer.style.transform = 'translateX(' + String(distance) + 'px)';
    }
}



// 강의 설명 문구 움직이는 기능
const flowText = (event) => {
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

window.addEventListener('scroll', checkScroll);
upward.addEventListener('click', moveBackToTop);
window.addEventListener('resize', changeButton);
window.addEventListener('resize', setSliderEnd);
cardContainer.forEach((slider) => {
    slider.addEventListener('touchstart', startTouchOnSlider);
})