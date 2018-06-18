'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var setupDialog = document.querySelector('.setup');
var setupOpen = document.querySelector('.setup-open');
var setupClose = setupDialog.querySelector('.setup-close');
var userNameInput = setupDialog.querySelector('.setup-user-name');

var setupSimilar = document.querySelector('.setup-similar');
setupSimilar.classList.remove('hidden');

var wizardCoat = document.querySelector('.setup-wizard .wizard-coat');
var wizardEyesColor = document.querySelector('.setup-wizard .wizard-eyes');
var wizardFireballColor = document.querySelector('.setup-fireball-wrap');


var WIZARD_NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
var WIZARD_SURNAMES = ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'];
var COAT_COLORS = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
var EYE_COLORS = ['black', 'red', 'blue', 'yellow', 'green'];
var FIREBALL_COLOR = ['#ee4830', '#30a8ee', '#5ce6c0', '#e848d5', '#e6e848'];
var WIZARD_COUNT = 4;

// Окно.setup должно открываться по нажатию на блок.setup-open.
// Открытие окна производится удалением класса hidden у блока
// Окно.setup должно закрываться по нажатию на элемент.setup-close, расположенный внутри окна
// Если фокус находится на форме ввода имени, то окно закрываться не должно.

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE && evt.target !== userNameInput) { // насколько корректна такая запись?
    closePopup();
  }
};

var openPopup = function () {
  setupDialog.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function () {
  setupDialog.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

setupOpen.addEventListener('click', function () {
  openPopup();
});

setupOpen.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openPopup();
  }
});

setupClose.addEventListener('click', function () {
  closePopup();
});

setupClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
});
// Сделать диалог редактирования персонажа перетаскиваемым (draggable)

var dialogHandle = setupDialog.querySelector('.setup-user-pic');
var dialogHandler = setupDialog.querySelector('.upload');

dialogHandler.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };


  var dragged = false;


  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    setupDialog.style.top = (setupDialog.offsetTop - shift.y) + 'px';
    setupDialog.style.left = (setupDialog.offsetLeft - shift.x) + 'px';
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (dragged) {
      var onClickPreventDefault = function (evt) {
        evt.preventDefault();
        dialogHandler.removeEventListener('click', onClickPreventDefault)
      };
      dialogHandler.addEventListener('click', onClickPreventDefault);
    }
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

// Валидация ввода имени персонажа. Имя персонажа вводится в поле .setup-user-name. Добавьте следующие ограничения:
// имя персонажа не может содержать менее 2 символов
// максимальная длина имени персонажа — 25 символов
// Для указания ограничений на ввод используйте стандартные возможности форм HTML5


userNameInput.addEventListener('invalid', function () {
  if (userNameInput.validity.tooShort) {
    userNameInput.setCustomValidity('Имя должно состоять минимум из 2-х символов');
  } else if (userNameInput.validity.tooLong) {
    userNameInput.setCustomValidity('Имя не должно превышать 25-ти символов');
  } else if (userNameInput.validity.valueMissing) {
    userNameInput.setCustomValidity('Обязательное поле');
  } else {
    userNameInput.setCustomValidity('');
  }
});


var getRandomElem = function (arr) {

  var randomElem = Math.floor(Math.random() * arr.length);
  return arr[randomElem];
};

// Цвет мантии .setup-wizard .wizard-coat должен обновляться по нажатию на неё.
wizardCoat.addEventListener('click', function () {
  wizardCoat.style.fill = getRandomElem(COAT_COLORS);
});

// Цвет глаз волшебника меняется по нажатию на блок .setup-wizard .wizard-eyes

wizardEyesColor.addEventListener('click', function () {
  wizardEyesColor.style.fill = getRandomElem(EYE_COLORS);
});

// Изменение цвета фаерболов по нажатию. Цвет задаётся через изменение фона у блока .setup-fireball-wrap
wizardFireballColor.addEventListener('click', function () {
  wizardFireballColor.style.backgroundColor = getRandomElem(FIREBALL_COLOR);
});

var getRandomWizards = function (count) {
  var wizardsArray = [];
  for (var i = 0; i < count; i++) {
    wizardsArray.push({
      name: getRandomElem(WIZARD_NAMES) + ' ' + getRandomElem(WIZARD_SURNAMES),
      coatColor: getRandomElem(COAT_COLORS),
      eyesColor: getRandomElem(EYE_COLORS)
    });
  }
  return wizardsArray;
};

var wizards = getRandomWizards(WIZARD_COUNT);

var similarListElement = setupDialog.querySelector('.setup-similar-list');

var similarWizardTemplate = document.querySelector('#similar-wizard-template')
    .content
    .querySelector('.setup-similar-item');

var renderWizard = function (wizard) {
  var wizardElement = similarWizardTemplate.cloneNode(true);

  wizardElement.querySelector('.setup-similar-label').textContent = wizard.name;
  wizardElement.querySelector('.wizard-coat').style.fill = wizard.coatColor;
  wizardElement.querySelector('.wizard-eyes').style.fill = wizard.eyesColor;

  return wizardElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < wizards.length; i++) {
  fragment.appendChild(renderWizard(wizards[i]));
}
similarListElement.appendChild(fragment);

