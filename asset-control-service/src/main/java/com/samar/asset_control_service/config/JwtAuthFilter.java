package com.samar.asset_control_service.config;

import com.samar.asset_control_service.service.CustomUserService;
import com.samar.asset_control_service.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserService userService;

    public JwtAuthFilter(JwtUtil jwtUtil, CustomUserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Look for the "Authorization" Header
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 2. If no header, or doesn't start with "Bearer ", just continue (User is anonymous)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extract the Token (Remove "Bearer " prefix)
        jwt = authHeader.substring(7);
        username = jwtUtil.extractUsername(jwt);

        // 4. If username found AND nobody is currently logged in...
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 5. Load user details from DB
            UserDetails userDetails = this.userService.loadUserByUsername(username);

            // 6. Validate token
            if (jwtUtil.validateToken(jwt, userDetails)) {

                // 7. Create the Authentication Token manually
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 8. FINAL STEP: Tell Spring Security "This user is valid!"
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 9. Continue the filter chain
        filterChain.doFilter(request, response);
    }
}