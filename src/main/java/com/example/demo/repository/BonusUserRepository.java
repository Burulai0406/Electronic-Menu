
package com.example.demo.repository;

import com.example.demo.model.BonusUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BonusUserRepository extends JpaRepository<BonusUser, Long> {
    Optional<BonusUser> findByPhoneNumber(String phoneNumber);
}