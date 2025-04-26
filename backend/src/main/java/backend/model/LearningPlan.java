package backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class LearningPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String userId; // (or relation to User)

    @ElementCollection
    private List<String> milestones; // list of milestone names

    private boolean isPublic;

    // getters and setters
}
