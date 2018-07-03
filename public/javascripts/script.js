window.onload = function () {
    let availableBooks = [];
    let bookCount = false;
    if (document.getElementById('formInfo')) {
        document.getElementById('formInfo').style.display = "none";
    }
    // Retrieve every element with the class bookTitle
    var bookTitle = document.getElementsByClassName('bookTitle');
    // Function that changes color everytime the user changes the book title
    function changeColor() {
        // Create a prompt that will store the users information in the variable name
        const name = prompt('What is the name of the book?');
        // Create a variable that we will check amount of times user stored data
        let i = 0;
        //If the user entered an invalid name they have 3 tries to change it
        while (name.length === 0 || i > 3) {
            const name = prompt('What is the name of the book?');
            i++;
        }
        // Change the text of the current element to whatever they wrote
        this.innerHTML = name;
        // If user already has the color purple then change color of text to green 
        if (this.style.color === "purple") {
            this.style.color = "Green";
        } else {
            this.style.color = "Purple";
        }
        // Add an additional class to the html element
        this.classList.add('test');
    }
    // Run a for loop to add specific properties to every element that has the class bookTitle
    for (let i = 0; i < bookTitle.length; i++) {
        // Change every color to red
        bookTitle[i].style.color = "red";
        // change every font-size to 1.4em
        bookTitle[i].style.fontSize = "1.4em";
        // Add an event LIstener to change the text color on every click
        bookTitle[i].addEventListener('click', changeColor);
    }

    if (document.getElementById('bookList')) {
        // Get the element with the id of addBook
        var addBook = document.getElementById('addBook');
        // get the element wit hthe id bookList
        var container = document.getElementById('bookList');

        /**
         * Function that prompts the user to add information for us to use 
         * Will store information in the class 
         * Then create new HTML elements with built in function createElement
         * We then use document.createTextNode to add the title and author to the h2 and p tag
         * Then append both the h2 and p tag to our div tag 
         * Lastly, we append out div tag that contains everything to the element with id bookList
         */
        function addNewBook() {
            // Create a new instance of Book
            let newBook = new Book();
            // Ask user for information
            newBook.promptInformation();
            // Call the createBook route we decalred in route/index.js
            fetch('/createBook', {
                method: "POST",
                // Information we are passing to the route
                body: JSON.stringify(newBook),
                // What type of information we are sending to the backend and what type of 
                // information we are accepting
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                // Sort out information using special json() method
                response.json()
                    // If error, then log it in the console
                    .catch(error => console.error('Error:', error))
                    // Otherwise add book to view
                    .then(function (resp) {
                        swapInfoColors();
                        document.getElementById('formInfo').innerHTML = "Successfully added book";
                        document.getElementById('formInfo').style.display = "block";
                        addBookToView(newBook, resp);
                    })
            }, function (error) {
                console.log(error);
            });
        }
        // Adds an event listener to the addBook element
        addBook.addEventListener("click", addNewBook);

        function retrieveBook(refresh) {
            // Checks if the availableBooks is empty, if it is, go into the database and store all of the information 
            // into the variable availableBooks
            if (refresh) {
                if (availableBooks.length === 0) {
                    // Call retrieve books
                    fetch('/retrieveBook', {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                        // If an error occurs, then send it to the console
                        .catch(error => console.error('Error:', error))
                        // otherwise, do something with the data
                        .then(function (response) {
                            // Check if there is a response
                            if (response) {
                                // Make the availableBooks variable equal to the data retrieved from the database
                                availableBooks = response;
                                // Loop through thte availableBooks array and add everything to the webPage
                                for (let j = 0; j < availableBooks.length; j++) {
                                    let tempbook = new Book(availableBooks[j].title, availableBooks[j].author, availableBooks[j]._id);
                                    addBookToView(tempbook);
                                }
                                swapInfoColors();
                                document.getElementById('formInfo').innerHTML = "Successfully listed all books";
                                document.getElementById('formInfo').style.display = "block";
                            } else {
                                swapWarningColors();
                                document.getElementById('formInfo').innerHTML = "Something went wrong";
                                document.getElementById('formInfo').style.display = "block";
                            }
                        });
                } else {
                    swapWarningColors();
                    document.getElementById('formInfo').innerHTML = "Books are already populated";
                    document.getElementById('formInfo').style.display = "block";
                }
            }
        }
        document.getElementById('retrieveBook').addEventListener('click', retrieveBook);

        function updateBook(book) {
            // find a way to get the container div
            return fetch('/updateBook', {
                method: "POST",
                body: JSON.stringify(book),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                return true;
            }, function (error) {
                console.log(error);
            });
        }
        /**
         *  Updating functions  
         *  Update function will be the call that is added to the click event for the button
         *  updateBook function is used to call the database 
         * 
         */
        function update(e) {
            e.preventDefault();
            // Store the value or input field in box
            let value = document.getElementById('updateIsbn').value;
            // Variables we will use to store the index of current book from the arary of elements we retrieved
            // when the page loaded 
            // The curBook will store the actual information 
            let curBook, curIndex;
            // Loop through every book from database and check if the isbn exists
            for (let i = 0; i < availableBooks.length; i++) {
                if (availableBooks[i]._id === value) {
                    // Store current book in array 
                    curBook = availableBooks[i];
                    // store the index of book 
                    curIndex = i;
                    // Exit the loop
                    break;
                }
            }
            // If the loop did not return anything, then let user know and exit function
            if (curBook == null) {
                swapWarningColors();
                document.getElementById('formInfo').innerHTML = "No book found with that ISBN";
                document.getElementById('formInfo').style.display = "block";
                return;
            }
            // Ask for user information 
            let book = new Book();
            book.promptInformation();
            // Store id from database
            book._id = value;
            // update in the database and if results work...
            if (updateBook(book)) {
                //store the html element in variable
                var myNode = document.getElementById('bookList')
                // loop through and remove all elements 
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.firstChild);
                }
                // set the new book information with the current index
                availableBooks[curIndex] = book;
                // display all information back to the HTML page
                for (let j = 0; j < availableBooks.length; j++) {
                    let tempbook = new Book(availableBooks[j].title, availableBooks[j].author, availableBooks[j]._id);
                    addBookToView(tempbook);
                }
                swapInfoColors();
                // Let user know that book was updated
                document.getElementById('formInfo').innerHTML = book.getTitle + " successfully updated!";
                document.getElementById('formInfo').style.display = "block";
                // clear the input field you added the isbn number in 
                document.getElementById('updateIsbn').value = "";
            }
        }
        // Add the click event handler to the submit button 
        document.getElementById('updateSubmit').addEventListener('click', update);


        function deleteBook(e, id) {
            e.preventDefault();
            let curBook, curIndex;
            let value = document.getElementById('deleteIsbn').value;
            // Loop through every book from database and check if the isbn exists
            for (let i = 0; i < availableBooks.length; i++) {
                if (availableBooks[i]._id === value) {
                    // Store current book in array 
                    curBook = new Book(availableBooks[i].title, availableBooks[i].author, availableBooks[i]._id);
                    // Exit the loop
                    curIndex = i;
                    break;
                }
            }
            // If the loop did not return anything, then let user know and exit function
            if (curBook == null) {
                swapWarningColors();
                document.getElementById('formInfo').innerHTML = "No book found with that ISBN";
                document.getElementById('formInfo').style.display = "block";
                return;
            }
            fetch('/deleteBook', {
                method: "POST",
                body: JSON.stringify(curBook),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                // If an error occurs, then send it to the console
                .catch(error => console.error('Error:', error))
                // otherwise, do something with the data
                .then(function (response) {
                    //store the html element in variable
                    var myNode = document.getElementById('bookList')
                    // loop through and remove all elements 
                    while (myNode.firstChild) {
                        myNode.removeChild(myNode.firstChild);
                    }
                    availableBooks.splice(curIndex, 1);
                    for (let j = 0; j < availableBooks.length; j++) {
                        let tempbook = new Book(availableBooks[j].title, availableBooks[j].author, availableBooks[j]._id);
                        addBookToView(tempbook);
                    }
                    swapInfoColors();
                    // Let user know that book was updated
                    document.getElementById('formInfo').innerHTML = curBook.title + " successfully deleted!";
                    document.getElementById('formInfo').style.display = "block";
                    // clear the input field you added the isbn number in 
                    document.getElementById('deleteIsbn').value = "";
                }, function (error) {
                    console.log(error);
                });
        }
        document.getElementById('deleteSubmit').addEventListener('click', deleteBook);

        /**
         * 
         * @param {
         * } newBook 
         * 
         * @param {*} id 
         * 
         * Function that will create all of the necessary elements on the html page for up
         */
        function addBookToView(newBook, id) {
            // If the id is empty then we will include the one in the newBook paramete
            if (id == undefined) {
                // Creates the necessary information to display information
                var bookContainer = document.createElement('DIV');
                var bookTitle = document.createElement('H2');
                var bookAuthor = document.createElement('P');
                var bookId = document.createElement('P');
                // Way to create the words inside of each element
                bookTitle.appendChild(document.createTextNode("Title: " + newBook.getTitle));
                bookAuthor.appendChild(document.createTextNode("Author: " + newBook.getAuthor));
                bookId.appendChild(document.createTextNode("ISBN: " + newBook.getId));
                // Adds the necessary classes to the container
                bookContainer.classList.add('col-md-4');
                // Now add all of the elements to the bookList div we called with getElementbyId and named container
                bookContainer.appendChild(bookTitle);
                bookContainer.appendChild(bookAuthor);
                bookContainer.appendChild(bookId);
                container.appendChild(bookContainer);
            } else {
                var bookContainer = document.createElement('DIV');
                var bookTitle = document.createElement('H2');
                var bookAuthor = document.createElement('P');
                var bookId = document.createElement('P');
                bookTitle.appendChild(document.createTextNode("Title: " + newBook.getTitle));
                bookAuthor.appendChild(document.createTextNode("Author: " + newBook.getAuthor));
                bookId.appendChild(document.createTextNode("ISBN: " + id));
                bookContainer.classList.add('col-md-4');
                bookContainer.appendChild(bookTitle);
                bookContainer.appendChild(bookAuthor);
                bookContainer.appendChild(bookId);
                container.appendChild(bookContainer);
            }
        }

        function swapWarningColors() {
            if (document.getElementById('formInfo').classList.contains('alert-info'))
                document.getElementById('formInfo').classList.remove('alert-info');
            document.getElementById('formInfo').classList.add('alert-danger');
        }
        function swapInfoColors() {
            if (document.getElementById('formInfo').classList.contains('alert-danger'))
                document.getElementById('formInfo').classList.remove('alert-danger');
            document.getElementById('formInfo').classList.add('alert-info');
        }
    }
}