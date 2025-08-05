package com.kathirvel.HME;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("com.kathirvel.HME.Model")
public class HmeApplication {
	public static void main(String[] args) {
		SpringApplication.run(HmeApplication.class, args);
	}
}
