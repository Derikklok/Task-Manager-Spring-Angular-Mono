package com.master.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatchTaskRequest {
    // All fields are optional for PATCH
    private String title;
    private String description;
    private String status; // TODO, IN_PROGRESS, COMPLETED
}

