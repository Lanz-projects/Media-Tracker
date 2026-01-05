package com.lanz.mediatrackerbackend.repository;

import com.lanz.mediatrackerbackend.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookRepository extends MongoRepository<Book, String> {
}
