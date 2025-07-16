package org.mindup.backend.Security;

import com.google.common.util.concurrent.RateLimiter;
import jakarta.servlet.*;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter implements Filter {

    private final ConcurrentHashMap<String, RateLimiter> ipRateLimiters = new ConcurrentHashMap<>();

    private RateLimiter getRateLimiterForIp(String ip) {
        // Limit to 5 requests per second (configurable)
        return ipRateLimiters.computeIfAbsent(ip, k -> RateLimiter.create(5.0));
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        String ip = req.getRemoteAddr();
        RateLimiter limiter = getRateLimiterForIp(ip);

        if (!limiter.tryAcquire()) {
            res.setContentType("application/json");
            res.getWriter().write("{\"error\": \"Too many requests\"}");
            ((jakarta.servlet.http.HttpServletResponse) res).setStatus(429);
            return;
        }
        chain.doFilter(req, res);
    }
}
