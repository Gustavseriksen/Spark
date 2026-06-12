package com.gustaveriksen.spark.service;

import com.gustaveriksen.spark.dto.JobAdRequest;
import com.gustaveriksen.spark.dto.JobAdResponse;
import com.gustaveriksen.spark.entity.JobAd;
import com.gustaveriksen.spark.entity.User;
import com.gustaveriksen.spark.repository.JobAdRepository;
import com.gustaveriksen.spark.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JobAdService {

    private final JobAdRepository jobAdRepository;
    private final UserRepository userRepository;

    // Returns all job ads belonging to the given user
    public List<JobAdResponse> list(UUID userId) {
        return jobAdRepository.findByUserId(userId).stream()
                .map(JobAdResponse::new)
                .toList();
    }

    // Creates a new job ad owned by the given user
    @Transactional
    public JobAdResponse create(UUID userId, JobAdRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        JobAd jobAd = new JobAd();
        jobAd.setUser(user);
        applyRequest(jobAd, request);

        return new JobAdResponse(jobAdRepository.save(jobAd));
    }

    // Returns a single job ad by ID, verifying ownership
    public JobAdResponse get(UUID userId, UUID jobAdId) {
        return new JobAdResponse(findOwned(userId, jobAdId));
    }

    // Updates all fields on an existing job ad, verifying ownership
    @Transactional
    public JobAdResponse update(UUID userId, UUID jobAdId, JobAdRequest request) {
        JobAd jobAd = findOwned(userId, jobAdId);
        applyRequest(jobAd, request);
        return new JobAdResponse(jobAdRepository.save(jobAd));
    }

    // Deletes a job ad by ID, verifying ownership
    @Transactional
    public void delete(UUID userId, UUID jobAdId) {
        jobAdRepository.delete(findOwned(userId, jobAdId));
    }

    // Fetches a job ad and throws 404 if it doesn't exist or isn't owned by userId
    private JobAd findOwned(UUID userId, UUID jobAdId) {
        JobAd jobAd = jobAdRepository.findById(jobAdId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!jobAd.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return jobAd;
    }

    // Copies all request fields onto a JobAd entity (used by create and update)
    private void applyRequest(JobAd jobAd, JobAdRequest request) {
        jobAd.setTitle(request.getTitle());
        jobAd.setCompanyName(request.getCompanyName());
        jobAd.setStatus(request.getStatus());
        jobAd.setPostDate(request.getPostDate());
        jobAd.setStartDate(request.getStartDate());
        jobAd.setAppliedDate(request.getAppliedDate());
        jobAd.setLink(request.getLink());
        jobAd.setDescription(request.getDescription());
        jobAd.setTags(request.getTags());
        jobAd.setPriority(request.getPriority());
        jobAd.setSalary(request.getSalary());
        jobAd.setApplicationFollowUp(request.getApplicationFollowUp());
        jobAd.setInterviewFollowUp(request.getInterviewFollowUp());
        jobAd.setInterviewOffer(request.getInterviewOffer());
        jobAd.setJobOffer(request.getJobOffer());
    }
}
