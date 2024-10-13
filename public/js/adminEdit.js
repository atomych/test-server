const nameFields = document.querySelectorAll("input[data-type='name']");
const mailFields = document.querySelectorAll("input[data-type='mail']");
const imageFields = document.querySelectorAll("input[data-type='image']");
const userImages = document.querySelectorAll(".user-img");
const itemsLi = document.querySelectorAll(".item");
const saveBtn = document.querySelector("#save");

const addBtn = document.querySelector("#add");
const newNameField = document.querySelector("#newName");
const newMailField = document.querySelector("#newMail");
const newPhotoField = document.querySelector("#newPhoto");
const changedAppliedText = document.querySelector(".changes");

addBtn.addEventListener("click", () => {
  if (newNameField.value.length && newMailField.value.length) {
    const users = [];

    for (let i = 0; i < itemsLi.length; i++) {
      users.push({
        name: nameFields[i].value,
        mail: mailFields[i].value,
        id: itemsLi[i].dataset.id,
      });
    }

    const user = {
      name: newNameField.value,
      mail: newMailField.value,
      id: users.length + 1,
    };

    users.push(user);

    fetch("/api/admin-access/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tocken}`,
      },
      body: JSON.stringify({ users: users }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.type == "changes-applied") {
          changedAppliedText.style.display = "block";
          setTimeout(() => {
            changedAppliedText.style.display = "none";
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err.type);
      });

    if (newPhotoField.files.length) {
      const reader = new FileReader();
      const file = newPhotoField.files[0];
      const extension = file.type.split("/")[1];

      reader.onload = () => {
        fetch("/api/admin-access/images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tocken}`,
          },
          body: JSON.stringify({ id: users.length, dataURL: reader.result, ext: extension }),
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.type == "changes-applied") {
              changedAppliedText.style.display = "block";
              setTimeout(() => {
                changedAppliedText.style.display = "none";
                location.reload();
              }, 1000);
            }
          })
          .catch((err) => {
            console.log(err.type);
          });
      }

      reader.readAsDataURL(file);
    }
  }
})

saveBtn.addEventListener("click", () => {
  const users = [];

  for (let i = 0; i < itemsLi.length; i++) {
    users.push({
      name: nameFields[i].value,
      mail: mailFields[i].value,
      id: itemsLi[i].dataset.id,
    });

    if (imageFields[i].files.length) {
      const reader = new FileReader();
      const file = imageFields[i].files[0];
      const extension = file.type.split("/")[1];


      reader.onload = function() {
        fetch("/api/admin-access/images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tocken}`,
          },
          body: JSON.stringify({ id: i + 1, dataURL: reader.result, ext: extension }),
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.type == "changes-applied") {
              changedAppliedText.style.display = "block";
              setTimeout(() => {
                changedAppliedText.style.display = "none";
                location.reload();
              }, 1000);
            }
          })
          .catch((err) => {
            console.log(err.type);
          });
      };

      reader.readAsDataURL(file);
    }
  }

  fetch("/api/admin-access/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tocken}`,
    },
    body: JSON.stringify({ users: users }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.type == "changes-applied") {
        changedAppliedText.style.display = "block";
        setTimeout(() => {
          changedAppliedText.style.display = "none";
        }, 3000);
      }
    })
    .catch((err) => {
      console.log(err.type);
    });
});
