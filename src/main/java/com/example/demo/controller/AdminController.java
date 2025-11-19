package com.example.demo.controller;

import com.example.demo.model.Category;
import com.example.demo.model.Item;
import com.example.demo.service.MenuService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    private final MenuService menuService;

    public AdminController(MenuService menuService) {
        this.menuService = menuService;
    }

    // --- Категории ---
    @PostMapping("/categories")
    public Category addCategory(@RequestBody Category category) {
        return menuService.saveCategory(category);
    }

    @DeleteMapping("/categories/{id}")
    public void deleteCategory(@PathVariable Integer id) {
        menuService.deleteCategory(id);
    }

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return menuService.getAllCategories();
    }

    // --- Позиции ---
    @PostMapping("/items")
    public Item addItem(@RequestBody Item item) {
        return menuService.saveItem(item);
    }

    @DeleteMapping("/items/{id}")
    public void deleteItem(@PathVariable Integer id) {
        menuService.deleteItem(id);
    }
}
