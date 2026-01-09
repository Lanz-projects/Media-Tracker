package com.lanz.mediatrackerbackend.service;

import com.lanz.mediatrackerbackend.config.CacheConfig;
import com.lanz.mediatrackerbackend.dto.BookRequest;
import com.lanz.mediatrackerbackend.dto.BookResponse;
import com.lanz.mediatrackerbackend.exception.ResourceNotFoundException;
import com.lanz.mediatrackerbackend.model.Book;
import com.lanz.mediatrackerbackend.repository.BookRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = CacheConfig.BOOKS_PAGE_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.BOOK_METADATA_KEYS_CACHE, allEntries = true)
    })
    public BookResponse addBook(BookRequest bookRequest) {
        Book book = convertToEntity(bookRequest);
        book = bookRepository.save(book);
        return convertToResponse(book);
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = CacheConfig.BOOK_CACHE, key = "#id"),
            @CacheEvict(cacheNames = CacheConfig.BOOKS_PAGE_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.BOOK_METADATA_KEYS_CACHE, allEntries = true)
    })
    public void deleteBook(String id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = CacheConfig.BOOK_CACHE, key = "#id"),
            @CacheEvict(cacheNames = CacheConfig.BOOKS_PAGE_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.BOOK_METADATA_KEYS_CACHE, allEntries = true)
    })
    public BookResponse updateBook(String id, BookRequest bookRequest) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        existingBook.setTitle(bookRequest.getTitle());
        existingBook.setMetadata(bookRequest.getMetadata());

        Book updatedBook = bookRepository.save(existingBook);
        return convertToResponse(updatedBook);
    }

    @Cacheable(cacheNames = CacheConfig.BOOK_CACHE, key = "#id")
    public BookResponse findById(String id) {
        return bookRepository.findById(id)
                .map(this::convertToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }
    
    // For legacy purposes only
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(cacheNames = CacheConfig.BOOKS_PAGE_CACHE)
    public Page<BookResponse> getPageableBooks(Pageable pageable) {
        return bookRepository.findAll(pageable).map(this::convertToResponse);
    }

    @Cacheable(cacheNames = CacheConfig.BOOK_METADATA_KEYS_CACHE)
    public Set<String> getMetadataKeys() {
        return bookRepository.findAllDistinctMetadataKeys().stream()
                .flatMap(result -> result.getAllKeys().stream())
                .collect(Collectors.toSet());
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
