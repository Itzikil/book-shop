'use strict'

const STORAGE_KEY = 'LSbooks'
const PAGE_SIZE = 5
var gBooks
var gFilterBy = {
    txt: '',
    minPrice: 0,
    minRate: 0,
}
var gSort
var gPageIdx = 0

_createBooks()
function getBooks() {
    // var books = gBooks
    var books = gBooks.filter(book =>  book.price >= gFilterBy.minPrice &&
    book.rate >= gFilterBy.minRate)
    // console.log(books);
    
    books = books.filter(book => book.title.toLowerCase().includes(gFilterBy.txt.toLowerCase()))
    
    // if (gFilterBy.status) {
    //     var maxPrice = books.reduce((a, b) => {return (a.price > b.price) ? a : b})
    //     var minRate = books.reduce((a, b) => {return (a.rate > b.rate) ? b : a})
    //         if(gFilterBy.status === 'price')books = [maxPrice]
    //         else if(gFilterBy.status === 'rate')books = [minRate]
    // }
    
    // how to make it shorter
    if (gSort === 'Price')books.sort((a , b)=> a.price - b.price)
    if (gSort === 'Id')books.sort((a , b)=> a.id - b.id)
    if (gSort === 'Title')books.sort((a , b)=> {return (a.title > b.title)? 1 : -1 })

    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)

    return books
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    // console.log(books);
    if (!books || !books.length) {
        books = [
            {
                id: 1,
                title: 'java for begginers',
                price: 10,
                rate: 0,
                desc: makeLorem(),
            },
            {
                id: 2,
                title: 'java for intermidate',
                price: 20,
                rate: 0,
                desc: makeLorem(),
            },
            {
                id: 3,
                title: 'java for advanced',
                price: 30,
                rate: 0,
                desc: makeLorem(),
            },
            {
                id: 4,
                title: 'java for dummies',
                price: 40,
                rate: 0,
                desc: makeLorem(),
            },
        ]
    }
    gBooks = books
    _saveBooksToStorage()
}

function createBook(title, price) {
    return { id: gBooks.length + 1, title, price: 0, rate: 0, desc: makeLorem() }
}

function removeBook(bookId) {
    var currBook = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(currBook, 1)
    _saveBooksToStorage()
}

function addBook(title, price) {
    gBooks.push(createBook(title, price))
    _saveBooksToStorage()
}

function updateBook(bookId, bookPrice) {
    var currBook = gBooks.find(book => book.id === bookId)
    currBook.price = bookPrice
    _saveBooksToStorage()
}

function getBookById(bookId) {
    var book = gBooks.find(book => book.id === bookId)
    return book
}

function rateBook(rating, bookId) {
    const book = getBookById(bookId)
    if (book.rate <= 0 && rating === -1
        || book.rate >= 10 && rating === 1) return
    book.rate += rating
    _saveBooksToStorage()
    return book
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function setBookFilter(filterBy) {
    console.log(filterBy);
    if (filterBy.minPrice !== undefined) gFilterBy.minPrice = filterBy.minPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    return gFilterBy
}

function setFilterByTxt(txt){
    gFilterBy.txt = txt
}

function nextPage(num) {
    gPageIdx += num
    var books = getBooks()
    if(!books.length) return gPageIdx -= num
    return gPageIdx
}

function sortBy(value){
    gSort = value
}

function pagesCount(){
    if (gFilterBy.status) return 1
    return Math.ceil(gBooks.length/ PAGE_SIZE)
}

function clickPage(page){
    gPageIdx = page -1
    return gPageIdx +1
}
