package quoteservice.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy

@Configuration
@EnableWebSecurity
internal class APISecurityConfig : WebSecurityConfigurerAdapter() {
    @Value("\${quote-service.http.auth-token-header-name}")
    private val principalRequestHeader: String? = "Authorization"

    @Value("\${quote-service.http.auth-token}")
    private val principalRequestValue: String? = "c4bf1743-1725-4a47-acbc-69668962fcdc"

    @Throws(Exception::class)
    override fun configure(httpSecurity: HttpSecurity) {
        val filter = APIKeyAuthFilter(principalRequestHeader!!)
        filter.setAuthenticationManager { authentication ->
            val principal = authentication.principal as String
            if (principalRequestValue != principal) {
                throw BadCredentialsException("The API key was not found or not the expected value.")
            }
            authentication.isAuthenticated = true
            authentication
        }
        httpSecurity.antMatcher("/**").csrf().disable().sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().addFilter(filter).authorizeRequests()
            .anyRequest().authenticated()
    }
}