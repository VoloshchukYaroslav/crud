// Функція для отримання всіх студентів
function getStudents() {
  return fetch("http://localhost:3000/students").then((res) => res.json());
}

// Функція для відображення студентів у таблиці
const tableListRef = document.querySelector(".list");
const takeBtnRef = document.querySelector("#get-students-btn");
const formRef = document.querySelector("#add-student-form");

let curentId = null;

tableListRef.addEventListener("click", (e) => {
  if (e.target.nodeName !== "BUTTON") {
    return;
  }
  const tr = e.target.closest("tr");
  const id = tr.id;
  const action = e.target.dataset.action;
  switch (action) {
    case "delet":
      deleteStudent(id)
        .then(getStudents)
        .then((res) => renderStudents(res));
      break;
    case "edit":
      curentId = id;
      formRef.elements.name.value = tr.children[1].textContent;
      formRef.elements.age.value = tr.children[2].textContent;
      formRef.elements.course.value = tr.children[3].textContent;
      formRef.elements.skills.value = tr.children[4].textContent;
      formRef.elements.email.value = tr.children[5].textContent;
      formRef.elements.isEnrolled.checked = tr.children[6];
      break;
    default:
      return;
  }
});
formRef.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.currentTarget.elements.name.value;
  const age = e.currentTarget.elements.age.value;
  const course = e.currentTarget.elements.course.value;
  const skills = e.currentTarget.elements.skills.value;
  const email = e.currentTarget.elements.email.value;
  const isEnrolled = e.currentTarget.elements.isEnrolled.checked;
  const studentsData = { name, age, course, skills, email, isEnrolled };
  if (curentId === null) {
    addStudent(studentsData)
      .then(getStudents)
      .then((res) => {
        renderStudents(res);
        formRef.reset();
      });
    return;
  }
  updateStudent(curentId, studentsData)
    .then(getStudents)
    .then((res) => renderStudents(res));
  formRef.reset();
});

takeBtnRef.addEventListener("click", () => {
  getStudents().then((res) => renderStudents(res));
});

function renderStudents(students) {
  const item = students
    .map(({ id, name, age, course, skills, email, isEnrolled }) => {
      return `<tr id="${id}">
            <td>${id}</td>
            <td>${name}</td>
            <td>${age}</td>
            <td>${course}</td>
            <td>${skills}</td>
            <td>${email}</td>
            <td>${isEnrolled}</td>
            <td>
                <button data-action="edit" type="button">Редагувати</button>
                <button data-action="delet" type="button">Видалити</button>
            </td>
          </tr>`;
    })
    .join("");
  //   tableListRef.insertAdjacentHTML("beforeend", item);
  tableListRef.innerHTML = item;
}

// Функція для додавання нового студента
function addStudent(e) {
  const options = {
    method: "POST",
    body: JSON.stringify(e),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };
  return fetch("http://localhost:3000/students", options).then((res) =>
    res.json(),
  );
}

// Функція для оновлення студента
function updateStudent(id, e) {
  const options = {
    method: "PUT",
    body: JSON.stringify(e),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };
  return fetch(`http://localhost:3000/students/${id}`, options).then((res) =>
    res.json(),
  );
}

// Функція для видалення студента
function deleteStudent(id) {
  const options = {
    method: "DELETE",
  };
  return fetch(`http://localhost:3000/students/${id}`, options).then((res) =>
    res.json(),
  );
}
