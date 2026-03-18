package com.master.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health Check Controller
 * 
 * Provides public health endpoints for monitoring and Docker health checks.
 * These endpoints are NOT protected and do NOT require JWT authentication.
 * Used by Docker Compose, load balancers, and monitoring tools.
 */
@RestController
@RequestMapping("/api/health")
public class HealthCheckController {

    /**
     * Simple health check endpoint
     * 
     * GET /api/health
     * Returns 200 OK if the service is running
     * 
     * Response: "OK"
     */
    @GetMapping
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }

    /**
     * Detailed health check endpoint
     * 
     * GET /api/health/detailed
     * Returns detailed health information about the service
     * 
     * Response: JSON with status, timestamp, and version info
     */
    @GetMapping("/detailed")
    public ResponseEntity<Map<String, Object>> healthDetailed() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now().toString());
        health.put("service", "Task Manager Backend");
        health.put("version", "0.0.1-SNAPSHOT");
        health.put("environment", System.getProperty("spring.profiles.active", "default"));
        
        return ResponseEntity.ok(health);
    }

    /**
     * Live endpoint (Kubernetes liveness probe)
     * 
     * GET /api/health/live
     * Returns 200 if the service is alive and responding
     * Used by Kubernetes or container orchestrators
     */
    @GetMapping("/live")
    public ResponseEntity<String> live() {
        return ResponseEntity.ok("LIVE");
    }

    /**
     * Ready endpoint (Kubernetes readiness probe)
     * 
     * GET /api/health/ready
     * Returns 200 if the service is ready to handle requests
     * Can check database connectivity if needed
     */
    @GetMapping("/ready")
    public ResponseEntity<String> ready() {
        return ResponseEntity.ok("READY");
    }
}

