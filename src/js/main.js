import person from './components/person' 

const headerEle = document.querySelector('.header');

if(headerEle) {
    const titleEle = headerEle.querySelector('.header__title');
    const spanEle = document.createElement('span');
    const yperson = person();

    spanEle.setAttribute('class', 'header__person');
    spanEle.textContent = yperson.name;

    titleEle.appendChild(spanEle);

    const myArr = [1,2,3,4,5,6];

    const myNewArr = myArr.map(item => item * 2);

    console.log(myNewArr)
};
