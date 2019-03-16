# Learn promises and async/await in JavaScript
A quick interactive tutorial for learning how to use promises and async/await in JavaScript.

## Who is this tutorial for?

This tutorial is aimed at those who know JavaScript's fundamentals but are still fairly new to the language and would find more practice writing asynchronous code helpful.

## Great - let's go!

### 1. Create or download the files you'll need

Clone this project if you want to browse its code locally (although you might be fine browsing it here on GitHub).

```bash
  $ git clone git@github.com:louiseswift/learn-promises-async-await.git
```

For maximum learning, also create a (separate) new project directory containing the files `index.html` and `index.js` ready to fill in as you follow the step-by-step instructions below.

You'll also need `style.css`, which you can grab from [here](https://github.com/louiseswift/learn-promises-async-await/blob/master/style.css) (unless you'd really enjoy writing it out yourself!).

### 2. Start a local server

Not _strictly_ necessary, since we're only serving static files here and your file system may be happy with that, but it's always nice to have a `localhost` URL.

If you don't have a preferred local server already, you could use [http-server](https://www.npmjs.com/package/http-server) - instructions for installation are at the link.

Once it's installed, run the local server from your project directory:

```bash
  $ cd my-project-directory
  $ http-server -p 8000
```

And finally, open up a new browser tab and navigate to [http://localhost:8000](http://localhost:8000).

### 3. Create our first await-able async function

One of the most important functions that we'll be using in later code is this:

```javascript
  const timeout = ms => {
    return new Promise(resolve => {
      window.setTimeout(resolve, ms);
    });
  };
```

(Make sure to add it to the top of index.js now.)

This `timeout` function will allow us to wait for any specified number of miliseconds before executing some specific code only once the timeout is up.

Because of the promise syntax, we can use `.then()` or `await` with this function. We'll look at examples of those very shortly.

If you want, you can shorten the definition of `timeout` to:

```javascript
  const timeout = ms => new Promise(resolve => window.setTimeout(resolve, ms));
```

But use whatever version is clearest to you. Clarity & understanding beats super-short code 100% of the time.

### 4. Write a couple of small helper functions

These guys will help us keep the rest of our code tidier, so add them to the bottom of index.js now:

```javascript
  const disableButtonWith = (button, text) => {
    button.disabled = true;
    button.innerText = text;
  };

  const undisableButtonWith = (button, text) => {
    button.disabled = false;
    button.innerText = text;
  };
```

### 5. Create our fadeIn and fadeOut animations

Because setting a `display: none` CSS property on a visible element causes it to abruptly vanish from view, potentially causing elements sitting below or beside it on the page to jump upwards or leftwards, it's nice to have some controlled animation in place.

It can also be nice to fadeOut one element (e.g. a loader) before fading in the next (e.g. the content that has been fetched from an API).

Animation libraries optimised for smooth transitions are usually the best bet for this, but to practice promise syntax we can create some simple fadeIn and fadeOut animations here.

To the bottom of index.js, add:

```javascript
  const fadeIn = (element, animationDuration) => {
    // this is where the promise will be created & returned
  };
```

Replace the comment above with the code to create and return a promise:

```javascript
  return new Promise(resolve => {
    // animation code will go here
  })
```

And now replace the comment above with the animation steps:

```javascript
  // in our app, we'll make sure any element that's going to be faded-in
  // will have `opacity: 0` set on it, so we can safely set it to `display: block`
  // knowing that it won't visibly pop into view
  element.style.display = "block";

  // we should prepare the element for the opacity transition, in case it doesn't
  // yet know that we expect a nice fade in
  element.style.transition = `opacity ${animationDuration}ms linear 0s`;

  // the `transitionend` event listener can do the job of waiting for a transition
  // on this element to end and then resolving the promise
  element.addEventListener("transitionend", function handler() {
    element.removeEventListener("transitionend", handler);
    console.log("🌟 fadeIn complete!");
    resolve();
  });

  // we have to wait a very short moment after the transition was set, just above,
  // before we can change this element's opacity and get the animation we want
  timeout(10).then(() => {
    element.style.opacity = 1;
  });
```

To test this fadeIn function, you can open up the console (CMD/CTRL + ALT + J in Chrome) on your project's index.html page.

In this console, you can select an invisible loader element (`const el = document.querySelector(".loader")`) and run the fadeIn function on it (`fadeIn(el, 250)`).

Notice the console.log statement only executes once the fadeIn() is complete, because it's called just before we call `resolve()`, which itself is only called at the end of the opacity transition.

Using a promise like this enables us to carefully wait for a fadeIn (and `display:none`) to complete, if we need to, before certain subsequent code executes.

**CHALLENGE:**

Try writing your own corresponding fadeOut() function, which will need to do similar steps to fadeIn() but in a different order.

If stuck, there is a working example [here](https://github.com/louiseswift/learn-promises-async-await/blob/master/index.js#L128).

### 6. Add the 'Get User Profile' button click handler

Now we've got fadeIn() and fadeOut() functions ready, we can start handling clicks on the 'Get User Profile' button.

```javascript
  document.getElementById("getUserProfile").onclick = () => {
    const userProfile = document.getElementById("userProfileData");
    const loader = document.getElementById("userDataLoader");

    const button = event.target;
    disableButtonWith(button, "Please wait...");

    fadeOut(userProfile, 150).then(() => { fadeIn(loader, 200) });

    // your dummyRequest will go here (you'll write it in the next step)
  };
```

This isn't too exciting (except for the joy of seeing carefully-chained animations when you click a button).

But notice how the `then()` function is chained after the fadeOut() call.

This is because, if your fadeOut() and fadeIn() functions match the examples given [here](https://github.com/louiseswift/learn-promises-async-await/blob/master/index.js), they return the promise that they create.

Because it receives this promise, `then()` is able to wait patiently for the promise to resolve before it executes the function that you passed into it.

If you keep returning values, you can keep chaining `then()` calls. (There's a good example of this [here](https://developers.google.com/web/fundamentals/primers/promises#chaining).)

### 7. Create the dummyRequest function to mimic a slow API request

In order to be able to complete the event handler you created in Step 4, you'll need to create a new function at the bottom of index.js. It will allow us to make artifically-slow dummy API calls so we can more easily see the results of using promises.

Notice as you write out the following `dummyRequest` function in your index.js file that it begins with the `async` keyword. That will allow us to use `await` with it, as you'll see shortly, because it essentially turns this function into one that creates and returns a promise.

Within `dummyRequest`, also notice that you're adding a line that will `await` a call to the `timeout` function that you created in step 3. Recall that you instructed `timeout` to create and return a promise. So you're seeing a couple of different syntax options here, and can use whichever makes the most sense in your future work.

```javascript
  async function dummyRequest(type) {
  // in real life, you'll probably use `fetch` here
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  // ...but we'll just simulate a slow API request by awaiting a timeout
  await timeout(1250);

  switch (type) {
    // you'll be adding the rest of the code here very shortly
  }
};
```

Now fill in the `switch` statement, replacing the comment with the snippet below.

```javascript
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
```

(Notice here that an error will be thrown if `type` is not a recognised value. We will use that for testing error-handling later.)

### 8. Complete the 'Get User Profile' button click handler

You can now go back to the click handler you created in step 6, which we left with a comment indicating where further code should go.

It's time to replace that comment with a call to our `dummyRequest` function:

```javascript
  dummyRequest("user").then(user => {
    userProfile.innerHTML = userHtml(user);

    fadeOut(loader, 150).then(() => { fadeIn(userProfile, 200) });

    undisableButtonWith(button, "Get User Profile");
  });
```

As you can see, the first thing we want to do with the dummy `user` returned by the dummy request function is wrap its various attributes in the HTML tags that will make the user's information display in the user profile area on the page.

We'll need to add the `userHtml` function to the bottom of `index.js`, of course:

```javascript
  const userHtml = user => {
    return `
      <img class="user-pic" src="${user.image}" />
      <p>Name: ${user.name}</p>
      <p>Bio: ${user.bio}</p>
      <p>Interests: ${user.interests.join(", ")}</p>
    `;
  };
```

The remainder of the click event handler's tasks are fade-in/out animations and button un-disabling. You can see this all in action when clicking the 'Get User Profile' button now. (If not, review the functions you've written against the ones in the [example code](https://github.com/louiseswift/learn-promises-async-await/blob/master/index.js).

### 9. Use Promise.all() to wait for multiple promises to resolve

Next, let's handle clicks on the 'Import CSV' button.

For our planned code to work, we'll need to create a dummy CSV somewhere near the bottom of index.js:

```javascript
  const getDummyCsv = {
    rows: [
      ["cell 1", "cell 2", "cell 3"],
      ["cell 1", "cell 2", "cell 3"],
      ["cell 1", "cell 2", "cell 3"]
    ]
  };
```

This will allow us to pretend that we imported and parsed a real CSV file. You'd be likely to get a data structure like nested arrays from doing so. The outer array represents the rows in the CSV, and the inner arrays represent the cells in each row.

In order to practice using `Promise.all`, we'll instruct our app to look at each row in the CSV and carefully append a new cell to each row.

(If you wanted to increase the complexity/realism of this, you could inspect the contents of the row before appending a specific extra cell depending on the result of the inspection. Or keep it simple for now to stay focused on the usage of promises here.)

```javascript
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
      // this is where the code that looks at each row in the CSV will go shortly
    ).then(rows => {
      // once all promises enclosed by Promise.all have resolved, create HTML with
      // the contents of `rows` that can be placed into the page
      document.getElementById("importCsvResult").innerHTML = csvHtml(rows);
    }).catch(err => {
      // if any of the promises are rejected, tell the user that an error occurred
      document.getElementById("importCsvResult").innerHTML = `An error occurred :( <br>${err}`;
    }).then(() => {
      // we'll finally need to fade out the loader and fade in either the CSV rows
      // or the error message
      fadeOut(loader, 150).then(() => { fadeIn(csvResultArea, 200) });
      undisableButtonWith(button, "Import CSV");
    });
  };
```

Within the `Promise.all` call above, you'll need to add the following code to look at each row in the CSV and fetch an extra cell to append to each one.

We use a new promise for each row here so that the earlier `Promise.all` will be able to wait for each one to resolve or reject before proceeding.

```javascript
  csv.rows.map((row, index) => {
    return new Promise((resolve, reject) => {
      dummyRequest("extraCellForCsvRow").then(extraCell => {
      // dummyRequest("nope").then(extraCell => {
        resolve([...row, extraCell]);
      }).catch(err => {
        // here, we can reject the promise with a specific error about which
        // row failed to fetch its extra cell
        reject(new Error(`Problem updating row ${index} - ${err.message}`));
      });
    });
  })
```

Notice the commented-out line in this section, where `dummyRequest` is called with the argument `"nope"`. This shows how you can force `dummyRequest` to throw a 404 Not Found error. (Double-check your `dummyRequest` function if you need a reminder about how it works.)

Make sure to test both the successful and non-successful version of the 'Import CSV' feature you've just built, using `console.log` where helpful to see when exactly the various `then` and `catch` calls are made.


### 10. Use promises to gradually fill a loading bar

For the "List Users" button click handler, we can look at using `async` to avoid having to write out the full promise syntax.

We can even use it with a self-executing anonymous function. (If you're unfamiliar with those, they are non-named functions that call themselves as soon as they are defined. They can't be called later, because they don't have a name to call them with. You can try `(function() { return 'hola' })()` in the browser console if you want to see for yourself.)

Without `async` here, we wouldn't be able to use the `await` that we want to use to make sure that we wait until a user has been fetched before we update the progress bar.

```javascript
  // listen for clicks on the 'List Users' button
  document.getElementById("listUsers").onclick = event => {
    const users = ['user_1', 'user_2', 'user_3'];
    const progressBar = document.getElementById("progressBar");

    const button = event.target;
    disableButtonWith(button, "Please wait...");

    let progress = 0;
    progressBar.style.width = progress + "%";

    // we can use the async keyword with a self-executing anonymous function
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
```

**And that's it for this tutorial! Amazing work for getting this far.**

If there's something specific you want to do with promises that isn't covered here, or if there's a strange issue holding you up, feel free to [open an issue](https://github.com/louiseswift/learn-promises-async-await/issues/new) or [send me a tweet](https://twitter.com/lswift01).
