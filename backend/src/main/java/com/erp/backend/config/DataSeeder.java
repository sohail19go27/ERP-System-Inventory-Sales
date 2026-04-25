package com.erp.backend.config;

import com.erp.backend.models.Role;
import com.erp.backend.models.RoleName;
import com.erp.backend.models.User;
import com.erp.backend.repository.RoleRepository;
import com.erp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed all default Roles into the database if they don't exist
        for (RoleName roleName : RoleName.values()) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(new Role(roleName));
            }
        }

        // 2. Seed the default Admin user into the database if it doesn't exist
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User("admin", "admin@erpdemo.com", passwordEncoder.encode("password123"));
            
            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(adminRole);
            
            admin.setRoles(roles);
            userRepository.save(admin);
            System.out.println("✅ Default Admin account successfully seeded into the database!");
        }
    }
}
