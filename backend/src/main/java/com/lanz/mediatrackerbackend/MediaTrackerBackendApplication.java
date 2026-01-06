package com.lanz.mediatrackerbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class MediaTrackerBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(MediaTrackerBackendApplication.class, args);
    }

}
