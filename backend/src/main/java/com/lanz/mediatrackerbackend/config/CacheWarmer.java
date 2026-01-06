package com.lanz.mediatrackerbackend.config;

import com.lanz.mediatrackerbackend.service.BookService;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Component
public class CacheWarmer implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(CacheWarmer.class);
    private final BookService bookService;

    public CacheWarmer(BookService bookService) {
        this.bookService = bookService;
    }

    @Override
    public void run(@NonNull ApplicationArguments args) { // Removed 'throws Exception'
        logger.info("🚀 Starting Metadata Cache Warmup...");

        try {
            int keyCount = bookService.getMetadataKeys().size();
            logger.info("Metadata Cache Warmup Complete. Cached {} unique keys.", keyCount);
        } catch (Exception e) {
            // Catching 'Exception' here is fine to prevent startup crashes,
            // but the 'throws' in the signature is what triggered your warning.
            logger.error("Failed to warm metadata cache: {}", e.getMessage());
        }
    }
}