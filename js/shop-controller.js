'use strict'

function onInit() {
    renderBooks()
    onClickPage(1)
}

function renderBooks() {

    var books = getBooks()
    var strHTML = books.map(book =>
        `<tr>
        <td>${book.id}</td>
        <td><img src="/imgs/book.png" alt="book"></td>
        <td>${book.title}</td>
        <td>${book.price}</td>
        <td><button class="read" onclick="onReadBook(${book.id})">${'Read'}</button></td>
        <td><button class="update" onclick="onUpdateBook(${book.id})">${'Update'}</button></td>
        <td><button class="delete" onclick="onRemoveBook(${book.id})">${'Delete'}</button></td>
        </tr>`
    )
    var headHTML =
        `<th onclick="onSortBy(this.innerHTML)">Id</th>
        <th>image</th>
        <th onclick="onSortBy(this.innerHTML)">Title</th>
        <th onclick="onSortBy(this.innerHTML)">Price</th>
        <th colspan="3">Actions</th>`

    document.querySelector('thead').innerHTML = headHTML
    document.querySelector('tbody').innerHTML = strHTML.join('')
    onPages()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
}

function onCreateBook() {
    document.querySelector('.new-book').classList.toggle('open-update')
    renderBooks()
}

function onAddBook(ev) {
    ev.preventDefault(ev)

    const elTxt = document.querySelector('[name=txt]')
    const name = elTxt.value

    const elNum = document.querySelector('[name=price]')
    const price = parseInt(elNum.value)
    if (!name || !price) return

    addBook(name, price)
    elTxt.value = ''
    elNum.value = ''
    document.querySelector('.new-book').classList.remove('open-update')
    renderBooks()
}

function onUpdateBook(bookId) {
    rederUpdating(bookId)
    document.querySelector('.update-book').classList.toggle('open-update')
}

function onUpdatingBook(ev, bookId) {
    ev.preventDefault(ev)
    const elNum = document.querySelector('[name=updated-price]')
    const bookPrice = parseInt(elNum.value)

    if (bookPrice) {
        updateBook(bookId, bookPrice)
        renderBooks()
        document.querySelector('.update-book').classList.remove('open-update')
    }
}

//i made 3 functions , make it 2? isnt it heavy to render every time?
function rederUpdating(bookId) {
    var elModal = document.querySelector('.update-modal')
    elModal.innerHTML =
        `<form class="update-book" onsubmit="onUpdatingBook(event, ${bookId})">
    Update the book's price
    <input type="text" name="updated-price">
    <button class="add">add</button>
    <button onclick="onCloseUpdate()" class="close">x</button>
    </form>`

}

function onCloseUpdate() {
    document.querySelector('.update-book').classList.remove('open-update')
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    renderBookDetails(book)
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function onRating(rate, bookId) {
    var book = rateBook(rate, +bookId)
    if (book) {
        var elModal = document.querySelector('.modal')
        elModal.querySelector('.rate').innerHTML = book.rate
    }
}

function renderBookDetails(book) {
    var elModal = document.querySelector('.modal')

    const strHtmls = `<h3></h3>
    <h4>Book rate</h4>
    <div class="rating">
    <button onclick="onRating(-1,'${book.id}')">-</button>
    <p class="rate"></p>
    <button onclick="onRating(1,'${book.id}')">+</button>
    </div>
    <img src="/imgs/book.png" alt="book">
    <h5>Book Description</h5>
    <p class="description"></p>
    <button onclick="onCloseModal()">Close</button>`
    elModal.innerHTML = strHtmls

    elModal.querySelector('h3').innerText = book.title
    elModal.querySelector('.rate').innerHTML = book.rate
    elModal.querySelector('.description').innerText = book.desc
    elModal.classList.add('open')
}

function onSetFilterBy(filterBy) {
    setBookFilter(filterBy)
    renderBooks()

    const queryStringParams = `?status=${filterBy}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSetFilterByTxt(txt) {
    setFilterByTxt(txt)
    renderBooks()
}

function onNextPage(num) {
    var currPage = nextPage(num) + 1
    renderBooks()
    renderPageNum(currPage)
}

function onSortBy(value) {
    sortBy(value)
    renderBooks()
}

function onPages() {
    var numOfPages = pagesCount()
    var strHTML = ``
    for (var i = 1; i <= numOfPages; i++) {
        strHTML += `<button class="page${i} page-num" onclick="onClickPage(${i})">${i}</button>`
    }
    document.querySelector('.pages').innerHTML = strHTML
}

function onClickPage(page) {
    var currPage = clickPage(page)
    renderBooks()
    renderPageNum(currPage)
}

function renderPageNum(currPage){
    document.querySelector('.page' + currPage).disabled = true
    if (currPage === 1) {
        document.querySelector('.perv-Page').disabled = true
    }else
    document.querySelector('.perv-Page').disabled = false
    // if (currPage === 1) {
    //     document.querySelector('.perv-Page').disabled = true
    // }else
    // document.querySelector('.perv-Page').disabled = false
    
}