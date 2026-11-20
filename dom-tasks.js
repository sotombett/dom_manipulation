// ============================================================================
// Практическая работа №11: «JavaScript: манипуляции DOM-деревом»
// ============================================================================

// ЗАДАНИЕ 1: Создание и вставка элементов

// 1.1. Создает карточку с заголовком и текстом и добавляет ее в #target1
function createCard(title, content) {
  const target = document.getElementById('target1');
  if (!target) return null;

  const card = document.createElement('div');
  card.classList.add('card');

  const heading = document.createElement('h4');
  heading.textContent = title !== undefined && title !== null ? String(title) : '';

  const paragraph = document.createElement('p');
  paragraph.textContent = content !== undefined && content !== null ? String(content) : '';

  card.append(heading, paragraph);
  target.appendChild(card);

  return card;
}

// 1.2. Создает нумерованный список из массива элементов и добавляет его в #target1
function createList(items) {
  const target = document.getElementById('target1');
  if (!target || !Array.isArray(items)) return null;

  const ol = document.createElement('ol');
  const fragment = document.createDocumentFragment();

  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = item !== undefined && item !== null ? String(item) : '';
    fragment.appendChild(li);
  }

  ol.appendChild(fragment);
  target.appendChild(ol);

  return ol;
}

// ЗАДАНИЕ 2: Навигация по DOM

// 2.1. Возвращает количество дочерних элементов у #parent-element
function countChildren() {
  const parent = document.getElementById('parent-element');
  if (!parent) return 0;
  return parent.children.length;
}

// 2.2. Находит элемент с классом "special" внутри #parent-element и возвращает его текст
function findSpecialChild() {
  const parent = document.getElementById('parent-element');
  if (!parent) return null;

  const specialChild = parent.querySelector('.special');
  return specialChild ? specialChild.textContent.trim() : null;
}

// 2.3. Возвращает цвет фона родительского элемента для .child элементов
function getParentBackground() {
  const child = document.querySelector('.child');
  if (!child || !child.parentElement) return null;

  return window.getComputedStyle(child.parentElement).backgroundColor;
}

// ЗАДАНИЕ 3: Работа с классами и стилями

// 3.1. Переключает класс "active-style" у #style-target
function toggleStyle() {
  const styleTarget = document.getElementById('style-target');
  if (!styleTarget) return false;
  return styleTarget.classList.toggle('active-style');
}

function setupStyleToggle() {
  const toggleBtn = document.getElementById('toggle-style');
  if (!toggleBtn || toggleBtn.dataset.bound === 'true') return;

  toggleBtn.addEventListener('click', toggleStyle);
  toggleBtn.dataset.bound = 'true';
}

// 3.2. Меняет цвет фона header на случайный цвет при вызове
function changeHeaderColor() {
  const header = document.querySelector('header');
  if (!header) return null;

  const randomChannel = () => Math.floor(Math.random() * 140) + 30;
  const r = randomChannel();
  const g = randomChannel();
  const b = randomChannel();
  const randomColor = `rgb(${r}, ${g}, ${b})`;

  header.style.background = randomColor;
  header.style.backgroundColor = randomColor;

  return randomColor;
}

// 3.3. Добавляет анимацию к #style-target (изменение размера и прозрачности)
let animationTimerId = null;

function animateElement() {
  const styleTarget = document.getElementById('style-target');
  if (!styleTarget) return false;

  if (animationTimerId !== null) {
    clearTimeout(animationTimerId);
    animationTimerId = null;
  }

  styleTarget.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
  styleTarget.style.transform = 'scale(1.06)';
  styleTarget.style.opacity = '0.45';

  animationTimerId = setTimeout(() => {
    styleTarget.style.transform = '';
    styleTarget.style.opacity = '';
    animationTimerId = null;
  }, 450);

  return true;
}

// ЗАДАНИЕ 4: Обработка событий

// 4.1. Подсчитывает клики на кнопке #click-btn и обновляет текст в #click-counter
function setupClickCounter() {
  const clickBtn = document.getElementById('click-btn');
  const counterEl = document.getElementById('click-counter');
  if (!clickBtn || !counterEl || clickBtn.dataset.bound === 'true') return;

  let count = 0;

  clickBtn.addEventListener('click', () => {
    count += 1;
    counterEl.textContent = `Кликов: ${count}`;
  });

  clickBtn.dataset.bound = 'true';
}

// 4.2. Отображает введенный текст из #text-input в #input-display в реальном времени
function setupInputDisplay() {
  const textInput = document.getElementById('text-input');
  const displayEl = document.getElementById('input-display');
  if (!textInput || !displayEl || textInput.dataset.bound === 'true') return;

  textInput.addEventListener('input', (event) => {
    displayEl.textContent = event.target.value;
  });

  textInput.dataset.bound = 'true';
}

// 4.3. Обрабатывает нажатия клавиш (keydown, keyup) на документе и выводит информацию о них
let keyboardEventsBound = false;

function setupKeyboardEvents() {
  if (keyboardEventsBound) return;

  const handleKeyEvent = (event) => {
    const info = `Тип: ${event.type} | key: "${event.key}" | code: "${event.code}" | Ctrl: ${event.ctrlKey} | Alt: ${event.altKey} | Shift: ${event.shiftKey}`;
    console.log(`[Keyboard] ${info}`);

    const display = document.getElementById('keyboard-display');
    if (display) {
      display.textContent = info;
    }
  };

  document.addEventListener('keydown', handleKeyEvent);
  document.addEventListener('keyup', handleKeyEvent);
  keyboardEventsBound = true;
}

// ЗАДАНИЕ 5: Динамические списки

// 5.1. Добавляет новый элемент в список #dynamic-list из значения #item-input
function addListItem() {
  const input = document.getElementById('item-input');
  const list = document.getElementById('dynamic-list');
  if (!input || !list) return null;

  const text = input.value.trim();
  if (!text) return null;

  const li = document.createElement('li');
  li.classList.add('list-item');

  const span = document.createElement('span');
  span.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = 'Удалить';

  li.append(span, deleteBtn);
  list.appendChild(li);

  input.value = '';
  return li;
}

// 5.2. Удаляет элемент списка при клике на кнопку удаления
function removeListItem(event) {
  if (!event || !event.target) return false;

  const deleteBtn = event.target.closest('button.delete-btn');
  if (!deleteBtn) return false;

  const listItem = deleteBtn.closest('li.list-item');
  if (!listItem) return false;

  listItem.remove();
  return true;
}

// 5.3. Очищает весь список #dynamic-list
function clearList() {
  const list = document.getElementById('dynamic-list');
  if (!list) return;
  list.replaceChildren();
}

// 5.4. Настраивает все обработчики для работы со списком (добавление, удаление, очистка)
function setupListEvents() {
  const addBtn = document.getElementById('add-item');
  const clearBtn = document.getElementById('clear-list');
  const list = document.getElementById('dynamic-list');
  const input = document.getElementById('item-input');

  if (addBtn && addBtn.dataset.bound !== 'true') {
    addBtn.addEventListener('click', addListItem);
    addBtn.dataset.bound = 'true';
  }

  if (clearBtn && clearBtn.dataset.bound !== 'true') {
    clearBtn.addEventListener('click', clearList);
    clearBtn.dataset.bound = 'true';
  }

  if (list && list.dataset.bound !== 'true') {
    // Делегирование событий для удаления динамически добавляемых элементов
    list.addEventListener('click', removeListItem);
    list.dataset.bound = 'true';
  }

  if (input && input.dataset.bound !== 'true') {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addListItem();
      }
    });
    input.dataset.bound = 'true';
  }
}

// ЗАДАНИЕ 6: Работа с формами

// 6.1. Проверяет данные формы #user-form и возвращает объект ошибок или null
function validateForm(formData) {
  const errors = {};
  const data = formData && typeof formData === 'object' ? formData : {};

  // Проверка имени: не пустое, минимум 2 символа
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (!name) {
    errors.name = 'Имя обязательно для заполнения.';
  } else if (name.length < 2) {
    errors.name = 'Имя должно содержать минимум 2 символа.';
  }

  // Проверка Email: соответствует базовому формату email
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'Email обязателен для заполнения.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Введите корректный адрес электронной почты.';
  }

  // Проверка возраста: целое число от 1 до 120
  const rawAge = data.age;
  const ageStr = rawAge !== undefined && rawAge !== null ? String(rawAge).trim() : '';
  if (ageStr === '') {
    errors.age = 'Возраст обязателен для заполнения.';
  } else {
    const ageNum = Number(ageStr);
    if (!Number.isFinite(ageNum) || !Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120) {
      errors.age = 'Возраст должен быть целым числом от 1 до 120.';
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

// 6.2. Отображает ошибки валидации в #form-output
function displayFormErrors(errors) {
  const output = document.getElementById('form-output');
  if (!output) return;

  output.replaceChildren();
  output.classList.remove('success-message');
  output.classList.add('error-message');

  const title = document.createElement('strong');
  title.textContent = 'Обнаружены ошибки валидации:';

  const ul = document.createElement('ul');
  const errorMessages = errors && typeof errors === 'object' ? Object.values(errors) : [];

  for (const message of errorMessages) {
    const li = document.createElement('li');
    li.textContent = String(message);
    ul.appendChild(li);
  }

  output.append(title, ul);
}

// 6.3. Отображает успешное сообщение с данными пользователя в #form-output
function displayFormSuccess(userData) {
  const output = document.getElementById('form-output');
  if (!output) return;

  output.replaceChildren();
  output.classList.remove('error-message');
  output.classList.add('success-message');

  const title = document.createElement('strong');
  title.textContent = 'Форма успешно отправлена!';

  const details = document.createElement('div');
  details.style.marginTop = '0.45rem';

  const nameLine = document.createElement('p');
  nameLine.textContent = `Имя: ${userData.name}`;

  const emailLine = document.createElement('p');
  emailLine.textContent = `Email: ${userData.email}`;

  const ageLine = document.createElement('p');
  ageLine.textContent = `Возраст: ${userData.age}`;

  details.append(nameLine, emailLine, ageLine);
  output.append(title, details);
}

// 6.4. Обрабатывает отправку формы
function handleFormSubmit(event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const ageInput = document.getElementById('user-age');

  const formData = {
    name: nameInput ? nameInput.value : '',
    email: emailInput ? emailInput.value : '',
    age: ageInput ? ageInput.value : ''
  };

  const errors = validateForm(formData);
  if (errors) {
    displayFormErrors(errors);
    return false;
  }

  displayFormSuccess({
    name: formData.name.trim(),
    email: formData.email.trim(),
    age: Number(String(formData.age).trim())
  });

  return true;
}

// 6.5. Настраивает обработчик submit для формы #user-form
function setupForm() {
  const form = document.getElementById('user-form');
  if (!form || form.dataset.bound === 'true') return;

  form.addEventListener('submit', handleFormSubmit);
  form.dataset.bound = 'true';
}

// Вспомогательная демонстрация результатов навигации (Задача 2) и кнопок Задачи 3
function renderNavigationDemo() {
  const navOutput = document.getElementById('nav-output');
  if (!navOutput) return;

  const count = countChildren();
  const special = findSpecialChild();
  const bg = getParentBackground();

  navOutput.textContent = `Дочерних элементов: ${count} | Особый: "${special}" | Фон родителя: ${bg}`;
}

function setupExtraDemoControls() {
  const animateBtn = document.getElementById('animate-btn');
  if (animateBtn && animateBtn.dataset.bound !== 'true') {
    animateBtn.addEventListener('click', animateElement);
    animateBtn.dataset.bound = 'true';
  }

  const headerColorBtn = document.getElementById('header-color-btn');
  if (headerColorBtn && headerColorBtn.dataset.bound !== 'true') {
    headerColorBtn.addEventListener('click', changeHeaderColor);
    headerColorBtn.dataset.bound = 'true';
  }
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ
// ============================================================================
function initializeApp() {
  setupStyleToggle();
  setupClickCounter();
  setupInputDisplay();
  setupKeyboardEvents();
  setupListEvents();
  setupForm();
  setupExtraDemoControls();

  // Демонстрация Задания 1
  createCard('Пример карточки', 'Это содержимое карточки');
  createList(['Первый элемент', 'Второй элемент', 'Третий элемент']);

  // Демонстрация Задания 2
  renderNavigationDemo();

  console.log('Приложение инициализировано!');
}

document.addEventListener('DOMContentLoaded', initializeApp);
