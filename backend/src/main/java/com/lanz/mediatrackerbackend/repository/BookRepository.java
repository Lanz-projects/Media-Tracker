package com.lanz.mediatrackerbackend.repository;

import com.lanz.mediatrackerbackend.dto.MetadataKeysResult;
import com.lanz.mediatrackerbackend.model.Book;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookRepository extends MongoRepository<Book, String> {
    @Aggregation(pipeline = {
            "{ '$project': { 'keys': { '$objectToArray': '$metadata' } } }",
            "{ '$unwind': '$keys' }",
            "{ '$group': { '_id': null, 'allKeys': { '$addToSet': '$keys.k' } } }"
    })
    List<MetadataKeysResult> findAllDistinctMetadataKeys();
}