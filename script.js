const { log } = console;

class Library {
  constructor() {
    this.books = [];
  }
  getBooks = ()=>{
    const getMyBooks = JSON.parse(localStorage.getItem("Books"));
    if (getMyBooks && getMyBooks.length > 0) {
      this.books = getMyBooks;
    }
  }
  setBooks = () => {
    localStorage.setItem("Books", JSON.stringify(this.books));
  }
}

class Book {
  constructor(title, author, pages, isRead) {
    this.isRead = isRead;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.main = document.querySelector("div.main");
    this.book = document.createElement("div");
    this.bookInfo = document.createElement("div");
    this.bookName = document.createElement("p");
    this.bookAuthor = document.createElement("p");
    this.bookPages = document.createElement("p");
    this.buttonRead = document.createElement("button");
    this.buttonRemove = document.createElement("button");

    this.buttonRead.addEventListener("click", this.readBtnHandler);
    this.buttonRemove.addEventListener("click", this.removeBtnHandler);
  }
  //--------------------------------------------------------------------------------------------------------
  // HANDLERS
  //--------------------------------------------------------------------------------------------------------
  removeBtnHandler = (e) => {
    const title = this.bookName.textContent;
    const index = library.books.findIndex(
      (book) => `"${book.title}"` === title
    );
    log(index);
    const element = e.target.parentElement;
    element.remove();
    library.books.splice(index, 1);
    //library.setBooks();
  };
  readBtnHandler = (e) => {
    const read = this.buttonRead;
    if (e.target.classList.contains("red")) {
      read.classList.remove("red");
      read.classList.add("green");
      read.textContent = "Read";
      this.isRead = true;
    } else {
      read.classList.remove("green");
      read.classList.add("red");
      read.textContent = "Not read";
      this.isRead = false;
    }
    //library.setBooks();
  };
  //--------------------------------------------------------------------------------------------------------
  //METHODS
  //--------------------------------------------------------------------------------------------------------
  ifRead() {
    this.isRead
      ? ((this.buttonRead.textContent = "Read"),
        this.buttonRead.classList.add("green"))
      : ((this.buttonRead.textContent = "Not read"),
        this.buttonRead.classList.add("red"));
  }
  createCard() {
    this.constructCard();
    this.main.appendChild(this.book);
    this.book.append(this.bookInfo, this.buttonRead, this.buttonRemove);
    this.bookInfo.append(this.bookName, this.bookAuthor, this.bookPages);
  }
  constructCard(){
    this.book.classList.add("book", "book-card");
    //BOOK INFO
    this.bookInfo.classList.add("book-info");
    //BOOK NAME
    this.bookName.classList.add("book-name");
    this.bookName.textContent = `"${this.title}"`;
    //BOOK AUTHOR
    this.bookAuthor.classList.add("book-author");
    this.bookAuthor.textContent = this.author;
    //BOOK PAGES
    this.bookPages.classList.add("book-pages");
    this.bookPages.textContent = `${this.pages} pages`;
    //BUTTON READ
    this.buttonRead.classList.add("book-button", "read");
    this.ifRead();
    //BUTTON REMOVE
    this.buttonRemove.classList.add("book-button", "remove");
    this.buttonRemove.textContent = "Remove";
  }
}

class Display {
  constructor() {
    this._isRead = false;
    this.overlay = document.querySelector(".overlay");
    this.addBookButton = document.querySelector("button.add-book");
    this.inputTitle = document.querySelector("input#title");
    this.inputAuthor = document.querySelector("input#author");
    this.inputPages = document.querySelector("input#pages");
    this.inputBookIsRead = document.querySelector("#isRead");
    this.add = document.querySelector("button#confirm");
    this.overlayError = document.querySelector(".error");
    this.main = document.querySelector("div.main");

    //ADD LISTENERS
    this.addBookButton.addEventListener("click", this.openOverlay);
    this.overlay.addEventListener("click", this.closeOverlay);
    this.inputBookIsRead.addEventListener("click", this.isReaded);
    this.add.addEventListener("click", this.displayBook);
  }
  set isRead(bool) {
    this._isRead = bool;
  }
  get isRead() {
    return this._isRead;
  }
  //--------------------------------------------------------------------------------------------------------
  // HANDLERS
  //--------------------------------------------------------------------------------------------------------
  openOverlay = () => {
    //FUNCTION DECLARATION THIS = clicked element, thats why we use arrows
    this.overlay.classList.remove("hide");
  };
  closeOverlay = (e) => {
    if (e.target.classList.contains("overlay"))
      this.overlay.classList.add("hide");
  };
  isReaded = (e) => {
    const chekbox = e.target;
    this.isRead = chekbox.checked ? true : false;
  };
  displayBook = (e) => {
    e.preventDefault();
    const title = this.inputTitle.value;
    const author = this.inputAuthor.value;
    const pages = +this.inputPages.value;
    if (!title || !author || !pages) return;
    if (this.isExists()) return;
    this.addBook();
    this.showBook();
    this.hideOverlay();
  };
  //--------------------------------------------------------------------------------------------------------
  // METHODS
  //--------------------------------------------------------------------------------------------------------
  hideOverlay(){
    this.overlay.classList.add("hide");
    this.inputTitle.value = "";
    this.inputAuthor.value = "";
    this.inputPages.value = "";
  };
  isExists(){
    if (library.books.find((book) => book.title === this.inputTitle.value)) {
      this.overlayError.classList.remove("hide");
      this.overlayError.classList.add("red-font");
      this.overlayError.textContent = "This book is already exists!";
      setTimeout(() => {
        this.overlayError.classList.add("hide");
      }, 3000);
      return true;
    }
  };
  showBook(){
    this.main.innerHTML = "";
    library.books.forEach(function (book) {
      book.createCard();
    });
  };
  addBook(){
    library.books.push(
      new Book(
        this.inputTitle.value,
        this.inputAuthor.value,
        +this.inputPages.value,
        this.isRead
      )
    );
    //library.setBooks();
  };
}

const library = new Library();
const display = new Display();

const onload = (function () {
  //library.getBooks();
  // library.books.forEach((book) => {
  //   book.__proto__ = Book.prototype;
  // });
  // log(library.books[0])
  // display.showBook();
})();
//------------------------------------------------------------------------------------------------------------------------
