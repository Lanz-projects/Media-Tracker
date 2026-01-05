package com.lanz.mediatrackerbackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;

@Data
@Document(collection = "reading")
public class Book {
    @Id
    private String id;
    private String title;

    private Map<String, Object> metadata = new HashMap<>();
}
