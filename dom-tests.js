// ============================================================================
// Автоматические тесты для Практической работы №11 (DOM манипуляции)
// Включают проверку основного функционала, изоляцию состояния и краевые случаи
// ============================================================================

(function () {
  class TestRunner {
    constructor() {
      this.suites = [];
      this.results = [];
    }

    describe(suiteName, fn) {
      this.suites.push({ suiteName, tests: [] });
      fn((testName, testFn) => {
        this.suites[this.suites.length - 1].tests.push({ testName, testFn });
      });
    }

    assertEqual(actual, expected, message = '') {
      if (actual !== expected) {
        throw new Error(
          `${message ? message + ' — ' : ''}Ожидалось: ${JSON.stringify(expected)}, получено: ${JSON.stringify(actual)}`
        );
      }
    }

    assertTruthy(value, message = '') {
      if (!value) {
        throw new Error(`${message || 'Ожидалось истинное значение'}, получено: ${JSON.stringify(value)}`);
      }
    }

    assertFalsy(value, message = '') {
      if (value) {
        throw new Error(`${message || 'Ожидалось ложное значение'}, получено: ${JSON.stringify(value)}`);
      }
    }

    assertNull(value, message = '') {
      if (value !== null) {
        throw new Error(`${message ? message + ' — ' : ''}Ожидалось null, получено: ${JSON.stringify(value)}`);
      }
    }

    assertNotNull(value, message = '') {
      if (value === null || value === undefined) {
        throw new Error(`${message ? message + ' — ' : ''}Ожидалось непустое значение, получено: ${value}`);
      }
    }

    assertIncludes(haystack, needle, message = '') {
      if (typeof haystack !== 'string' || !haystack.includes(needle)) {
        throw new Error(
          `${message ? message + ' — ' : ''}Строка "${haystack}" не содержит "${needle}"`
        );
      }
    }

    runAll() {
      this.results = [];
      console.group('%c[DOM Tests] Запуск набора тестов ПР №11', 'color: #7c6af7; font-weight: bold;');

      for (const suite of this.suites) {
        console.group(`%c${suite.suiteName}`, 'color: #a5b4fc; font-weight: bold;');
        for (const { testName, testFn } of suite.tests) {
          try {
            testFn();
            this.results.push({ suite: suite.suiteName, name: testName, passed: true });
            console.log(`%c✓ PASS:%c ${testName}`, 'color: #22c55e; font-weight: bold;', 'color: inherit;');
          } catch (error) {
            this.results.push({
              suite: suite.suiteName,
              name: testName,
              passed: false,
              error: error.message
            });
            console.error(`✗ FAIL: ${testName}\n  Причина: ${error.message}`);
          }
        }
        console.groupEnd();
      }

      const passedCount = this.results.filter((r) => r.passed).length;
      const failedCount = this.results.length - passedCount;
      console.log(
        `%cИтог: ${passedCount}/${this.results.length} пройдено${failedCount ? `, ошибок: ${failedCount}` : ' (все успешно!)'}`,
        `color: ${failedCount ? '#e55039' : '#22c55e'}; font-weight: bold;`
      );
      console.groupEnd();

      this.renderResults(passedCount, failedCount);
    }

    renderResults(passedCount, failedCount) {
      const summaryEl = document.getElementById('test-summary');
      const containerEl = document.getElementById('test-results');

      if (summaryEl) {
        const statusText = failedCount === 0 ? 'ВСЕ ТЕСТЫ ПРОЙДЕНЫ' : `ОБНАРУЖЕНЫ ОШИБКИ (${failedCount})`;
        summaryEl.textContent = `Статус: ${statusText} | Всего: ${this.results.length} | Успешно: ${passedCount} | Провалено: ${failedCount}`;
        summaryEl.style.borderLeftColor = failedCount === 0 ? '#22c55e' : '#e55039';
      }

      if (!containerEl) return;
      containerEl.replaceChildren();

      const fragment = document.createDocumentFragment();
      for (const res of this.results) {
        const item = document.createElement('div');
        item.className = `test-result ${res.passed ? 'test-success' : 'test-failure'}`;

        const suiteSpan = document.createElement('span');
        suiteSpan.className = 'test-suite-label';
        suiteSpan.textContent = res.suite;

        const body = document.createElement('div');
        body.textContent = `${res.passed ? '✓' : '✗'} ${res.name}${res.passed ? '' : ` — ${res.error}`}`;

        item.append(suiteSpan, body);
        fragment.appendChild(item);
      }

      containerEl.appendChild(fragment);
    }
  }

  function buildAndRunTests() {
    const runner = new TestRunner();

    // ------------------------------------------------------------------------
    // Сьюта 1: Создание и вставка элементов
    // ------------------------------------------------------------------------
    runner.describe('Задание 1: createCard и createList', (test) => {
      test('createCard создает div.card с h4 и p внутри #target1', () => {
        const target = document.getElementById('target1');
        const beforeCount = target.children.length;

        const card = createCard('Тестовый заголовок', 'Тестовое описание');
        try {
          runner.assertNotNull(card, 'Функция должна вернуть созданную карточку');
          runner.assertEqual(target.children.length, beforeCount + 1);
          runner.assertTruthy(card.classList.contains('card'), 'Класс card отсутствует');
          runner.assertEqual(card.querySelector('h4').textContent, 'Тестовый заголовок');
          runner.assertEqual(card.querySelector('p').textContent, 'Тестовое описание');
        } finally {
          if (card) card.remove();
        }
      });

      test('createCard безопасно экранирует HTML (защита от XSS) и пустые значения', () => {
        const xss = '<img src=x onerror=alert(1)>';
        const card = createCard(xss, '');
        try {
          runner.assertEqual(card.querySelector('img'), null, 'HTML не должен парситься как тег');
          runner.assertEqual(card.querySelector('h4').textContent, xss);
          runner.assertEqual(card.querySelector('p').textContent, '');
        } finally {
          if (card) card.remove();
        }
      });

      test('createList создает ol с нужным числом li', () => {
        const list = createList(['Альфа', 'Бета', 'Гамма']);
        try {
          runner.assertNotNull(list);
          runner.assertEqual(list.tagName, 'OL');
          runner.assertEqual(list.children.length, 3);
          runner.assertEqual(list.children[1].textContent, 'Бета');
        } finally {
          if (list) list.remove();
        }
      });

      test('createList корректно обрабатывает пустой массив и некорректный ввод', () => {
        const emptyList = createList([]);
        try {
          runner.assertNotNull(emptyList);
          runner.assertEqual(emptyList.children.length, 0);
        } finally {
          if (emptyList) emptyList.remove();
        }

        runner.assertNull(createList(null), 'Для null функция должна вернуть null');
        runner.assertNull(createList('не массив'), 'Для строки функция должна вернуть null');
      });
    });

    // ------------------------------------------------------------------------
    // Сьюта 2: Навигация по DOM
    // ------------------------------------------------------------------------
    runner.describe('Задание 2: Навигация по DOM', (test) => {
      test('countChildren возвращает актуальное количество дочерних элементов', () => {
        const parent = document.getElementById('parent-element');
        const initial = countChildren();
        runner.assertEqual(initial, 3, 'Изначально должно быть 3 дочерних элемента');

        const tempChild = document.createElement('div');
        tempChild.className = 'child';
        parent.appendChild(tempChild);
        try {
          runner.assertEqual(countChildren(), 4, 'После добавления элемента счетчик должен стать 4');
        } finally {
          tempChild.remove();
        }
      });

      test('findSpecialChild находит текст элемента .special и возвращает null при его отсутствии', () => {
        runner.assertEqual(findSpecialChild(), 'Особый дочерний элемент');

        const special = document.querySelector('#parent-element .special');
        special.classList.remove('special');
        try {
          runner.assertNull(findSpecialChild(), 'Без класса .special функция должна возвращать null');
        } finally {
          special.classList.add('special');
        }
      });

      test('getParentBackground возвращает корректный вычисленный цвет фона родителя', () => {
        const bg = getParentBackground();
        runner.assertNotNull(bg);
        runner.assertTruthy(
          bg.startsWith('rgb'),
          `Ожидался формат rgb/rgba, получено: ${bg}`
        );
      });
    });

    // ------------------------------------------------------------------------
    // Сьюта 3: Классы и стили
    // ------------------------------------------------------------------------
    runner.describe('Задание 3: Классы, цвет шапки и анимация', (test) => {
      test('setupStyleToggle переключает класс active-style при кликах на кнопку', () => {
        const target = document.getElementById('style-target');
        const btn = document.getElementById('toggle-style');
        const hadClass = target.classList.contains('active-style');

        try {
          btn.click();
          runner.assertEqual(target.classList.contains('active-style'), !hadClass);
          btn.click();
          runner.assertEqual(target.classList.contains('active-style'), hadClass);
        } finally {
          target.classList.toggle('active-style', hadClass);
        }
      });

      test('changeHeaderColor устанавливает случайный цвет фона для header', () => {
        const header = document.querySelector('header');
        const prevBg = header.style.background;
        const prevBgColor = header.style.backgroundColor;

        try {
          const color1 = changeHeaderColor();
          const color2 = changeHeaderColor();
          runner.assertNotNull(color1);
          runner.assertTruthy(color1.startsWith('rgb('), 'Цвет должен быть в формате rgb(...)');
          runner.assertTruthy(header.style.backgroundColor.length > 0, 'Фон шапки не установлен');
          runner.assertNotNull(color2);
        } finally {
          header.style.background = prevBg;
          header.style.backgroundColor = prevBgColor;
        }
      });

      test('animateElement применяет transform и opacity к #style-target', () => {
        const target = document.getElementById('style-target');
        const result = animateElement();
        runner.assertTruthy(result);
        runner.assertTruthy(target.style.transform.includes('scale'), 'Должен применяться scale');
        runner.assertEqual(target.style.opacity, '0.45');

        target.style.transform = '';
        target.style.opacity = '';
      });
    });

    // ------------------------------------------------------------------------
    // Сьюта 4: Обработка событий
    // ------------------------------------------------------------------------
    runner.describe('Задание 4: Обработка событий', (test) => {
      test('setupClickCounter увеличивает счетчик кликов в #click-counter (изолированно)', () => {
        const origBtn = document.getElementById('click-btn');
        const origCounter = document.getElementById('click-counter');

        // Временно изолируем оригинальные элементы, чтобы не сбивать счетчик пользователя
        origBtn.id = 'click-btn-saved';
        origCounter.id = 'click-counter-saved';

        const tempBtn = document.createElement('button');
        tempBtn.id = 'click-btn';
        const tempCounter = document.createElement('div');
        tempCounter.id = 'click-counter';
        tempCounter.textContent = 'Кликов: 0';
        document.body.append(tempBtn, tempCounter);

        try {
          setupClickCounter();
          // Повторный вызов не должен дублировать обработчик
          setupClickCounter();

          tempBtn.click();
          runner.assertEqual(tempCounter.textContent, 'Кликов: 1');
          tempBtn.click();
          runner.assertEqual(tempCounter.textContent, 'Кликов: 2');
          tempBtn.click();
          runner.assertEqual(tempCounter.textContent, 'Кликов: 3');
        } finally {
          tempBtn.remove();
          tempCounter.remove();
          origBtn.id = 'click-btn';
          origCounter.id = 'click-counter';
        }
      });

      test('setupInputDisplay синхронизирует ввод и очистку текста в реальном времени', () => {
        const input = document.getElementById('text-input');
        const display = document.getElementById('input-display');
        const prevValue = input.value;
        const prevDisplay = display.textContent;

        try {
          input.value = 'Привет, DOM!';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          runner.assertEqual(display.textContent, 'Привет, DOM!');

          // Краевой случай: очистка поля
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          runner.assertEqual(display.textContent, '');
        } finally {
          input.value = prevValue;
          display.textContent = prevDisplay;
        }
      });

      test('setupKeyboardEvents логирует keydown и keyup с кодом и символом клавиши', () => {
        const logs = [];
        const originalLog = console.log;
        const kbDisplay = document.getElementById('keyboard-display');
        const prevKbText = kbDisplay ? kbDisplay.textContent : '';

        console.log = (...args) => logs.push(args.join(' '));
        try {
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'A', code: 'KeyA', shiftKey: true }));
          document.dispatchEvent(new KeyboardEvent('keyup', { key: 'A', code: 'KeyA', shiftKey: true }));
        } finally {
          console.log = originalLog;
          if (kbDisplay) kbDisplay.textContent = prevKbText;
        }

        runner.assertTruthy(
          logs.some((line) => line.includes('keydown') && line.includes('KeyA')),
          'Событие keydown не залогировано'
        );
        runner.assertTruthy(
          logs.some((line) => line.includes('keyup') && line.includes('KeyA')),
          'Событие keyup не залогировано'
        );
      });
    });

    // ------------------------------------------------------------------------
    // Сьюта 5: Динамические списки и делегирование
    // ------------------------------------------------------------------------
    runner.describe('Задание 5: Динамические списки и делегирование', (test) => {
      test('addListItem добавляет элемент, кнопку удаления и очищает input', () => {
        const input = document.getElementById('item-input');
        const list = document.getElementById('dynamic-list');
        const snapshot = list.innerHTML;

        try {
          clearList();
          input.value = 'Купить кофе';
          const li = addListItem();

          runner.assertNotNull(li);
          runner.assertEqual(list.children.length, 1);
          runner.assertTruthy(li.classList.contains('list-item'));
          runner.assertIncludes(li.textContent, 'Купить кофе');
          runner.assertNotNull(li.querySelector('button.delete-btn'));
          runner.assertEqual(input.value, '', 'Поле ввода должно очиститься');
        } finally {
          list.innerHTML = snapshot;
          input.value = '';
        }
      });

      test('Краевой случай: пустая строка и пробелы не добавляются в список', () => {
        const input = document.getElementById('item-input');
        const list = document.getElementById('dynamic-list');
        const countBefore = list.children.length;

        input.value = '';
        runner.assertNull(addListItem());
        input.value = '     ';
        runner.assertNull(addListItem());
        runner.assertEqual(list.children.length, countBefore);
        input.value = '';
      });

      test('Делегирование событий: клик по кнопке удаляет li, клик по тексту не удаляет', () => {
        const input = document.getElementById('item-input');
        const list = document.getElementById('dynamic-list');
        const snapshot = list.innerHTML;

        try {
          clearList();
          input.value = 'Элемент 1';
          const li1 = addListItem();
          input.value = 'Элемент 2';
          const li2 = addListItem();

          // Клик по span внутри элемента не должен удалять li
          li1.querySelector('span').click();
          runner.assertEqual(list.children.length, 2, 'Клик не по кнопке не должен удалять элемент');

          // Клик по кнопке удаления должен удалить только li1
          li1.querySelector('button.delete-btn').click();
          runner.assertEqual(list.children.length, 1);
          runner.assertEqual(list.children[0], li2);

          // Очистка всего списка
          clearList();
          runner.assertEqual(list.children.length, 0);
        } finally {
          list.innerHTML = snapshot;
          input.value = '';
        }
      });
    });

    // ------------------------------------------------------------------------
    // Сьюта 6: Валидация и отправка формы
    // ------------------------------------------------------------------------
    runner.describe('Задание 6: Валидация и обработка формы', (test) => {
      test('validateForm пропускает корректные и граничные значения (возвращает null)', () => {
        runner.assertNull(validateForm({ name: 'Анна', email: 'anna@mail.ru', age: 25 }));
        runner.assertNull(validateForm({ name: 'Ян', email: 'a@b.co', age: '1' }), 'Граничный возраст 1 и имя из 2 букв');
        runner.assertNull(validateForm({ name: '  Иван  ', email: ' test@domain.org ', age: 120 }), 'Граничный возраст 120 и пробелы по краям');
      });

      test('validateForm отлавливает все краевые ошибки имени, email и возраста', () => {
        const errShortName = validateForm({ name: 'А', email: 'ok@test.ru', age: 20 });
        runner.assertNotNull(errShortName.name, 'Имя из 1 символа не должно проходить');

        const errSpacesName = validateForm({ name: '   ', email: 'ok@test.ru', age: 20 });
        runner.assertNotNull(errSpacesName.name, 'Имя из пробелов не должно проходить');

        const errBadEmail = validateForm({ name: 'Иван', email: 'invalid-email@', age: 20 });
        runner.assertNotNull(errBadEmail.email, 'Некорректный email не должен проходить');

        const errZeroAge = validateForm({ name: 'Иван', email: 'ok@test.ru', age: 0 });
        runner.assertNotNull(errZeroAge.age, 'Возраст 0 не должен проходить');

        const errOverAge = validateForm({ name: 'Иван', email: 'ok@test.ru', age: 121 });
        runner.assertNotNull(errOverAge.age, 'Возраст 121 не должен проходить');

        const errFloatAge = validateForm({ name: 'Иван', email: 'ok@test.ru', age: 25.5 });
        runner.assertNotNull(errFloatAge.age, 'Дробный возраст не должен проходить');

        const errNaNAge = validateForm({ name: 'Иван', email: 'ok@test.ru', age: 'abc' });
        runner.assertNotNull(errNaNAge.age, 'Нечисловой возраст не должен проходить');

        const errAllNull = validateForm(null);
        runner.assertNotNull(errAllNull.name);
        runner.assertNotNull(errAllNull.email);
        runner.assertNotNull(errAllNull.age);
      });

      test('handleFormSubmit отображает ошибки и успех с переключением CSS-классов', () => {
        const form = document.getElementById('user-form');
        const nameInput = document.getElementById('user-name');
        const emailInput = document.getElementById('user-email');
        const ageInput = document.getElementById('user-age');
        const output = document.getElementById('form-output');

        const prevOutputHTML = output.innerHTML;
        const prevOutputClass = output.className;

        try {
          // 1. Отправка невалидной формы
          nameInput.value = 'A';
          emailInput.value = 'bad';
          ageInput.value = '999';
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

          runner.assertTruthy(output.classList.contains('error-message'), 'Должен добавиться класс error-message');
          runner.assertFalsy(output.classList.contains('success-message'));
          runner.assertEqual(output.querySelectorAll('li').length, 3, 'Должно отобразиться 3 ошибки');

          // 2. Отправка валидной формы (включая проверку защиты от XSS)
          nameInput.value = '<b>Мария</b>';
          emailInput.value = 'maria@example.com';
          ageInput.value = '28';
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

          runner.assertTruthy(output.classList.contains('success-message'), 'Должен добавиться класс success-message');
          runner.assertFalsy(output.classList.contains('error-message'), 'Класс error-message должен удалиться');
          runner.assertNull(output.querySelector('b'), 'HTML в имени не должен исполняться');
          runner.assertIncludes(output.textContent, '<b>Мария</b>');
          runner.assertIncludes(output.textContent, 'maria@example.com');
        } finally {
          nameInput.value = '';
          emailInput.value = '';
          ageInput.value = '';
          output.innerHTML = prevOutputHTML;
          output.className = prevOutputClass;
        }
      });
    });

    runner.runAll();
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Запускаем после initializeApp(), чтобы все обработчики уже были привязаны
    setTimeout(buildAndRunTests, 0);

    const rerunBtn = document.getElementById('rerun-tests');
    if (rerunBtn) {
      rerunBtn.addEventListener('click', buildAndRunTests);
    }
  });
})();
