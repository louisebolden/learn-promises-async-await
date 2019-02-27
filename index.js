const timeout = ms => new Promise(resolve => window.setTimeout(resolve, ms));

// listen for clicks on the 'Get User Profile Info' button
document.getElementById("getUserProfile").onclick = () => {
  const userProfile = document.getElementById("userProfileData");
  const loader = document.getElementById("userDataLoader");

  const button = event.target;
  disableButtonWith(button, "Please wait...");

  fadeOut(userProfile, 150).then(() => { fadeIn(loader, 200) });

  dummyRequest("user").then(user => {
    userProfile.innerHTML = userHtml(user);

    fadeOut(loader, 150).then(() => { fadeIn(userProfile, 200) });

    undisableButtonWith(button, "Get User Profile");
  });
};

// listen for clicks on the 'Import CSV' button
document.getElementById("importCsv").onclick = event => {
  // in real life, you might fetch a CSV via API call or file system read
  // but for now we'll just simulate that with a dummy CSV object
  const csv = getDummyCsv;
  const csvResultArea = document.getElementById("importCsvResult");
  const loader = document.getElementById("csvloader");

  const button = event.target;
  disableButtonWith(button, "Please wait...");

  fadeOut(csvResultArea, 150).then(() => { fadeIn(loader, 200) });

  Promise.all(
    csv.rows.map((row, index) => {
      return new Promise((resolve, reject) => {
        dummyRequest("extraCellForCsvRow").then(extraCell => {
        // dummyRequest("nope").then(extraCell => {
          resolve([...row, extraCell]);
        }).catch(err => {
          reject(new Error(`Problem updating row ${index} - ${err.message}`));
        });
      });
    })
  ).then(rows => {
    document.getElementById("importCsvResult").innerHTML = csvHtml(rows);
  }).catch(err => {
    document.getElementById("importCsvResult").innerHTML = `An error occurred :( <br>${err}`;
  }).then(() => {
    fadeOut(loader, 150).then(() => { fadeIn(csvResultArea, 200) });
    undisableButtonWith(button, "Import CSV");
  });
};

// listen for clicks on the 'List Users' button
document.getElementById("listUsers").onclick = event => {
  const users = ['user_1', 'user_2', 'user_3'];
  const progressBar = document.getElementById("progressBar");

  const button = event.target;
  disableButtonWith(button, "Please wait...");

  let progress = 0;
  progressBar.style.width = progress + "%";

  (async function() {
    for (let index = 0; index < users.length; index++) {
      await dummyRequest("user");

      progress += 1;
      progressBar.style.width = (progress / users.length * 100) + "%";

      if (progress === users.length) {
        undisableButtonWith(button, "List Users");
      }
    }
  })();
};

async function dummyRequest(type) {
  // in real life, you'll probably use `fetch` here
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  // ...but we'll just simulate a slow API request by awaiting a timeout
  await timeout(1250);

  switch (type) {
    case "user":
    return {
        name: "A. User",
        bio: "Lorem ipsum dolor sit amet...",
        interests: ["JavaScript", "geography", "music"],
        image: "https://images.unsplash.com/photo-1502720705749-871143f0e671?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=300&fit=max&s=b8377ca9f985d80264279f277f3a67f5"
      };
    case "extraCellForCsvRow":
      return "extra cell fetched asynchronously";
    default:
      throw new Error("404 Not Found");
  }
};

const disableButtonWith = (button, text) => {
  button.disabled = true;
  button.innerText = text;
};

const undisableButtonWith = (button, text) => {
  button.disabled = false;
  button.innerText = text;
};

const fadeIn = (element, animationDuration) => {
  return new Promise(resolve => {
    element.style.display = "block";
    element.style.transition = `opacity ${animationDuration}ms linear 0s`;

    element.addEventListener("transitionend", function handler() {
      element.removeEventListener("transitionend", handler);
      resolve();
    });

    timeout(10).then(() => {
      element.style.opacity = 1;
    });
  })
};

const fadeOut = (element, animationDuration) => {
  return new Promise(resolve => {
    element.style.transition = `opacity ${animationDuration}ms linear 0s`;

    element.addEventListener("transitionend", function handler() {
      element.removeEventListener("transitionend", handler);
      element.style.display = "none";
      resolve();
    });

    element.style.opacity = 0;
  })
};

const userHtml = user => {
  return `
    <img class="user-pic" src="${user.image}" />
    <p>Name: ${user.name}</p>
    <p>Bio: ${user.bio}</p>
    <p>Interests: ${user.interests.join(", ")}</p>
  `;
};

const csvHtml = rows => {
  return `${rows.map(row => row.join(", ")).join("<br><br>")}`
};

const getDummyCsv = {
  rows: [
    ["cell 1", "cell 2", "cell 3"],
    ["cell 1", "cell 2", "cell 3"],
    ["cell 1", "cell 2", "cell 3"]
  ]
};
