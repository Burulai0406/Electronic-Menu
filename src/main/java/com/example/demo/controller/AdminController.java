package com.example.demo.controller;

import com.example.demo.model.Category;
import com.example.demo.model.Item;
import com.example.demo.service.MenuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    private final MenuService menuService;

    public AdminController(MenuService menuService) {
        this.menuService = menuService;
    }

    // Categories
    @GetMapping("/categories")
    public List<Category> getCategories() {
        return menuService.getAllCategories();
    }

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        Category saved = menuService.saveCategory(category);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        menuService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }

    // Items
    @PostMapping("/items")
    public ResponseEntity<?> createItem(@RequestBody Item item) {
        // sanity check: category must exist
        if (item.getCategory() == null || item.getCategory().getId() == null) {
            return ResponseEntity.badRequest().body("Category required");
        }
        Optional<Category> cat = menuService.getCategoryById(item.getCategory().getId());
        if (cat.isEmpty()) return ResponseEntity.badRequest().body("Category not found");
        item.setCategory(cat.get());
        Item saved = menuService.saveItem(item);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Integer id) {
        menuService.deleteItem(id);
        return ResponseEntity.ok().build();
    }
}
