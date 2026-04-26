package com.gustaveriksen.spark.service;

import com.gustaveriksen.spark.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtService {
    
    private final JwtProperties jwtProperties;
    
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(UUID userId, String email) {
        return buildToken(userId, email, "access", jwtProperties.getAccessTokenTtlSeconds());
    }

    public String generateRefreshToken(UUID userId, String email) {
        return buildToken(userId, email, "refresh", jwtProperties.getRefreshTokenTtlSeconds());
    }

    private String buildToken(UUID userId, String email, String type, long ttlSeconds) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + ttlSeconds * 1000);
        return Jwts.builder()
                .subject(email)
                .claims(Map.of("uid", userId.toString(), "type", type))
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
    }

    public String extractEmail(String token) {
        return parse(token).getPayload().getSubject();
    }

    public String extractType(String token) {
        return parse(token).getPayload().get("type", String.class);
    }
}
