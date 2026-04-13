package com.gustaveriksen.spark;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// We feed the H2 fake database settings directly into the test itself!
@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driverClassName=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect"
})
class DemoApplicationTests {

    @Test
    void contextLoads() {
        // If this test passes, it means the application successfully booted up!
    }

}