package br.com.hu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import br.com.hu.App;

@SpringBootApplication
@EnableAutoConfiguration
public class App 
{
    public static void main( String[] args ){
    	SpringApplication.run(App.class);

    }
}