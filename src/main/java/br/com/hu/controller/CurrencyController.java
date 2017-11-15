package br.com.hu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.hu.service.CurrencyService;

@RestController
@RequestMapping("v1/convertion")
public class CurrencyController {

	@Autowired
	private CurrencyService service;
}
