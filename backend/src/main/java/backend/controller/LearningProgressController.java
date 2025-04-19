package backend.controller;

import backend.exception.LearningProgressNotFoundException;
import backend.model.LearningProgressModel;
import backend.repository.LearningProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin("http://localhost:3000")
public class LearningProgressController {
    @Autowired
    private LearningProgressRepository learningProgressRepository;

    //Insert
    @PostMapping("/learningProgress")
    public LearningProgressModel newLearningProgressModel(@RequestBody LearningProgressModel newLearningProgressModel) {
        return learningProgressRepository.save(newLearningProgressModel);
    }

    @GetMapping("/learningProgress")
    List<LearningProgressModel> getAll() {
        return learningProgressRepository.findAll();
    }

    @GetMapping("/learningProgress/{id}")
    LearningProgressModel getById(@PathVariable String id) {
        return learningProgressRepository.findById(id)
                .orElseThrow(() -> new LearningProgressNotFoundException(id));
    }

    @PutMapping("/learningProgress/{id}")
    public LearningProgressModel update(@RequestParam(value = "image", required = false) MultipartFile image,
                                        @RequestParam(value = "pdf", required = false) MultipartFile pdf,
                                        @RequestPart("data") LearningProgressModel newLearningProgressModel,
                                        @PathVariable String id) throws IOException {
        return learningProgressRepository.findById(id)
                .map(learningProgressModel -> {
                    // Update fields
                    learningProgressModel.setSkillTitle(newLearningProgressModel.getSkillTitle());
                    learningProgressModel.setDescription(newLearningProgressModel.getDescription());
                    learningProgressModel.setPostOwnerID(newLearningProgressModel.getPostOwnerID());
                    learningProgressModel.setPostOwnerName(newLearningProgressModel.getPostOwnerName());
                    learningProgressModel.setField(newLearningProgressModel.getField());
                    learningProgressModel.setStartDate(newLearningProgressModel.getStartDate());
                    learningProgressModel.setEndDate(newLearningProgressModel.getEndDate());

                    // Handle image update
                    if (image != null && !image.isEmpty()) {
                        try {
                            // Delete old image if it exists
                            if (learningProgressModel.getImagePath() != null) {
                                File oldImage = new File(System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "Progress" + File.separator + learningProgressModel.getImagePath());
                                if (oldImage.exists()) {
                                    oldImage.delete();
                                }
                            }

                            // Save new image
                            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "Progress" + File.separator;
                            String uniqueFileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                            File file = new File(uploadDir + uniqueFileName);
                            image.transferTo(file);
                            learningProgressModel.setImagePath(uniqueFileName);
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to update image", e);
                        }
                    }

                    // Handle PDF update
                    if (pdf != null && !pdf.isEmpty()) {
                        try {
                            // Delete old PDF if it exists
                            if (learningProgressModel.getPdfPath() != null) {
                                File oldPDF = new File(System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "PDF" + File.separator + learningProgressModel.getPdfPath());
                                if (oldPDF.exists()) {
                                    oldPDF.delete();
                                }
                            }

                            // Save new PDF
                            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "PDF" + File.separator;
                            String uniqueFileName = UUID.randomUUID().toString() + "_" + pdf.getOriginalFilename();
                            File file = new File(uploadDir + uniqueFileName);
                            pdf.transferTo(file);
                            learningProgressModel.setPdfPath(uniqueFileName);
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to update PDF", e);
                        }
                    }

                    return learningProgressRepository.save(learningProgressModel);
                }).orElseThrow(() -> new LearningProgressNotFoundException(id));
    }

    @DeleteMapping("/learningProgress/{id}")
    public void delete(@PathVariable String id) {
        learningProgressRepository.deleteById(id);
    }

    @PostMapping("/learningProgress/uploadImage")
    public String uploadImage(@RequestParam("image") MultipartFile image) throws IOException {
        String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "Progress" + File.separator;
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs(); // Create the directory if it doesn't exist
        }
        String uniqueFileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        File file = new File(uploadDir + uniqueFileName);
        image.transferTo(file); // Save the file
        return uniqueFileName;
    }

    @PostMapping("/learningProgress/uploadPDF")
    public String uploadPDF(@RequestParam("pdf") MultipartFile pdf) throws IOException {
        String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "PDF" + File.separator;
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs(); // Create the directory if it doesn't exist
        }
        String uniqueFileName = UUID.randomUUID().toString() + "_" + pdf.getOriginalFilename();
        File file = new File(uploadDir + uniqueFileName);
        pdf.transferTo(file); // Save the file
        return uniqueFileName;
    }

    @GetMapping("/learningProgress/image/{fileName}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get(System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "Progress" + File.separator + fileName);
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_TYPE, "image/jpeg"); // Adjust content type as needed
                return new ResponseEntity<>(resource, headers, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/learningProgress/pdf/{fileName}")
    public ResponseEntity<Resource> getPDF(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get(System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "PDF" + File.separator + fileName);
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_TYPE, "application/pdf"); // Set content type for PDF
                return new ResponseEntity<>(resource, headers, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
