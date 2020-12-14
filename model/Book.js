function Book(id, isbn, title, authors, publishedDate, smallThumbnailLink, thumbnailLink){
    this.id = id || null;
    this.isbn = isbn || null;
    this.title = title || null;
    this.authors = authors || null;
    this.publishedDate = publishedDate || null;
    this.smallThumbnailLink = smallThumbnailLink || null;
    this.thumbnailLink = thumbnailLink || null;
}

function BookNoId(isbn, title, authors, publishedDate, smallThumbnailLink, thumbnailLink){
    this.isbn = isbn || null;
    this.title = title || null;
    this.authors = authors || null;
    this.publishedDate = publishedDate || null;
    this.smallThumbnailLink = smallThumbnailLink || null;
    this.thumbnailLink = thumbnailLink || null;
}

module.exports = {
    Book: Book,
    BookNoId: BookNoId
}