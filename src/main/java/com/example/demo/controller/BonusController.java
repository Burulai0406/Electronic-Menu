
package com.example.demo.controller;

import com.example.demo.model.BonusUser;
import com.example.demo.repository.BonusUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/bonus")
@CrossOrigin(origins = "*")
public class BonusController {

    @Autowired
    private BonusUserRepository repo;


    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String phone = body.get("phone").replaceAll("\\D", "").trim();

        if (phone.length() != 10 || !phone.matches("\\d{10}")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Неверный формат номера"));
        }

        BonusUser user = repo.findByPhoneNumber(phone)
                .orElseGet(() -> {
                    BonusUser newUser = new BonusUser();
                    newUser.setPhoneNumber(phone);
                    newUser.setBonusAmount(0);
                    return repo.save(newUser);
                });

        return ResponseEntity.ok(Map.of(
                "bonus", user.getBonusAmount(),
                "phone", user.getPhoneNumber()
        ));
    }


    @PostMapping("/add")
    public ResponseEntity<Map<String, Integer>> addBonus(@RequestBody Map<String, Object> body) {
        String phone = (String) body.get("phone");
        Integer points = (Integer) body.get("points");

        BonusUser user = repo.findByPhoneNumber(phone)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        user.setBonusAmount(user.getBonusAmount() + points);
        user.setUpdatedAt(LocalDateTime.now());
        repo.save(user);

        return ResponseEntity.ok(Map.of("newBonus", user.getBonusAmount()));
    }
}