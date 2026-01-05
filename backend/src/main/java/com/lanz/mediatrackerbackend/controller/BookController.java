package com.lanz.mediatrackerbackend.controller;

import com.lanz.mediatrackerbackend.dto.BookRequest;
import com.lanz.mediatrackerbackend.dto.BookResponse;
import com.lanz.mediatrackerbackend.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponse addBook(@RequestBody BookRequest bookRequest) {
        return bookService.addBook(bookRequest);
    }

    @GetMapping
    public List<BookResponse> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/metadata-keys")
    public List<String> getMetadataKeys() {
        return bookService.getMetadataKeys();
    }
}

