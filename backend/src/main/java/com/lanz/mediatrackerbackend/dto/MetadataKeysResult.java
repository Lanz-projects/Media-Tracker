package com.lanz.mediatrackerbackend.dto;

import lombok.Data;

import java.util.Set;

@Data
public class MetadataKeysResult {
    private Set<String> allKeys;
}
