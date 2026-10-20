
package com.jobtrack;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class JobApplicationController {

    private final JobApplicationRepository repository;

    public JobApplicationController(JobApplicationRepository repository) {
        this.repository = repository;
    }

    // Get all job applications
    @GetMapping("/applications")
    public List<JobApplication> getApplications() {
        return repository.findAll();
    }

    // Add a new job application
    @PostMapping("/applications")
    public JobApplication addApplication(
            @RequestBody JobApplication application) {
        application.setId(null);
        return repository.save(application);
    }

    // Update an existing job application
    @PutMapping("/applications/{id}")
    public JobApplication updateApplication(
            @PathVariable Long id,
            @RequestBody JobApplication updatedApplication) {

        JobApplication existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Application not found"));

        existing.setCompanyName(updatedApplication.getCompanyName());
        existing.setJobTitle(updatedApplication.getJobTitle());
        existing.setStatus(updatedApplication.getStatus());

        return repository.save(existing);
    }

    // Delete a job application
    @DeleteMapping("/applications/{id}")
    public void deleteApplication(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Application not found");
        }

        repository.deleteById(id);
    }
}
