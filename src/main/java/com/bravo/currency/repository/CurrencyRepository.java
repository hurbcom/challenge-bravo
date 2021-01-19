package com.bravo.currency.repository;


import com.bravo.currency.model.Currency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrencyRepository extends JpaRepository<Currency, Long> {

  Currency findByCode(String value);

  boolean existsByCode(String value);
}
