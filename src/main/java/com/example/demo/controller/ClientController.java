package com.example.demo.controller;

import com.example.demo.model.Category;
import com.example.demo.model.Item;
import com.example.demo.service.MenuService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
@CrossOrigin
public class ClientController {

    private final MenuService menuService;

    public ClientController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return menuService.getAllCategories();
    }

    @GetMapping("/items/{categoryId}")
    public List<Item> getItemsByCategory(@PathVariable Integer categoryId) {
        return menuService.getItemsByCategory(categoryId);
    }
}
