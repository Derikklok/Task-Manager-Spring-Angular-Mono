package com.master.backend.Controller;

import com.master.backend.DTO.CreateTaskRequest;
import com.master.backend.DTO.PatchTaskRequest;
import com.master.backend.DTO.TaskResponse;
import com.master.backend.DTO.UpdateTaskRequest;
import com.master.backend.Service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@PreAuthorize("isAuthenticated()")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Get all tasks for the authenticated user
     * GET /api/tasks
     */
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(Authentication authentication) {
        String userEmail = authentication.getName();
        List<TaskResponse> tasks = taskService.getAllTasks(userEmail);
        return ResponseEntity.ok(tasks);
    }

    /**
     * Get a specific task by ID
     * GET /api/tasks/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        TaskResponse task = taskService.getTaskById(id, userEmail);
        return ResponseEntity.ok(task);
    }

    /**
     * Create a new task
     * POST /api/tasks
     */
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        TaskResponse task = taskService.createTask(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    /**
     * Update an entire task (Full update)
     * PUT /api/tasks/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        TaskResponse task = taskService.updateTask(id, request, userEmail);
        return ResponseEntity.ok(task);
    }

    /**
     * Partial update of a task
     * PATCH /api/tasks/{id}
     */
    @PatchMapping("/{id}")
    public ResponseEntity<TaskResponse> patchTask(
            @PathVariable Long id,
            @RequestBody PatchTaskRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        TaskResponse task = taskService.patchTask(id, request, userEmail);
        return ResponseEntity.ok(task);
    }

    /**
     * Delete a task
     * DELETE /api/tasks/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        taskService.deleteTask(id, userEmail);
        return ResponseEntity.noContent().build();
    }
}

