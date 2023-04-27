//

const subTitle = document.querySelector(".subtitle");
const questions = document.getElementsByClassName("question");
const content = document.querySelector(".content");
const controls = document.querySelector(".controls");
const backBtn = document.querySelector(".btn-back");
const nextBtn = document.querySelector(".btn-next");
const submitBtn = document.querySelector(".submit");
const results = document.querySelector(".results");
const circle = document.querySelector("circle");
const errMsg = document.querySelector(".errmsg");
const number = document.getElementById("number");
const dashArray = parseInt(window.getComputedStyle(circle).strokeDasharray, 10);

const quiz = [
  {
    prompt: "Which of the following is not a real eCommerce platform?",
    choices: [
      { opt: "Shopify", value: "Shopify", key: 1 },
      { opt: "WooCommerce", value: "WooCommerce", key: 1 },
      { opt: "ShopCommerce", value: "ShopCommerce", key: 0 },
      { opt: "BigCommerce", value: "BigCommerce", key: 1 },
    ],
    item: "question1",
    id: "qz",
  },
  {
    prompt: "If Shopify is so good, why are Shopify developers necessary?",
    choices: [
      { opt: "To save time on things like store setups and migrations", value: "migrations", key: 1 },
      { opt: "To extend the limited design options and functionalities of themes with custom code", value: "custom", key: 1 },
      { opt: "To provide support with a deep understanding of how the platform works and what its limitations are", value: "limitations", key: 1 },
      { opt: "All the above", value: "all", key: 0 },
    ],
    item: "question2",
    id: "qz",
  },
  {
    prompt: "Which of the following is true about Shopify developers?",
    choices: [
      { opt: "They are paid extremely well", value: "paid", key: 1 },
      { opt: "There is a high demand for them", value: "demand", key: 1 },
      { opt: "They need to know web development, the platform itself, and the liquid template language", value: "liquid", key: 1 },
      { opt: "All the above", value: "all", key: 0 },
    ],
    item: "question3",
    id: "qz",
  },
];

let radioId = 0;

function setQuiz(quizObj) {
  const section = document.createElement("section");
  const h2 = document.createElement("h2");
  h2.classList.add("title");
  h2.textContent = quizObj.prompt;
  section.classList.add("question");
  section.appendChild(h2);
  for (let i = 0; i < quizObj.choices.length; i++) {
    const qDiv = document.createElement("div");
    const radio = document.createElement("input");
    const label = document.createElement("label");
    const p = document.createElement("p");
    radio.type = "radio";
    radio.id = `${quizObj.id}${radioId}`;
    radio.name = quizObj.item;
    radio.value = quizObj.choices[i].value;
    p.textContent = quizObj.choices[i].opt;
    qDiv.appendChild(label);
    label.appendChild(radio);
    label.appendChild(p);
    section.appendChild(qDiv);
    radioId++;
  }
  content.insertBefore(section, controls);
}

function showPCT(percent) {
  let counter = 0;
  let change = dashArray - dashArray * percent;
  document.documentElement.style.setProperty("--change", change);

  let stop = setInterval(() => {
    if (counter == percent * 100) {
      clearInterval(stop);
    } else {
      counter += 1;
      number.innerHTML = `${counter}%`;
    }
  }, 30);
}

function showResults(quizObj, answers) {
  let score = 0;

  for (const [index, qo] of quizObj.entries()) {
    const h2 = document.createElement("h2");
    h2.classList.add("title");
    h2.textContent = qo.prompt;
    results.appendChild(h2);
    for (let cho of qo.choices) {
      const p = document.createElement("p");
      p.textContent = cho.opt;
      results.appendChild(p);
      if (!cho.key) {
        p.classList.add("answer");
        score += cho.value === answers[index] ? 1 : 0;
      } else if (cho.value === answers[index]) {
        p.classList.add("incorrect");
      }
    }
  }
  subTitle.textContent = `Results: You got ${score} out of ${quizObj.length} correct`;
  if (score === 0) number.innerHTML = `${score}%`;
  showPCT((score / quizObj.length).toFixed(2));
}

function getActive(el) {
  return Array.prototype.slice.call(el).findIndex((o) => o.className.split(" ").find((o) => o.includes("show-active")));
}

function validateQuestions() {
  return document.querySelectorAll(".question.show-active input[type='radio']:checked").length > 0 ? 1 : 0;
}

function setActive(current, next) {
  current.classList.remove("show-active");
  next.classList.add("show-active");
}

function showActive(b) {
  b.classList.add("show-active");
}

function removeActive(b) {
  b.classList.remove("show-active");
}

document.querySelector(".btn-next").addEventListener("click", (evt) => {
  let current = getActive(questions);
  next = current === 2 ? 2 : current + 1;

  if (!validateQuestions()) {
    errMsg.textContent = "Please answer the question to the best of your abilities";
    return;
  }
  errMsg.textContent = "";
  setActive(questions[current], questions[next]);
  subTitle.textContent = `Question ${next + 1} of ${questions.length}`;
  if (next > 0) showActive(backBtn);
  if (next === 2) {
    showActive(submitBtn);
    removeActive(nextBtn);
  }
});

document.querySelector(".btn-back").addEventListener("click", (evt) => {
  let current = getActive(questions);

  errMsg.textContent = "";
  back = current === 0 ? 0 : current - 1;
  setActive(questions[current], questions[back]);
  subTitle.textContent = `Question ${back + 1} of ${questions.length}`;
  if (back === 0) removeActive(backBtn);
  if (back === 1) {
    removeActive(submitBtn);
    showActive(nextBtn);
  }
});

submitBtn.addEventListener("click", () => {
  let choices = document.querySelectorAll("input[type='radio']");
  let answers = [];

  if (!validateQuestions()) {
    errMsg.textContent = "Please answer the question to the best of your abilities";
    return;
  }
  errMsg.textContent = "";
  for (choice of choices) {
    if (choice.checked) answers.push(choice.value);
  }
  setActive(questions[questions.length - 1], results);
  removeActive(backBtn);
  removeActive(nextBtn);
  removeActive(submitBtn);
  showResults(quiz, answers);
});

(function init() {
  for (let q of quiz) setQuiz(q);
  subTitle.textContent = `Question 1 of ${questions.length}`;
  showActive(questions[0]);
})();
