class Book {
    constructor(title,author,id) {
        this.title = title;
        this.author = author;
        this._id = id;
    }

    promptInformation(){
        const title = prompt("Please give a title");
        const author = prompt("Please give a author");
        this.title = title;
        this.author = author;
        alert('The title is ' + this.title + "\nThe author is " + this.author);
    }
    // Return the title attribute
    get getTitle(){
        return this.title;
    }

    // Return the author 
    get getAuthor(){
        return this.author;
    }

    get getId(){
        return this._id;
    }
    changeTitle(){
        const newTitle = prompt("What should the new title be?");
        this.title = newTitle;
        alert('You have changed the title to ' + this.title);
    }

    toString(){
        return "The book is called " + this.title + ". The author is " + this.author + ".";
    }

    toJson(){
        return {
            title : this.title,
            author : this.author,
            id: this._id
        }
    }
}