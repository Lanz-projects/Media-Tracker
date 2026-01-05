package com.lanz.mediatrackerbackend.service;

import com.lanz.mediatrackerbackend.dto.BookRequest;
import com.lanz.mediatrackerbackend.dto.BookResponse;
import com.lanz.mediatrackerbackend.model.Book;
import com.lanz.mediatrackerbackend.repository.BookRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final MongoTemplate mongoTemplate;

    public BookService(BookRepository bookRepository, MongoTemplate mongoTemplate) {
        this.bookRepository = bookRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public BookResponse addBook(BookRequest bookRequest) {
        Book book = convertToEntity(bookRequest);
        book = bookRepository.save(book);
        return convertToResponse(book);
    }

    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<String> getMetadataKeys() {
        return mongoTemplate.getCollection("reading")
                .distinct("metadata", org.bson.Document.class)
                .into(new java.util.ArrayList<org.bson.Document>())
                .stream()
                .filter(java.util.Objects::nonNull)
                .flatMap(doc -> doc.keySet().stream())
                .distinct()
                .sorted()
                .collect(java.util.stream.Collectors.toList());
    }

    private Book convertToEntity(BookRequest request) {
        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setMetadata(request.getMetadata());
        return book;
    }

    private BookResponse convertToResponse(Book book) {
        BookResponse response = new BookResponse();
        response.setId(book.getId());
        response.setTitle(book.getTitle());
        response.setMetadata(book.getMetadata());
        return response;
    }
}
