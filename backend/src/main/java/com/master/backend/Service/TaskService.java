package com.master.backend.Service;

import com.master.backend.DTO.CreateTaskRequest;
import com.master.backend.DTO.PatchTaskRequest;
import com.master.backend.DTO.TaskResponse;
import com.master.backend.DTO.UpdateTaskRequest;
import com.master.backend.Exception.ApiException;
import com.master.backend.Model.Task;
import com.master.backend.Model.User;
import com.master.backend.Repository.TaskRepository;
import com.master.backend.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get all tasks for the authenticated user
     */
    public List<TaskResponse> getAllTasks(String userEmail) {
        User user = getUserByEmail(userEmail);
        return taskRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific task by ID for the authenticated user
     */
    public TaskResponse getTaskById(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ApiException("Task not found", HttpStatus.NOT_FOUND));
        return convertToResponse(task);
    }

    /**
     * Create a new task for the authenticated user
     */
    public TaskResponse createTask(CreateTaskRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);

        // Validate status if provided
        if (request.getStatus() != null) {
            validateStatus(request.getStatus());
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : "TODO")
                .user(user)
                .build();

        Task savedTask = taskRepository.save(task);
        return convertToResponse(savedTask);
    }

    /**
     * Update an entire task (PUT request)
     */
    public TaskResponse updateTask(Long id, UpdateTaskRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ApiException("Task not found", HttpStatus.NOT_FOUND));

        // Validate status
        validateStatus(request.getStatus());

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());

        Task updatedTask = taskRepository.save(task);
        return convertToResponse(updatedTask);
    }

    /**
     * Partial update of a task (PATCH request)
     */
    public TaskResponse patchTask(Long id, PatchTaskRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ApiException("Task not found", HttpStatus.NOT_FOUND));

        // Update only provided fields
        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            validateStatus(request.getStatus());
            task.setStatus(request.getStatus());
        }

        Task updatedTask = taskRepository.save(task);
        return convertToResponse(updatedTask);
    }

    /**
     * Delete a task
     */
    public void deleteTask(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        if (!taskRepository.existsByIdAndUser(id, user)) {
            throw new ApiException("Task not found", HttpStatus.NOT_FOUND);
        }
        taskRepository.deleteById(id);
    }

    /**
     * Get user by email, throw exception if not found
     */
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.UNAUTHORIZED));
    }

    /**
     * Validate task status
     */
    private void validateStatus(String status) {
        if (!status.matches("^(TODO|IN_PROGRESS|COMPLETED)$")) {
            throw new ApiException("Invalid status. Must be TODO, IN_PROGRESS, or COMPLETED",
                    HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Convert Task entity to TaskResponse DTO
     */
    private TaskResponse convertToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .userId(task.getUser().getId())
                .userEmail(task.getUser().getEmail())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}

