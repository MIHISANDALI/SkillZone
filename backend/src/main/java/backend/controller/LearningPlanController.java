package backend.controller;

import backend.model.LearningPlan;
import backend.repository.LearningPlanRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    private final LearningPlanRepository learningPlanRepository;

    public LearningPlanController(LearningPlanRepository learningPlanRepository) {
        this.learningPlanRepository = learningPlanRepository;
    }

    @PostMapping
    public LearningPlan createLearningPlan(@RequestBody LearningPlan learningPlan) {
        return learningPlanRepository.save(learningPlan);
    }

    @GetMapping("/{userId}")
    public List<LearningPlan> getLearningPlans(@PathVariable String userId) {
        return learningPlanRepository.findByUserId(userId);
    }

    @PutMapping("/{id}")
    public LearningPlan updateLearningPlan(@PathVariable Long id, @RequestBody LearningPlan updatedPlan) {
        LearningPlan plan = learningPlanRepository.findById(id).orElseThrow();
        plan.setTitle(updatedPlan.getTitle());
        plan.setDescription(updatedPlan.getDescription());
        plan.setMilestones(updatedPlan.getMilestones());
        plan.setIsPublic(updatedPlan.getIsPublic());  // <-- fixed line
        return learningPlanRepository.save(plan);
    }

    @DeleteMapping("/{id}")
    public void deleteLearningPlan(@PathVariable Long id) {
        learningPlanRepository.deleteById(id);
    }
}
