function Book(id, isbn, title, authors, publishedDate, thumbnailLink){
    this.id = id || null;
    this.isbn = isbn || null;
    this.title = title || null;
    this.authors = authors || null;
    this.publishedDate = publishedDate || null;
    this.thumbnailLink = thumbnailLink || null;
}

function BookNoId(isbn, title, authors, publishedDate, thumbnailLink){
    this.isbn = isbn || null;
    this.title = title || null;
    this.authors = authors || null;
    this.publishedDate = publishedDate || null;
    this.thumbnailLink = thumbnailLink || null;
}

function Insertion(id, isbn, title, authors, publishedDate, thumbnailLink, bookStatus, note, dateInsertion){
    this.id = id || null;
    this.isbn = isbn || null;
    this.title = title || null;
    this.authors = authors || null;
    this.publishedDate = publishedDate || null;
    this.thumbnailLink = thumbnailLink || null;
    this.bookStatus = bookStatus || null;
    this.note = note || null;
    this.dateInsertion = dateInsertion || null;
}

function InsertionFullDetails(username, email, lastName, firstName, city, isbn, title, authors, publishedDate, thumbnailLink, bookStatus, note, dateInsertion){
    this.username = username || null;
    this.email = email || null;
    this.lastName = lastName || null;
    this.firstName = firstName || null;
    this.city = city || null;
    this.isbn = isbn || null;
    this.title = title || null;
    this.authors = authors || null;
    this.publishedDate = publishedDate || null;
    this.thumbnailLink = thumbnailLink || null;
    this.bookStatus = bookStatus || null;
    this.note = note || null;
    this.dateInsertion = dateInsertion || null;
}

module.exports = {
    Book: Book,
    BookNoId: BookNoId,
    Insertion: Insertion,
    InsertionFullDetails: InsertionFullDetails
}