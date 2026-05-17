async function getStudents() {
  try {
    const res = await fetch("http://localhost:3000/students");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    if (!data) {
      throw new Error("No data received");
    }
    return data;
  } catch (error) {
    console.error("getStudents error:", error);
    return null;
  }
}

async function addStudent(studentData) {
  const options = {
    method: "POST",
    body: JSON.stringify(studentData),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };
  try {
    const res = await fetch("http://localhost:3000/students", options);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("addStudent error:", error);
    return null;
  }
}

async function updateStudent(id, studentData) {
  const options = {
    method: "PUT",
    body: JSON.stringify(studentData),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };
  try {
    const res = await fetch(`http://localhost:3000/students/${id}`, options);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("updateStudent error:", error);
    return null;
  }
}

async function deleteStudent(id) {
  const options = {
    method: "DELETE",
  };
  try {
    const res = await fetch(`http://localhost:3000/students/${id}`, options);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return data;
  } catch (error) {
    console.error("deleteStudent error:", error);
    return null;
  }
}

const tableListRef = document.querySelector(".list");
const takeBtnRef = document.querySelector("#get-students-btn");
const formRef = document.querySelector("#add-student-form");

let currentId = null;

tableListRef.addEventListener("click", async (e) => {
  if (e.target.nodeName !== "BUTTON") {
    return;
  }
  const tr = e.target.closest("tr");
  if (!tr) return;
  const id = tr.id;
  const action = e.target.dataset.action;

  switch (action) {
    case "delet":
      await deleteStudent(id);
      const resAfterDelete = await getStudents();
      renderStudents(resAfterDelete);
      break;
    case "edit":
      currentId = id;
      formRef.elements.name.value = tr.children[1].textContent;
      formRef.elements.age.value = tr.children[2].textContent;
      formRef.elements.course.value = tr.children[3].textContent;
      formRef.elements.skills.value = tr.children[4].textContent;
      formRef.elements.email.value = tr.children[5].textContent;
      formRef.elements.isEnrolled.checked =
        tr.children[6].textContent === "true";
      break;
    default:
      return;
  }
});

formRef.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = e.currentTarget.elements.name.value;
  const age = e.currentTarget.elements.age.value;
  const course = e.currentTarget.elements.course.value;
  const skills = e.currentTarget.elements.skills.value;
  const email = e.currentTarget.elements.email.value;
  const isEnrolled = e.currentTarget.elements.isEnrolled.checked;
  const studentsData = { name, age, course, skills, email, isEnrolled };

  if (currentId === null) {
    await addStudent(studentsData);
    const res = await getStudents();
    renderStudents(res);
    formRef.reset();
  } else {
    await updateStudent(currentId, studentsData);
    const res = await getStudents();
    renderStudents(res);
    formRef.reset();
    currentId = null;
  }
});

takeBtnRef.addEventListener("click", async () => {
  const res = await getStudents();
  renderStudents(res);
});

function renderStudents(students) {
  if (!students || !Array.isArray(students)) {
    tableListRef.innerHTML = "<tr><td colspan='8'>Немає даних</td><tr>";
    return;
  }
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
  tableListRef.innerHTML = item;
}
