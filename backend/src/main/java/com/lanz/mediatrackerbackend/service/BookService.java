package com.lanz.mediatrackerbackend.service;

import com.lanz.mediatrackerbackend.dto.BookRequest;
import com.lanz.mediatrackerbackend.dto.BookResponse;
import com.lanz.mediatrackerbackend.dto.MetadataKeysResult;
import com.lanz.mediatrackerbackend.exception.ResourceNotFoundException;
import com.lanz.mediatrackerbackend.model.Book;
import com.lanz.mediatrackerbackend.repository.BookRepository;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final CacheManager cacheManager;


    public BookService(BookRepository bookRepository, CacheManager cacheManager) {
        this.bookRepository = bookRepository;
        this.cacheManager = cacheManager;
    }

    public BookResponse addBook(BookRequest bookRequest) {
        Book book = convertToEntity(bookRequest);
        book = bookRepository.save(book);

        updateMetadataCache(bookRequest.getMetadata().keySet());
        return convertToResponse(book);
    }

    public void deleteBook(String id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    public BookResponse updateBook(String id, BookRequest bookRequest) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        existingBook.setTitle(bookRequest.getTitle());
        existingBook.setMetadata(bookRequest.getMetadata());

        Book updatedBook = bookRepository.save(existingBook);
        updateMetadataCache(bookRequest.getMetadata().keySet());
        return convertToResponse(updatedBook);
    }

    // For legacy purposes only
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Page<BookResponse> getPageableBooks(Pageable pageable) {
        return bookRepository.findAll(pageable).map(this::convertToResponse);
    }

    @Cacheable(value = "readingMetaDataKeys", key = "'all'")
    public Set<String> getMetadataKeys() {
        List<MetadataKeysResult> results = bookRepository.findAllDistinctMetadataKeys();
        Set<String> readingKeyCache = ConcurrentHashMap.newKeySet();

        if (!results.isEmpty() && results.getFirst().getAllKeys() != null) {
            readingKeyCache.addAll(results.getFirst().getAllKeys());
        }

        return readingKeyCache;
    }


    private synchronized void updateMetadataCache(Set<String> inputKeys) {
        Cache cache = cacheManager.getCache("readingMetaDataKeys");

        if (cache != null) {
            @SuppressWarnings("unchecked")
            Set<String> cachedKeys = cache.get("all", Set.class);
            if (cachedKeys != null) {
                boolean hasNewKey = !cachedKeys.containsAll(inputKeys);
                if (hasNewKey) {
                    cachedKeys.addAll(inputKeys);
                    cache.put("all", cachedKeys);
                }
            }

        }
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
