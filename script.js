const { log } = console;
//------------------------------------------------------------------------------------------------------------------------
let myLibrary = [];
//Storage getter
const getMyLibrary = JSON.parse(localStorage.getItem("myLibrary"))
if(getMyLibrary&&getMyLibrary.length>0){
  myLibrary=getMyLibrary;
}

//------------------------------------------------------------------------------------------------------------------------
//Add book div interface
const overlay = document.querySelector(".overlay");
const addBookButton = document.querySelector("button.add-book");
const inputBookTitle = document.querySelector("input#title");
const inputBookAuthor = document.querySelector("input#author");
const inputBookPages = document.querySelector("input#pages");
const inputBookIsRead = document.querySelector("#isRead");
const submitBook = document.querySelector("button#confirm");
const overlayError = document.querySelector(".error");
const main = document.querySelector("div.main");
//------------------------------------------------------------------------------------------------------------------------
//Onclick overlay listeners
overlay.addEventListener("click", closeOverlay);
addBookButton.addEventListener("click", openOverlay);
//Onclick handlers
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
//------------------------------------------------------------------------------------------------------------------------
//Checkbox updater
let isRead = false;
inputBookIsRead.addEventListener("click", function () {
  isRead = this.checked ? true : false;
});
//------------------------------------------------------------------------------------------------------------------------
//Internal functions
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
function showBook() {
  main.innerHTML = "";
  myLibrary.forEach(function (book) {
    createCard(book.title, book.author, book.pages, book.isRead);
  });
}

//------------------------------------------------------------------------------------------------------------------------
//Create book card element
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
  //READ CLICK HANDLER
  buttonRead.addEventListener("click", function (e) {
    const title = bookName.textContent;
    const index = myLibrary.findIndex((book) => `"${book.title}"` === title);
    log(index);
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
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  });

  //BUTTON REMOVE
  buttonRemove.classList.add("book-button", "remove");
  buttonRemove.textContent = "Remove";
  //REMOVE CLICK HANDLER
  buttonRemove.addEventListener("click", function (e) {
    const title = bookName.textContent;
    const index = myLibrary.findIndex((book) => `"${book.title}"` === title);
    log(index);
    const element = e.target.parentElement;
    element.remove();
    myLibrary.splice(index, 1);
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  });

  //CONSTRUCT CARD
  main.appendChild(book);
  book.append(bookInfo, buttonRead, buttonRemove);
  bookInfo.append(bookName, bookAuthor, bookPages);
}
//------------------------------------------------------------------------------------------------------------------------
//ADD book AND DISPLAY ON THE SCREEN
submitBook.addEventListener("click", addBook);
function addBook(e) {
  e.preventDefault();
  //Set variables
  const title = inputBookTitle.value;
  const author = inputBookAuthor.value;
  const pages = +inputBookPages.value;
  //If one of the field is empty break
  if (!title || !author || !pages) return;
  //Check if book already exists if true break
  if (checkIfExists(title)) return;
  //Create new Book instance push into myLibrary array
  addBookToLibrary(title, author, pages, isRead);
  //Update local storage
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  //Show book on the main page
  showBook();
  //Hide overlay 
  hideOverlay(inputBookTitle, inputBookAuthor, inputBookPages, overlay);
}
//----------------------------------------------------------------------------------------------------
//Book constructor
class Book {
  constructor(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }
}
//----------------------------------------------------------------------------------------------------
//STORAGE
showBook();
//Update obj prototype after getting from storage
myLibrary.forEach(book=>book.__proto__= new Book)
//----------------------------------------------------------------------------------------------------
