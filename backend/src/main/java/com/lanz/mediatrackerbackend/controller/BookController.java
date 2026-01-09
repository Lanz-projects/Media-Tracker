package com.lanz.mediatrackerbackend.controller;

import com.lanz.mediatrackerbackend.dto.BookRequest;
import com.lanz.mediatrackerbackend.dto.BookResponse;
import com.lanz.mediatrackerbackend.service.BookService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final PagedResourcesAssembler<BookResponse> pagedResourcesAssembler;

    public BookController(BookService bookService, PagedResourcesAssembler<BookResponse> pagedResourcesAssembler) {
        this.bookService = bookService;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
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

    @GetMapping("/{id}")
    public BookResponse getBookById(@PathVariable String id) {
        return bookService.findById(id);
    }

    @GetMapping
    public List<BookResponse> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/pages")
    public PagedModel<EntityModel<BookResponse>> getBooks(@PageableDefault(size = 20, sort = "title", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<BookResponse> page = bookService.getPageableBooks(pageable);
        return pagedResourcesAssembler.toModel(page);
    }

    @GetMapping("/metadata-keys")
    public Set<String> getMetadataKeys() {
        return bookService.getMetadataKeys();
    }
}

