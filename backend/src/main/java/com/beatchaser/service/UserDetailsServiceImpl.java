package com.beatchaser.service;

import com.beatchaser.dto.user.CustomUserDetails;
import com.beatchaser.model.User;
import com.beatchaser.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new CustomUserDetails(
                user.getId(),
                user.getUsername(),
                user.getPasswordHash(),
                user.getEmail(),
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
