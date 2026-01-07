package com.lanz.mediatrackerbackend.controller;

import com.lanz.mediatrackerbackend.dto.BookRequest;
import com.lanz.mediatrackerbackend.dto.BookResponse;
import com.lanz.mediatrackerbackend.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

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

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) //
    public void deleteBook(@PathVariable String id) {
        bookService.deleteBook(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public BookResponse updateBook(@PathVariable String id, @RequestBody BookRequest bookRequest) {
        return bookService.updateBook(id, bookRequest);
    }

    @GetMapping
    public List<BookResponse> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/metadata-keys")
    public Set<String> getMetadataKeys() {
        return bookService.getMetadataKeys();
    }
}

