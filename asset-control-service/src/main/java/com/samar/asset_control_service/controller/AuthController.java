package com.samar.asset_control_service.controller;

import com.samar.asset_control_service.dtos.LoginRequest;
import com.samar.asset_control_service.entities.AppUser;
import com.samar.asset_control_service.repository.UserRepo;
import com.samar.asset_control_service.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map; // Used to return a simple JSON response

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest request) {
        // 1. Check if username exists
        if (userRepo.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        // 2. Create new user
        AppUser newUser = new AppUser();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword())); // HASH IT!
        newUser.setRole("USER"); // Default role is USER

        userRepo.save(newUser);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            if (authentication.isAuthenticated()) {
                // 1. Get the User Details
                // We cast the principal to UserDetails to read the authorities
                org.springframework.security.core.userdetails.UserDetails userDetails =
                        (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();

                // 2. Extract the Role (Assumes 1 role per user)
                // Spring Security stores roles as "ROLE_ADMIN" or "ROLE_USER"
                String role = userDetails.getAuthorities().stream()
                        .findFirst()
                        .get().getAuthority();

                // 3. Generate Token with Role
                String token = jwtUtil.generateToken(request.getUsername(), role);

                return ResponseEntity.ok(Map.of("token", token));
            } else {
                throw new UsernameNotFoundException("Invalid user request");
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid Username or Password");
        }
    }
}