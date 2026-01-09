package com.lanz.mediatrackerbackend.config;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Caffeine;

@Configuration
@EnableCaching
public class CacheConfig {

    public static final String BOOKS_PAGE_CACHE = "booksPageCache";
    public static final String BOOK_CACHE = "bookCache";
    public static final String BOOK_METADATA_KEYS_CACHE = "bookMetadataKeysCache";
    public static final int MAX_SIZE = 5;
    public static final int EXPIRE_AFTER = 10;

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();

        cacheManager.registerCustomCache(BOOKS_PAGE_CACHE, Caffeine.newBuilder()
                .maximumSize(MAX_SIZE)
                .expireAfterAccess(EXPIRE_AFTER, TimeUnit.MINUTES)
                .build());

        cacheManager.registerCustomCache(BOOK_CACHE, Caffeine.newBuilder()
                .build());

        cacheManager.registerCustomCache(BOOK_METADATA_KEYS_CACHE, Caffeine.newBuilder()
                .build());

        cacheManager.setCacheNames(Arrays.asList(BOOKS_PAGE_CACHE, BOOK_CACHE, BOOK_METADATA_KEYS_CACHE));
        return cacheManager;
    }
}
