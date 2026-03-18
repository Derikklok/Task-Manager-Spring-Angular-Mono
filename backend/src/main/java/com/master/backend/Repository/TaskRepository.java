package com.master.backend.Repository;

import com.master.backend.Model.Task;
import com.master.backend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Find all tasks for a specific user
     */
    List<Task> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Find a task by ID and user (ensures user can only access their own tasks)
     */
    Optional<Task> findByIdAndUser(Long id, User user);

    /**
     * Check if a task exists for a user
     */
    boolean existsByIdAndUser(Long id, User user);
}

