const { log } = console;
let isRead = false;
let myLibrary = [];

//INTERFACE
const overlay = document.querySelector(".overlay");
const addBookButton = document.querySelector("button.add-book");
const inputBookTitle = document.querySelector("input#title");
const inputBookAuthor = document.querySelector("input#author");
const inputBookPages = document.querySelector("input#pages");
const inputBookIsRead = document.querySelector("#isRead");
const submitBook = document.querySelector("button#confirm");
const overlayError = document.querySelector(".error");
const main = document.querySelector("div.main");

overlay.addEventListener("click", closeOverlay);
addBookButton.addEventListener("click", openOverlay);
submitBook.addEventListener("click", addBook);

inputBookIsRead.addEventListener("click", function () {
  isRead = this.checked ? true : false;
});
//----------------------------------------------------------------------------------------------------
function openOverlay() {
  overlay.classList.remove("hide");
}

function closeOverlay(e) {
  if (e.target.classList.contains("overlay")) overlay.classList.add("hide");
}

function hideOverlay(title, author, pages, overlay) {
  overlay.classList.add("hide");
  title.value = "";
  author.value = "";
  pages.value = "";
}

function addBook(e) {
  e.preventDefault();
  const title = inputBookTitle.value;
  const author = inputBookAuthor.value;
  const pages = +inputBookPages.value;
  if (!title || !author || !pages) return;
  //check if book already exists
  if (checkIfExists(title)) return;
  //if not add book to array
  addBookToLibrary(title, author, pages, isRead);
  showBook();
  hideOverlay(inputBookTitle, inputBookAuthor, inputBookPages, overlay);
}

//----------------------------------------------------------------------------------------------------
//Inner functions
function addBookToLibrary(title, author, pages, isRead) {
  myLibrary.push(new Book(title, author, pages, isRead));
}

function checkIfExists(title) {
  if (myLibrary.find((book) => book.title === title)) {
    overlayError.classList.remove("hide");
    overlayError.classList.add("red-font");
    overlayError.textContent = "This book is already exists!";
    setTimeout(() => {
      overlayError.classList.add("hide");
    }, 3000);
    return true;
  }
}

function createCard(name, author, pages, read) {
  //Create element
  const book = document.createElement("div");
  const bookInfo = document.createElement("div");
  const bookName = document.createElement("p");
  const bookAuthor = document.createElement("p");
  const bookPages = document.createElement("p");
  const buttonRead = document.createElement("button");
  const buttonRemove = document.createElement("button");

  book.classList.add("book", "book-card");
  //BOOK INFO
  bookInfo.classList.add("book-info");
  //BOOK NAME
  bookName.classList.add("book-name");
  bookName.textContent = `"${name}"`;
  //BOOK AUTHOR
  bookAuthor.classList.add("book-author");
  bookAuthor.textContent = author;
  //BOOK PAGES
  bookPages.classList.add("book-pages");
  bookPages.textContent = `${pages} pages`;
  //BUTTON READ
  buttonRead.classList.add("book-button", "read");
  read
    ? ((buttonRead.textContent = "Read"), buttonRead.classList.add("green"))
    : ((buttonRead.textContent = "Not read"), buttonRead.classList.add("red"));
  //BUTTON REMOVE
  buttonRemove.classList.add("book-button", "remove");
  buttonRemove.textContent = "Remove";
  //CONSTRUCT CARD
  main.appendChild(book);
  book.append(bookInfo, buttonRead, buttonRemove);
  bookInfo.append(bookName, bookAuthor, bookPages);

  //event listeners
  buttonRead.addEventListener("click", function (e) {
    const title = e.target.parentElement.firstChild.firstChild.textContent;
    const index = myLibrary.findIndex(book=> `"${book.title}"` === title )
    log(index)
    log(myLibrary[index].isRead);
    if (e.target.classList.contains("red")) {
      buttonRead.classList.remove("red");
      buttonRead.classList.add("green");
      buttonRead.textContent = "Read";
      myLibrary[index].isRead = true;
    } else {
      buttonRead.classList.remove("green");
      buttonRead.classList.add("red");
      buttonRead.textContent = "Not read";
      myLibrary[index].isRead = false;
    }
  });
  buttonRemove.addEventListener("click", function (e) {
    log(e.target.parentElement.dataset.index);
    let bookTitle = e.target.parentElement.firstChild.firstChild.textContent;
    log(bookTitle);
    log(myLibrary[0].title);
    const element = e.target.parentElement;
    element.remove();
    myLibrary = myLibrary.filter((book) => `"${book.title}"` != bookTitle);
    log(myLibrary);
  });
}

function showBook() {
  main.innerHTML = "";
  myLibrary.forEach(function (book, index) {
    createCard(book.title, book.author, book.pages, book.isRead, index);
  });
}

//----------------------------------------------------------------------------------------------------
class Book {
  constructor(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }
}


// The Lord of the Rings: The fellowship of the ring
// J. R. R. Tolkien
// 432

// Well Behaved Wives
// Amy Sue Nathan
// 319

// Fairy Tale
// Stephen King
// 608

// Confidence Man: The Making of Donald Trump and the Breaking of America
// Maggie Haberman
// 608
