package com.lanz.mediatrackerbackend.dto;

import lombok.Data;

import java.util.Map;

@Data
public class BookRequest {

    private String title;
    private Map<String, Object> metadata;

}
