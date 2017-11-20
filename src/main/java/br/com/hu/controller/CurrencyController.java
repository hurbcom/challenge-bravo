package br.com.hu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.hu.service.CurrencyService;

@RestController
@RequestMapping("v1")
public class CurrencyController {

	@Autowired
	private CurrencyService service;

	@RequestMapping(value = "/currency", method = RequestMethod.GET)
	public ResponseEntity<?> converter(@RequestParam String from, @RequestParam String to,
			@RequestParam String amount) {
		try {
			Double conversion = service.conversion(to, from, amount);
			return new ResponseEntity<Double>(conversion, HttpStatus.OK);
		} catch (NumberFormatException e) {
			return new ResponseEntity<String>("The amount format is wrong", HttpStatus.BAD_REQUEST);
		} catch (NullPointerException e) {
			return new ResponseEntity<String>("Paramter can not be null", HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}
}
